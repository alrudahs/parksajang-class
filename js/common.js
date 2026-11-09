/*
 * 박사장 클라쓰 · 모든 페이지 공통 도우미
 * <head>에서 config.js 다음에 바로 불러온다 (헤드라인 A/B를 그리기 전에 정해야 해서).
 */
(function () {
  var C = window.PSC_CONFIG || {};
  var PSC = (window.PSC = window.PSC || {});

  // 저장소 — 시크릿 창 등에서 막혀 있어도 페이지가 깨지지 않게
  function area(kind) {
    try {
      return kind === 'session' ? window.sessionStorage : window.localStorage;
    } catch (e) {
      return null;
    }
  }
  PSC.store = {
    get: function (key, kind) {
      try {
        var s = area(kind);
        return s ? s.getItem(key) : null;
      } catch (e) {
        return null;
      }
    },
    set: function (key, value, kind) {
      try {
        var s = area(kind);
        if (s) s.setItem(key, value);
      } catch (e) {}
    },
  };

  PSC.param = function (name) {
    try {
      return new URLSearchParams(window.location.search).get(name);
    } catch (e) {
      return null;
    }
  };

  // GTM dataLayer에 값 넣기 (이벤트 전송은 tracking.js 의 track() 사용)
  PSC.dl = function (obj) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(obj);
  };

  /**
   * A/B 그룹 정하기
   * 1) 주소 파라미터가 있으면 그것  2) abTest.enabled 이면 무작위 배정 후 기억  3) 아니면 기본값
   */
  PSC.variant = function (key, param, allowed, fallback) {
    var q = (PSC.param(param) || '').toLowerCase();
    if (allowed.indexOf(q) !== -1) return q;
    if (C.abTest && C.abTest.enabled) {
      var storeKey = 'psc_exp_' + key;
      var saved = PSC.store.get(storeKey);
      if (allowed.indexOf(saved) !== -1) return saved;
      var picked = allowed[Math.floor(Math.random() * allowed.length)];
      PSC.store.set(storeKey, picked);
      return picked;
    }
    return fallback;
  };

  PSC.won = function (n) {
    return Number(n).toLocaleString('ko-KR');
  };

  /*
   * 3일 한정 할인 — 체크리스트 신청 시각만 localStorage 에 남긴다 (개인정보 아님)
   */
  var OFFER_KEY = 'psc_signup_at';
  var OFFER_WINDOW = 3 * 24 * 60 * 60 * 1000;
  PSC.offer = {
    start: function () {
      var t = Number(PSC.store.get(OFFER_KEY));
      if (!t || Date.now() - t > OFFER_WINDOW) PSC.store.set(OFFER_KEY, String(Date.now()));
    },
    remaining: function () {
      var t = Number(PSC.store.get(OFFER_KEY));
      return t ? Math.max(0, t + OFFER_WINDOW - Date.now()) : 0;
    },
    active: function () {
      return PSC.offer.remaining() > 0;
    },
    format: function (ms) {
      // 내림: 신청 직후 "2일 23시간 59분" (올림이면 "3일 0시간 0분"으로 어색해짐)
      var min = Math.floor(ms / 60000);
      if (min < 1) return '1분 미만';
      var d = Math.floor(min / 1440);
      var h = Math.floor((min % 1440) / 60);
      var m = min % 60;
      return (d ? d + '일 ' : '') + (d || h ? h + '시간 ' : '') + m + '분';
    },
    // [data-countdown] 요소에 "할인 마감까지 2일 23시간 59분" 표시, 1분마다 갱신
    bindCountdowns: function () {
      var nodes = document.querySelectorAll('[data-countdown]');
      if (!nodes.length) return;
      function tick() {
        var ms = PSC.offer.remaining();
        Array.prototype.forEach.call(nodes, function (el) {
          el.textContent = ms > 0 ? '할인 마감까지 ' + PSC.offer.format(ms) : '할인 기간이 끝났어요';
        });
      }
      tick();
      setInterval(tick, 30000);
    },
  };

  /*
   * 입력값 넘기기 — 저장하지 않고 "다음 화면에 보여주는 용도"로만 쓴다.
   * sessionStorage(이 탭에서만, 탭을 닫으면 사라짐)에 잠깐 두고, 구매 완료 화면에서 지운다.
   * 서버 전송 없음 · dataLayer 에도 넣지 않음.
   */
  var LEAD_KEY = 'psc_lead';
  PSC.lead = {
    set: function (obj) {
      PSC.store.set(LEAD_KEY, JSON.stringify(obj), 'session');
    },
    get: function () {
      try {
        return JSON.parse(PSC.store.get(LEAD_KEY, 'session')) || {};
      } catch (e) {
        return {};
      }
    },
    clear: function () {
      try {
        window.sessionStorage.removeItem(LEAD_KEY);
      } catch (e) {}
    },
  };

  /*
   * 폼 검사 도우미 — 빈칸이면 제출 막고 칸 아래에 이유 표시
   * rules: { 필드name: function(value) { return '오류 문구' | '' } }
   */
  PSC.validate = function (form, rules) {
    var firstBad = null;
    Object.keys(rules).forEach(function (name) {
      var input = form.elements[name];
      if (!input) return;
      var msg = rules[name]((input.value || '').trim());
      var field = input.closest('.field');
      var out = field && field.querySelector('.error-msg');
      if (field) field.classList.toggle('is-error', !!msg);
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (out) out.textContent = msg;
      if (msg && !firstBad) firstBad = input;
    });
    if (firstBad) firstBad.focus();
    return !firstBad;
  };

  /*
   * 제출 연타 막기 — 다음 화면으로 넘어가기 전에 다시 눌러도 이벤트를 다시 보내지 않는다.
   * repeated(): 첫 제출이면 false, 다시 누른 제출이면 true (이동이 끊겼으면 다시 이동시킨다)
   * go(주소): 이벤트 전송이 끝난 뒤 이동할 함수를 돌려준다
   */
  PSC.submitOnce = function () {
    var sent = false;
    var target = '';
    // 뒤로 가기로 돌아온 화면에서 제출하면 새 신청으로 센다
    window.addEventListener('pageshow', function (e) {
      if (e.persisted) {
        sent = false;
        target = '';
      }
    });
    return {
      repeated: function () {
        if (!sent) {
          sent = true;
          return false;
        }
        if (target) window.location.href = target;
        return true;
      },
      go: function (href) {
        return function () {
          target = href;
          window.location.href = href;
        };
      },
    };
  };

  PSC.isEmail = function (v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  };

  // 공통 연락처 규칙: 카카오톡 아이디 또는 이메일
  PSC.contactRule = function (v) {
    if (!v) return '카카오톡 아이디 또는 이메일을 입력해 주세요';
    if (v.indexOf('@') !== -1 && !PSC.isEmail(v)) return '이메일 형식을 확인해 주세요';
    return '';
  };
  PSC.nameRule = function (v) {
    return v ? '' : '이름을 입력해 주세요';
  };

  PSC.escape = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      PSC.offer.bindCountdowns();
    });
  } else {
    PSC.offer.bindCountdowns();
  }

  // 채널: virtual 이 아니면 링크로 바꾼다
  function applyChannels() {
    var nodes = document.querySelectorAll('[data-channel]');
    Array.prototype.forEach.call(nodes, function (el) {
      var ch = C.channels && C.channels[el.getAttribute('data-channel')];
      if (!ch || ch.virtual) return;
      var a = document.createElement('a');
      a.href = ch.url;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = ch.label;
      el.replaceWith(a);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyChannels);
  } else {
    applyChannels();
  }
})();
