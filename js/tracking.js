/*
 * 박사장 클라쓰 · GA4 이벤트 (GTM dataLayer) — 이벤트 이름·파라미터는 이 파일에서만 정한다.
 *
 * - GTM: js/config.js 의 gtmId 로 불러온다. 자리표시(GTM-XXXXXXX)인 동안은 불러오지 않고 dataLayer 에만 쌓는다.
 * - 페이지 스크립트는 PSC.events.xxx() 만 부른다 (dataLayer.push 를 흩어 쓰지 않음).
 * - page_view 는 GTM(GA4 구성 태그)이 자동으로 보낸다 → 여기서 push 하지 않는다.
 * - ?debug=1 : 이벤트마다 콘솔 출력 + 오른쪽 아래 로그 상자 (sessionStorage 로 페이지를 넘어가도 유지, ?debug=0 으로 끔)
 * - 개인정보(이름·연락처)는 절대 넣지 않는다.
 *
 * <head> 에서 config.js · common.js 다음에 불러온다.
 */
(function () {
  var C = window.PSC_CONFIG || {};
  var PSC = (window.PSC = window.PSC || {});
  window.dataLayer = window.dataLayer || [];

  // docs/landing-content.md 7장 · 이 목록에 없는 이벤트는 보내지 않는다 (page_view 는 GTM 자동)
  var ALLOWED = {
    click_cta: 1,
    generate_lead: 1,
    file_download: 1,
    view_item: 1,
    begin_checkout: 1,
    purchase: 1,
    start_diagnosis: 1,
    complete_diagnosis: 1,
    register_live: 1,
    submit_survey: 1,
  };

  // ---------------- GTM ----------------
  var gtmId = String(C.gtmId || '');
  var gtmOn = /^GTM-[A-Z0-9]+$/.test(gtmId) && gtmId !== 'GTM-XXXXXXX';
  if (gtmOn) {
    (function (w, d, s, l, i) {
      w[l] = w[l] || [];
      w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
      var f = d.getElementsByTagName(s)[0];
      var j = d.createElement(s);
      j.async = true;
      j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i;
      f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', gtmId);
  }

  // ---------------- UTM (첫 방문 값을 이 탭 동안 유지) ----------------
  var UTM_KEY = 'psc_utm';
  if (!PSC.store.get(UTM_KEY, 'session')) {
    var utm = {};
    ['utm_source', 'utm_medium', 'utm_campaign'].forEach(function (k) {
      var v = PSC.param(k);
      if (v) utm[k] = v.toLowerCase();
    });
    if (Object.keys(utm).length) PSC.store.set(UTM_KEY, JSON.stringify(utm), 'session');
  }
  PSC.utm = function () {
    try {
      return JSON.parse(PSC.store.get(UTM_KEY, 'session')) || {};
    } catch (e) {
      return {};
    }
  };

  // ---------------- 디버그 ----------------
  var DBG_KEY = 'psc_debug';
  var LOG_KEY = 'psc_debug_log';
  var dq = PSC.param('debug');
  if (dq === '1') PSC.store.set(DBG_KEY, '1', 'session');
  if (dq === '0') {
    try {
      sessionStorage.removeItem(DBG_KEY);
      sessionStorage.removeItem(LOG_KEY);
    } catch (e) {}
  }
  var debug = PSC.store.get(DBG_KEY, 'session') === '1';
  var pageName = (location.pathname.split('/').pop() || 'index.html') + location.search.replace(/[?&]debug=1/, '').replace(/^&/, '?');
  var nav = (window.performance && performance.getEntriesByType && performance.getEntriesByType('navigation')[0]) || {};
  // 새로고침 · 뒤로/앞으로 가기로 다시 열린 화면 (화면을 여는 순간 나가는 이벤트는 다시 보내지 않음)
  var isReload = nav.type === 'reload' || nav.type === 'back_forward';

  function readLog() {
    try {
      return JSON.parse(PSC.store.get(LOG_KEY, 'session')) || [];
    } catch (e) {
      return [];
    }
  }
  function log(entry) {
    if (!debug) return;
    entry.time = new Date().toTimeString().slice(0, 8);
    if (entry.t === 'event') console.log('%c[dataLayer] ' + entry.name, 'color:#D9622B;font-weight:bold', entry.params);
    if (entry.t === 'var') console.log('%c[dataLayer] 변수', 'color:#2F7D6D;font-weight:bold', entry.data);
    if (entry.t === 'skip') console.log('%c[dataLayer] 건너뜀 ' + entry.name, 'color:#999', entry.why);
    var arr = readLog();
    arr.push(entry);
    PSC.store.set(LOG_KEY, JSON.stringify(arr.slice(-40)), 'session');
    render();
  }

  // ---------------- 전송 ----------------
  /**
   * track(이벤트명, 파라미터, [done])
   * done 이 있으면 GTM 전송을 기다렸다가(최대 0.8초) 실행 → 페이지 이동 직전 이벤트 유실 방지
   */
  PSC.track = function (name, params, done) {
    var finished = false;
    function fin() {
      if (finished) return;
      finished = true;
      if (done) done();
    }
    if (!ALLOWED[name]) {
      console.warn('[tracking] 이벤트 목록에 없는 이름이라 보내지 않았어요:', name);
      fin();
      return;
    }
    var payload = { event: name };
    Object.keys(params || {}).forEach(function (k) {
      payload[k] = params[k];
    });
    if (done && gtmOn) {
      payload.eventCallback = fin;
      payload.eventTimeout = 600;
      setTimeout(fin, 800);
    }
    window.dataLayer.push(payload);
    log({ t: 'event', name: name, params: params || {} });
    if (done && !gtmOn) setTimeout(fin, 0);
  };

  // 실험 그룹 등 "이벤트가 아닌 변수" push 도 로그에 남긴다
  var baseDl = PSC.dl;
  PSC.dl = function (obj) {
    baseDl(obj);
    log({ t: 'var', data: obj });
  };

  function once(key) {
    var k = 'psc_sent_' + key;
    if (PSC.store.get(k, 'session')) return false;
    PSC.store.set(k, '1', 'session');
    return true;
  }
  function product(id) {
    return (window.PSC_PRODUCTS || {})[id];
  }
  // 화면을 여는 순간 나가는 이벤트는 새로고침이면 다시 보내지 않는다
  function onLoadEvent(name, params) {
    if (isReload) {
      log({ t: 'skip', name: name, why: '새로고침·뒤로 가기 — 중복 전송 안 함' });
      return;
    }
    PSC.track(name, params);
  }

  // ---------------- 이벤트 11개 (이름·파라미터는 landing-content.md 7장 표 그대로) ----------------
  PSC.events = {
    // index.html 히어로·최종 CTA
    ctaClick: function (position, done) {
      PSC.track('click_cta', { button_position: position }, done);
    },
    // 체크리스트 신청 · 셀프 진단 연락처 등록 · 15분 상담 예약 완료
    lead: function (leadType, marketingConsent, done) {
      PSC.track('generate_lead', { lead_type: leadType, marketing_consent: !!marketingConsent }, done);
    },
    // D-7 체크리스트 다운로드
    download: function (fileName) {
      PSC.track('file_download', { file_name: fileName });
    },
    // 템플릿·코칭 상세 열람
    viewItem: function (itemId, price) {
      var p = product(itemId);
      if (!p) return;
      onLoadEvent('view_item', { item_name: p.name, price: price, currency: 'KRW' });
    },
    // 주문서 진입
    beginCheckout: function (itemId, value, discountApplied) {
      var p = product(itemId);
      if (!p) return;
      onLoadEvent('begin_checkout', { item_name: p.name, value: value, discount_applied: !!discountApplied, currency: 'KRW' });
    },
    // 구매·결제 완료 — 주문서를 거친 주문만, 같은 주문번호는 한 번만
    // (주소 직접 열기 · 새로고침 · 뒤로 가기로 다시 들어와도 다시 보내지 않음)
    purchase: function (order) {
      var p = product(order.item);
      if (!p) return;
      if (!order.fromCheckout) {
        log({ t: 'skip', name: 'purchase', why: '주문서를 거치지 않은 접속 (주소 직접 열기)' });
        return;
      }
      if (!once('purchase_' + order.id)) {
        log({ t: 'skip', name: 'purchase', why: '이미 보낸 주문번호 ' + order.id });
        return;
      }
      PSC.track('purchase', { transaction_id: order.id, item_name: p.name, value: order.value, currency: 'KRW' });
    },
    // 셀프 진단 1번 문항 시작
    startDiagnosis: function () {
      PSC.track('start_diagnosis', { source: PSC.utm().utm_source || 'direct' });
    },
    // 10문항 응답 완료
    completeDiagnosis: function (scoreBand) {
      PSC.track('complete_diagnosis', { score_band: scoreBand });
    },
    // 무료 Zoom 라이브 신청 완료
    registerLive: function (liveRound, done) {
      PSC.track('register_live', { live_round: liveRound }, done);
    },
    // 만족도·추천 설문 제출
    submitSurvey: function (surveyType, satisfaction, recommend) {
      PSC.track('submit_survey', { survey_type: surveyType, satisfaction: satisfaction, recommend: recommend });
    },
  };

  // ---------------- 디버그 로그 상자 ----------------
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function fmt(v) {
    return typeof v === 'string' ? v : JSON.stringify(v);
  }
  function render() {
    if (!debug) return;
    if (!document.body) return; // DOMContentLoaded 때 다시 그림
    var box = document.getElementById('psc-debug');
    if (!box) {
      box = el('aside', 'debug-box');
      box.id = 'psc-debug';
      box.setAttribute('aria-label', '이벤트 로그 (디버그)');
      var head = el('div', 'debug-head');
      head.appendChild(el('b', null, 'dataLayer 이벤트 로그'));
      head.appendChild(el('span', 'debug-gtm', gtmOn ? 'GTM ' + gtmId : 'GTM 미설치 · dataLayer만 기록'));
      var btn = el('button', 'debug-toggle', '접기');
      btn.type = 'button';
      btn.addEventListener('click', function () {
        box.classList.toggle('is-min');
        btn.textContent = box.classList.contains('is-min') ? '펴기' : '접기';
      });
      head.appendChild(btn);
      box.appendChild(head);
      box.appendChild(el('ol', 'debug-list'));
      document.body.appendChild(box);
    }
    var list = box.querySelector('.debug-list');
    list.innerHTML = '';
    readLog().forEach(function (e) {
      var li;
      if (e.t === 'page') {
        li = el('li', 'debug-page' + (e.current ? ' is-current' : ''));
        li.appendChild(el('span', null, '▸ ' + e.page));
        li.appendChild(el('small', null, 'page_view (GTM 자동)'));
      } else if (e.t === 'var') {
        li = el(
          'li',
          'debug-var',
          Object.keys(e.data)
            .map(function (k) {
              return k + ' = ' + fmt(e.data[k]);
            })
            .join(', ')
        );
      } else if (e.t === 'skip') {
        li = el('li', 'debug-skip', e.name + ' 건너뜀 · ' + e.why);
      } else {
        li = el('li', 'debug-event');
        li.appendChild(el('b', null, e.name));
        var ps = Object.keys(e.params || {})
          .map(function (k) {
            return k + ': ' + fmt(e.params[k]);
          })
          .join(' · ');
        if (ps) li.appendChild(el('span', null, ps));
      }
      list.appendChild(li);
    });
    list.scrollTop = list.scrollHeight;
    // 페이지 맨 아래(버튼·푸터)가 로그 상자에 가리지 않도록 상자 높이만큼 아래 여백
    document.body.style.paddingBottom = box.offsetHeight + 24 + 'px';
  }

  if (debug) {
    // 이 페이지 구분선 (이전 줄의 '현재' 표시는 지운다)
    var arr = readLog().map(function (e) {
      if (e.t === 'page') e.current = false;
      return e;
    });
    arr.push({ t: 'page', page: pageName, current: true, time: new Date().toTimeString().slice(0, 8) });
    PSC.store.set(LOG_KEY, JSON.stringify(arr.slice(-40)), 'session');
    console.log('%c[tracking] 디버그 모드 · ' + pageName + (gtmOn ? '' : ' · GTM 미설치(자리표시 ID)'), 'color:#1F3A5A;font-weight:bold');
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
    else render();
  }
})();
