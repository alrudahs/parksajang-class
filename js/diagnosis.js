/*
 * 경로 B · 1인 매장 운영 셀프 진단 (2026-11-15 피드백 2차 개편)
 * diagnosis.html        시작 → 10문항(했어요 / 하는 중 / 아직이에요) → 결과 미리보기(준비 단계만) + 연락처 등록
 * diagnosis-result.html 준비 단계 + 지금 먼저 챙길 3가지(가장 약한 항목 기준) + 단계별 안내
 *
 * 채점 (화면에는 점수를 보여주지 않고 준비 단계만 보여준다)
 *   일반 문항 8개: 했어요 2 · 하는 중 1 · 아직이에요 0
 *   함정 문항 2개 (Q4·Q9, 그럴듯하지만 실제로는 위험한 행동): 했어요 -1(감점) · 하는 중 0 · 아직이에요 2
 *   합계(0~20, 0 아래는 0) → 15 이상 마무리 단계(high) · 9~14 진행 단계(mid) · 8 이하 시작 단계(low)
 *   → 모두 '했어요'만 누르면 14점 = 진행 단계 (예전 방식은 10점 '상')
 *   complete_diagnosis 의 score_band 값(high / mid / low)은 그대로
 *
 * 테스트·캡처용 주소
 *   diagnosis.html?view=question            1번 문항 화면
 *   diagnosis.html?view=preview[&demo=mid]  결과 미리보기 (답이 없으면 demo 답안)
 *   diagnosis-result.html?demo=high|mid|low 단계별 전체 결과
 */
