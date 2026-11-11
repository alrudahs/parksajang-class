/*
 * 만족도 설문 (survey.html?type=checklist|live|purchase)
 * 문항 1: 만족도 1~5점 / 문항 2: 추천 의향 0~10점 (필수, GA4 submit_survey + 구글폼)
 * 문항 3~6 (선택, 2026-11-11): 현재상황 / 가장 도움된 자료 / 템플릿 구매 의향 1~5 / 아쉬운 점(최대 500자)
 *   → 구글폼에만 저장. GA4로는 보내지 않는다.
 * 응답은 config.js 의 구글폼(surveyForm)이 있으면 그쪽으로 전송 → 설문 시트.
 * 이름·연락처는 묻지 않는다.
 */
(function () {
  var C = window.PSC_CONFIG || {};
  var TYPES = {
    checklist: '오픈 D-7 체크리스트',
    live: '무료 Zoom 라이브',
    purchase: '구매하신 상품',
  };
  var type = (PSC.param('type') || '').toLowerCase();
  if (!TYPES[type]) type = 'checklist';

  var form = document.getElementById('survey-form');
  document.getElementById('survey-about').textContent = TYPES[type];
  form.elements.survey_type.value = type;

  // 점수 버튼 만들기
  function scale(boxId, name, from, to) {
    var box = document.getElementById(boxId);
    for (var i = from; i <= to; i++) {
      var label = document.createElement('label');
      label.className = 'scale-item';
      label.innerHTML = '<input type="radio" name="' + name + '" value="' + i + '"><span>' + i + '</span>';
      box.appendChild(label);
    }
  }
  scale('scale-satisfaction', 'satisfaction', 1, 5);
  scale('scale-recommend', 'recommend', 0, 10);
  scale('scale-intent', 'purchase_intent', 1, 5);

  form.addEventListener('change', function (e) {
    var f = e.target.closest('.field');
    if (f) {
      f.classList.remove('is-error');
      var m = f.querySelector('.error-msg');
      if (m) m.textContent = '';
    }
  });

  // 아쉬운 점 글자 수 (최대 500자)
  var improve = document.getElementById('s-improve');
  var count = document.getElementById('s-improve-count');
  if (improve && count) {
    improve.addEventListener('input', function () {
      count.textContent = improve.value.length + ' / 500자';
    });
  }

  // 선택 문항 값 (안 고르면 빈 문자열)
  function picked(name) {
    var el = form.querySelector('input[name=' + name + ']:checked');
    return el ? el.value : '';
  }

  function checkGroup(name, msg) {
    var picked = form.querySelector('input[name=' + name + ']:checked');
    var field = form.querySelector('[data-group=' + name + ']');
    field.classList.toggle('is-error', !picked);
    field.querySelector('.error-msg').textContent = picked ? '' : msg;
    return picked ? Number(picked.value) : null;
  }

  // 구글폼으로 보내기 (no-cors: 응답은 못 읽지만 시트에는 쌓인다)
  function sendToGoogleForm(data) {
    var sf = C.surveyForm || {};
    var en = sf.entries || {};
    if (!sf.action || !en.surveyType || !en.satisfaction || !en.recommend) return;
    var body = new URLSearchParams();
    body.append(en.surveyType, data.survey_type);
    body.append(en.satisfaction, String(data.satisfaction));
    body.append(en.recommend, String(data.recommend));
    var exp = PSC.exp || {};
    if (en.expHeadline) body.append(en.expHeadline, exp.exp_headline || '');
    if (en.expDoneOffer) body.append(en.expDoneOffer, exp.exp_done_offer || '');
    // 선택 문항 3~6: 답한 것만 보낸다 (빈 문항은 빼서 오류 없이 제출)
    [
      [en.situation, data.situation],
      [en.helpful, data.helpful],
      [en.purchaseIntent, data.purchase_intent],
      [en.improvement, data.improvement],
    ].forEach(function (p) {
      if (p[0] && p[1]) body.append(p[0], p[1]);
    });
    // 전송에 실패해도 감사 화면은 그대로 보여준다
    try {
      fetch(sf.action, { method: 'POST', mode: 'no-cors', body: body }).catch(function () {});
    } catch (e) {}
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var s = checkGroup('satisfaction', '1~5점 중 하나를 골라주세요');
    var r = checkGroup('recommend', '0~10점 중 하나를 골라주세요');
    if (s === null || r === null) {
      form.querySelector('.field.is-error').scrollIntoView({ block: 'center' });
      return;
    }
    var data = {
      survey_type: type,
      satisfaction: s,
      recommend: r,
      // 아래 선택 문항은 구글폼에만 저장 (GA4 submit_survey 에는 넣지 않음)
      situation: picked('situation'),
      helpful: picked('helpful'),
      purchase_intent: picked('purchase_intent'),
      improvement: improve ? improve.value.trim().slice(0, 500) : '',
    };
    PSC.events.submitSurvey(type, s, r);
    sendToGoogleForm(data);
    document.getElementById('survey-body').hidden = true;
    document.getElementById('survey-thanks').hidden = false;
    window.scrollTo(0, 0);
  });
})();
