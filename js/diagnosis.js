/*
 * 경로 B · 1인 매장 운영 셀프 진단
 * diagnosis.html        시작 → 10문항 → 결과 미리보기(점수만) + 연락처 등록
 * diagnosis-result.html 전체 결과(항목별 개선 팁) + 구간별 안내
 *
 * 테스트·캡처용 주소
 *   diagnosis.html?view=question            1번 문항 화면
 *   diagnosis.html?view=preview[&demo=mid]  결과 미리보기 (답이 없으면 demo 답안)
 *   diagnosis-result.html?demo=high|mid|low 구간별 전체 결과
 */
(function () {
  // docs/landing-content.md 5장 경로 B · 10문항 (문구 그대로)
  var QUESTIONS = [
    '주방 동선이 한 방향으로 흘러, 조리 중 같은 자리를 여러 번 오가지 않는다',
    '피크 시간에도 주문 접수부터 포장까지 혼자 처리할 수 있는 순서가 정해져 있다',
    '배달앱별 주문을 한 화면(또는 한 기기)에서 확인한다',
    '배달앱별 매출과 수수료를 매달 따로 확인한다',
    '재료 재고를 정해진 요일에 기록하고, 그 기록으로 발주한다',
    '지난달 버린 재료(폐기) 금액을 알고 있다',
    '알바 첫날 교육 순서가 문서로 정리되어 있다',
    '위생 점검표를 매일 또는 매주 체크한다',
    '월 매출과 마진율을 매달 기록하고 있다',
    '최근 3개월 매출이 늘거나 유지되고 있다',
  ];

  // '아니오' 문항별 개선 팁 1줄 (박사장 톤 · 약속·보장 표현 없음)
  var TIPS = [
    '재료와 도구를 조리 순서대로 다시 놓아 보세요. 한 걸음 줄인 게 피크 때 제일 크게 느껴져요.',
    '접수 → 조리 → 포장 순서를 종이 한 장에 적어 주방에 붙여두세요. 바쁠수록 정해진 순서가 손을 덜어줘요.',
    '배달앱 주문을 한 기기에서 모아 보는 방법부터 정리하세요. 기기를 오가다 보면 주문을 놓치기 쉬워요.',
    '한 달에 한 번, 앱별 매출과 수수료를 따로 적어보세요. 어느 앱에서 실제로 남는지 숫자로 보여요.',
    '재고 확인 요일을 정하고 그 기록을 보고 발주하세요. 감으로 하는 발주가 버리는 재료를 만들어요.',
    '버린 재료를 적는 칸 하나만 만들어도 충분해요. 얼마나 버리는지 알아야 줄일 수 있어요.',
    '첫날 가르칠 순서를 한 장으로 정리해 두세요. 위생·안전 수칙, 매장 동선, 핵심 업무 하나면 충분해요.',
    '위생 점검표를 정해진 날 체크하는 습관부터 만드세요. 점검 날 당황하지 않는 가장 쉬운 방법이에요.',
    '월 매출과 마진율을 매달 같은 날 기록하세요. 매출이 늘어도 남는 게 줄 수 있어서 두 숫자를 같이 봐야 해요.',
    '매출이 줄었다면 주문 수가 줄었는지, 객단가가 줄었는지부터 나눠 보세요. 원인에 따라 손볼 곳이 달라요.',
  ];

  var BANDS = {
    high: { label: '상', desc: '잘 운영 중' },
    mid: { label: '중', desc: '일부 개선 필요' },
    low: { label: '하', desc: '구조 점검 필요' },
  };

  // 테스트용 답안 (1 = 예, 0 = 아니오) → 상 9점 · 중 6점 · 하 3점
  var DEMO = {
    high: [1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
    mid: [1, 1, 0, 0, 1, 0, 1, 1, 0, 1],
    low: [1, 0, 0, 0, 0, 0, 1, 1, 0, 0],
  };

  var KEY = 'psc_diag'; // 답안·점수만 (개인정보 아님), 이 탭에서만
  var page = document.body.getAttribute('data-page');

  function bandOf(score) {
    return score >= 8 ? 'high' : score >= 5 ? 'mid' : 'low';
  }
  function build(answers) {
    var score = answers.reduce(function (s, a) {
      return s + (a ? 1 : 0);
    }, 0);
    return { answers: answers, score: score, band: bandOf(score) };
  }
  function load() {
    try {
      return JSON.parse(PSC.store.get(KEY, 'session'));
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
  function noCount(d) {
    return d.answers.filter(function (a) {
      return !a;
    }).length;
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
      $('q-text').textContent = QUESTIONS[idx];
      $('q-prev').hidden = idx === 0;
      $('q-text').focus({ preventScroll: true });
    }

    function startQuiz() {
      answers = [];
      idx = 0;
      show('question');
      renderQuestion();
      PSC.events.startDiagnosis();
    }

    function answer(yes) {
      answers[idx] = yes ? 1 : 0;
      if (idx < QUESTIONS.length - 1) {
        idx++;
        renderQuestion();
      } else {
        var d = build(answers);
        d.registered = false;
        save(d);
        PSC.events.completeDiagnosis(d.band);
        renderPreview(d);
      }
    }

    function renderPreview(d) {
      var b = BANDS[d.band];
      $('p-score').textContent = d.score;
      $('p-band').textContent = b.label + ' · ' + b.desc;
      $('p-band').className = 'band-chip band-chip--' + d.band;
      $('p-gauge').style.width = d.score * 10 + '%';
      $('p-gauge').className = 'gauge-fill gauge-fill--' + d.band;
      var n = noCount(d);
      $('p-locked').textContent =
        n > 0
          ? "'아니오'라고 답한 " + n + '개 항목의 개선 팁은 연락처를 등록하면 바로 볼 수 있어요.'
          : '항목별 결과와 다음 단계 안내는 연락처를 등록하면 볼 수 있어요.';
      show('preview');
    }

    $('start-btn').addEventListener('click', startQuiz);
    $('q-yes').addEventListener('click', function () {
      answer(true);
    });
    $('q-no-btn').addEventListener('click', function () {
      answer(false);
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

    var b = BANDS[data.band];
    $('r-score').textContent = data.score;
    $('r-band').textContent = b.label + ' · ' + b.desc;
    $('r-band').className = 'band-chip band-chip--' + data.band;
    $('r-gauge').style.width = data.score * 10 + '%';
    $('r-gauge').className = 'gauge-fill gauge-fill--' + data.band;

    // 항목별 개선 팁 ('아니오' 문항만)
    var list = $('r-tips');
    var html = '';
    data.answers.forEach(function (a, i) {
      if (a) return;
      html +=
        '<li class="tip">' +
        '<p class="tip-q"><span class="tip-no">Q' + (i + 1) + '</span> ' + PSC.escape(QUESTIONS[i]) + '</p>' +
        '<p class="tip-a">' + PSC.escape(TIPS[i]) + '</p>' +
        '</li>';
    });
    if (html) {
      list.innerHTML = html;
      $('r-tips-count').textContent = noCount(data) + '개';
    } else {
      list.innerHTML = '<li class="tip"><p class="tip-a">모든 항목에 \'예\'라고 답하셨어요. 지금 구조를 그대로 지키는 게 제일 중요해요.</p></li>';
      $('r-tips-count').textContent = '0개';
    }

    // 구간별 안내 카드
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