(function () {
  // 일반 문항 문구는 docs/landing-content.md 5장 경로 B 그대로. 함정 문항 2개는 랜딩 FAQ 내용(메뉴는 단순하게 ·
  // 알바 첫날 모든 업무를 알려주면 실수가 늘어남)을 뒤집은 문장. tip = 이 항목이 약할 때 보여주는 1줄
  var QUESTIONS = [
    {
      text: '주방 동선이 한 방향으로 흘러, 조리 중 같은 자리를 여러 번 오가지 않는다',
      tip: '재료와 도구를 조리 순서대로 다시 놓아 보세요. 한 걸음 줄인 게 피크 때 제일 크게 느껴져요.',
    },
    {
      text: '피크 시간에도 주문 접수부터 포장까지 혼자 처리할 수 있는 순서가 정해져 있다',
      tip: '접수 → 조리 → 포장 순서를 종이 한 장에 적어 주방에 붙여두세요. 바쁠수록 정해진 순서가 손을 덜어줘요.',
    },
    {
      text: '배달앱별 매출과 수수료를 매달 따로 확인한다',
      tip: '한 달에 한 번, 앱별 매출과 수수료를 따로 적어보세요. 어느 앱에서 실제로 남는지 숫자로 보여요.',
    },
    {
      text: '주문을 늘리려고 메뉴 가짓수를 계속 늘리고 있다',
      trap: true,
      tip: '메뉴가 늘면 재료·동선도 같이 복잡해져요. 혼자 운영하려면 메뉴와 동선을 단순하게 만드는 게 먼저예요.',
    },
    {
      text: '재료 재고를 정해진 요일에 기록하고, 그 기록으로 발주한다',
      tip: '재고 확인 요일을 정하고 그 기록을 보고 발주하세요. 감으로 하는 발주가 버리는 재료를 만들어요.',
    },
    {
      text: '지난달 버린 재료(폐기) 금액을 알고 있다',
      tip: '버린 재료를 적는 칸 하나만 만들어도 충분해요. 얼마나 버리는지 알아야 줄일 수 있어요.',
    },
    {
      text: '알바 첫날 교육 순서가 문서로 정리되어 있다',
      tip: '첫날 가르칠 순서를 한 장으로 정리해 두세요. 위생·안전 수칙, 매장 동선, 핵심 업무 하나면 충분해요.',
    },
    {
      text: '위생 점검표를 매일 또는 매주 체크한다',
      tip: '위생 점검표를 정해진 날 체크하는 습관부터 만드세요. 점검 날 당황하지 않는 가장 쉬운 방법이에요.',
    },
    {
      text: '새 알바에게 첫날 모든 업무를 한 번에 알려준다',
      trap: true,
      tip: '첫날부터 모든 업무를 알려주면 기억하지 못하고 실수가 늘어나요. 첫날은 위생·안전 수칙, 매장 동선, 핵심 업무 하나만 알려주세요.',
    },
    {
      text: '월 매출과 마진율을 매달 기록하고 있다',
      tip: '월 매출과 마진율을 매달 같은 날 기록하세요. 매출이 늘어도 남는 게 줄 수 있어서 두 숫자를 같이 봐야 해요.',
    },
  ];

  // 답 0 = 했어요 · 1 = 하는 중 · 2 = 아직이에요
  var CHOICES = ['했어요', '하는 중', '아직이에요'];
  var POINTS = { normal: [2, 1, 0], trap: [-1, 0, 2] };
  var MAX = 20;

  var STAGES = {
    low: { label: '시작 단계', desc: '운영의 기본 구조부터 잡을 때예요' },
    mid: { label: '진행 단계', desc: '기본은 잡혔고, 비어 있는 곳을 채울 때예요' },
    high: { label: '마무리 단계', desc: '대부분 챙기고 있어요. 지금 구조를 지키는 게 중요해요' },
  };

  // 테스트용 답안 → 마무리 16점 · 진행 13점 · 시작 2점
  var DEMO = {
    high: [0, 0, 1, 2, 0, 1, 0, 0, 1, 0],
    mid: [0, 0, 1, 0, 0, 2, 1, 0, 2, 2],
    low: [1, 2, 2, 0, 1, 2, 2, 0, 0, 2],
  };

  var KEY = 'psc_diag'; // 답안·단계만 (개인정보 아님), 이 탭에서만
  var VERSION = 2; // 예전(예/아니오) 기록은 쓰지 않는다
  var page = document.body.getAttribute('data-page');

  function pointOf(i, a) {
    return (QUESTIONS[i].trap ? POINTS.trap : POINTS.normal)[a];
  }
  function bandOf(score) {
    return score >= 15 ? 'high' : score >= 9 ? 'mid' : 'low';
  }
  function build(answers) {
    var sum = answers.reduce(function (s, a, i) {
      return s + pointOf(i, a);
    }, 0);
    var score = Math.max(0, sum);
    return { v: VERSION, answers: answers, score: score, band: bandOf(score) };
  }
  // 약한 항목: 2점 미만 문항을 점수 낮은 순 (같으면 함정 문항 먼저, 그다음 문항 순서)
  function weakItems(d) {
    var list = [];
    d.answers.forEach(function (a, i) {
      var p = pointOf(i, a);
      if (p < 2) list.push({ i: i, a: a, p: p });
    });
    list.sort(function (x, y) {
      if (x.p !== y.p) return x.p - y.p;
      var tx = QUESTIONS[x.i].trap ? 0 : 1;
      var ty = QUESTIONS[y.i].trap ? 0 : 1;
      return tx !== ty ? tx - ty : x.i - y.i;
    });
    return list;
  }
  function valid(d) {
    return (
      d && d.v === VERSION && Array.isArray(d.answers) && d.answers.length === QUESTIONS.length &&
      d.answers.every(function (a) {
        return a === 0 || a === 1 || a === 2;
      })
    );
  }
  function load() {
    try {
      var d = JSON.parse(PSC.store.get(KEY, 'session'));
      return valid(d) ? d : null;
    } catch (e) {
      return null;
    }
  }
  function save(d) {
    PSC.store.set(KEY, JSON.stringify(d), 'session');
  }
  function demoKey() {
    var d = (PSC.param('demo') || '').toLowerCase();
    return DEMO[d] ? d : null;
  }
  function $(id) {
    return document.getElementById(id);
  }

  // 준비 단계 표시 (미리보기 · 전체 결과 공통): 이름 칩 + 설명 + 3칸 단계 표시
  function renderStage(prefix, band) {
    var s = STAGES[band];
    $(prefix + '-stage').textContent = s.label;
    $(prefix + '-stage').className = 'band-chip band-chip--' + band;
    $(prefix + '-stage-desc').textContent = s.desc;
    Array.prototype.forEach.call($(prefix + '-steps').children, function (li) {
      var on = li.getAttribute('data-band') === band;
      li.classList.toggle('is-on', on);
      if (on) li.setAttribute('aria-current', 'step');
      else li.removeAttribute('aria-current');
    });
  }

  function tipHtml(w) {
    var q = QUESTIONS[w.i];
    return (
      '<li class="tip">' +
      '<p class="tip-q"><span class="tip-no">Q' + (w.i + 1) + '</span> ' + PSC.escape(q.text) + '</p>' +
      '<p class="tip-my">내 답: ' + CHOICES[w.a] + (q.trap ? ' <span class="tip-trap">하지 않는 게 좋은 행동</span>' : '') + '</p>' +
      '<p class="tip-a">' + PSC.escape(q.tip) + '</p>' +
      '</li>'
    );
  }

  // ======================= diagnosis.html =======================
  if (page === 'diagnosis') {
    var views = ['start', 'question', 'preview'];
    var answers = [];
    var idx = 0;

    function show(name) {
      views.forEach(function (v) {
        $('view-' + v).hidden = v !== name;
      });
      window.scrollTo(0, 0);
    }

    function renderQuestion() {
      var n = idx + 1;
      $('q-count').textContent = n + ' / ' + QUESTIONS.length;
      $('q-bar').style.width = (n / QUESTIONS.length) * 100 + '%';
      $('q-progress').setAttribute('aria-valuenow', String(n));
      $('q-no').textContent = 'Q' + n;
      $('q-text').textContent = QUESTIONS[idx].text;
      $('q-prev').hidden = idx === 0;
      // 이전 문항으로 돌아왔을 때 고른 답 표시
      Array.prototype.forEach.call(document.querySelectorAll('[data-answer]'), function (b) {
        b.setAttribute('aria-pressed', String(answers[idx] === Number(b.getAttribute('data-answer'))));
      });
      $('q-text').focus({ preventScroll: true });
    }

    function startQuiz() {
      answers = [];
      idx = 0;
      show('question');
      renderQuestion();
      PSC.events.startDiagnosis();
    }

    function answer(a) {
      answers[idx] = a;
      if (idx < QUESTIONS.length - 1) {
        idx++;
        renderQuestion();
      } else {
        var d = build(answers.slice());
        d.registered = false;
        save(d);
        PSC.events.completeDiagnosis(d.band);
        renderPreview(d);
      }
    }

    function renderPreview(d) {
      renderStage('p', d.band);
      var n = Math.min(3, weakItems(d).length);
      $('p-locked').textContent =
        n > 0
          ? '지금 먼저 챙길 ' + n + '가지와 항목별 팁은 연락처를 등록하면 바로 볼 수 있어요.'
          : '항목별 결과와 다음 단계 안내는 연락처를 등록하면 볼 수 있어요.';
      show('preview');
    }

    $('start-btn').addEventListener('click', startQuiz);
    Array.prototype.forEach.call(document.querySelectorAll('[data-answer]'), function (b) {
      b.addEventListener('click', function () {
        answer(Number(b.getAttribute('data-answer')));
      });
    });
    $('q-prev').addEventListener('click', function () {
      if (idx > 0) {
        idx--;
        renderQuestion();
      }
    });

    var form = $('diag-form');
    var once = PSC.submitOnce();
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!PSC.validate(form, { name: PSC.nameRule, contact: PSC.contactRule })) return;
      if (once.repeated()) return;
      PSC.lead.set({
        name: form.elements.name.value.trim(),
        contact: form.elements.contact.value.trim(),
        marketingConsent: form.elements.marketing.checked,
      });
      PSC.offer.start(); // 무료 자료 신청 → 운영 템플릿 3일 한정 할인 시작
      var d = load();
      if (d) {
        d.registered = true;
        save(d);
      }
      PSC.events.lead('diagnosis', form.elements.marketing.checked, once.go('diagnosis-result.html'));
    });

    // 주소로 화면 바로 열기 (테스트·캡처용)
    var view = (PSC.param('view') || '').toLowerCase();
    if (view === 'question') {
      startQuiz();
    } else if (view === 'preview') {
      var saved = load();
      var dk = demoKey();
      var d = dk || !saved ? build(DEMO[dk || 'mid']) : saved;
      d.registered = false;
      save(d);
      renderPreview(d);
    } else {
      show('start');
    }
  }

  // ======================= diagnosis-result.html =======================
  if (page === 'diagnosis-result') {
    var dk2 = demoKey();
    var data = dk2 ? build(DEMO[dk2]) : load();

    if (!data) {
      $('result-empty').hidden = false;
      $('result-body').hidden = true;
      return;
    }
    if (!dk2 && !data.registered) {
      window.location.replace('diagnosis.html?view=preview');
      return;
    }
    if (dk2) PSC.offer.start(); // 테스트 주소에서도 할인 안내가 보이게

    var lead = PSC.lead.get();
    if (lead.name) {
      $('r-greet').textContent = lead.name + ' 사장님,';
      $('r-greet').hidden = false;
    }

    renderStage('r', data.band);

    // 지금 먼저 챙길 3가지 (가장 약한 항목 기준) + 나머지 약한 항목은 접어서
    var weak = weakItems(data);
    var top = weak.slice(0, 3);
    var rest = weak.slice(3);
    if (top.length) {
      $('r-top').innerHTML = top.map(tipHtml).join('');
      $('r-top-count').textContent = top.length + '가지';
    } else {
      $('r-top').innerHTML = '<li class="tip"><p class="tip-a">모든 항목을 잘 챙기고 계세요. 지금 구조를 그대로 지키는 게 제일 중요해요.</p></li>';
      $('r-top-count').textContent = '';
    }
    if (rest.length) {
      $('r-rest').innerHTML = rest.map(tipHtml).join('');
      $('r-rest-count').textContent = rest.length + '개';
      $('r-rest-box').hidden = false;
    }

    // 단계별 안내 카드
    var P = window.PSC_PRODUCTS || {};
    $('reco-' + data.band).hidden = false;
    if (data.band === 'mid' && P.template) {
      var t = P.template;
      var on = PSC.offer.active();
      $('reco-template-price').innerHTML = on
        ? '<span class="badge">신청 후 3일 한정</span><p class="price-line"><s class="num">' + PSC.won(t.price) + '원</s> → <b class="num sale">' + PSC.won(t.salePrice) + '원</b></p><p class="countdown" data-countdown></p>'
        : '<p class="price-line num">' + PSC.won(t.price) + '원</p>';
      PSC.offer.bindCountdowns();
    }
  }
})();
