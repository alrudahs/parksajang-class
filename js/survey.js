/*
 * 만족도 설문 (survey.html?type=checklist|live|purchase)
 * 문항 1: 만족도 1~5점 / 문항 2: 추천 의향 0~10점
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

  form.addEventListener('change', function (e) {
    var f = e.target.closest('.field');
    if (f) {
      f.classList.remove('is-error');
      f.querySelector('.error-msg').textContent = '';
    }
  });

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
    var data = { survey_type: type, satisfaction: s, recommend: r };
    PSC.events.submitSurvey(type, s, r);
    sendToGoogleForm(data);
    document.getElementById('survey-body').hidden = true;
    document.getElementById('survey-thanks').hidden = false;
    window.scrollTo(0, 0);
  });
})();
