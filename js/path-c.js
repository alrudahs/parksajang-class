/*
 * 경로 C · 무료 Zoom 라이브 신청 → 신청 완료 → 15분 상담 예약 → 코칭 상세 → 코칭 결제(데모)
 * live.html / live-done.html / consult.html / coaching.html?type=open|operate
 */
(function () {
  var page = document.body.getAttribute('data-page');
  var LIVE_KEY = 'psc_live';
  var BOOK_KEY = 'psc_booking';
  var DAYS = ['일', '월', '화', '수', '목', '금', '토'];

  function $(id) {
    return document.getElementById(id);
  }
  function readJSON(key) {
    try {
      return JSON.parse(PSC.store.get(key, 'session'));
    } catch (e) {
      return null;
    }
  }
  function writeJSON(key, v) {
    PSC.store.set(key, JSON.stringify(v), 'session');
  }

  // 이번 회차: 이번 달 마지막 주가 아직 안 지났으면 이번 달, 지났으면 다음 달 (예: 2026-11)
  function liveRound() {
    var now = new Date();
    var lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    var d = now.getDate() <= lastDay - 7 ? now : new Date(now.getFullYear(), now.getMonth() + 1, 1);
    var m = d.getMonth() + 1;
    return { id: d.getFullYear() + '-' + (m < 10 ? '0' : '') + m, label: d.getFullYear() + '년 ' + m + '월 회차' };
  }

  function prefill(form) {
    var lead = PSC.lead.get();
    if (lead.name && form.elements.name) form.elements.name.value = lead.name;
    if (lead.contact && form.elements.contact) form.elements.contact.value = lead.contact;
  }

  function saveLead(form) {
    var lead = PSC.lead.get();
    lead.name = form.elements.name.value.trim();
    lead.contact = form.elements.contact.value.trim();
    if (form.elements.marketing) lead.marketingConsent = form.elements.marketing.checked;
    PSC.lead.set(lead);
  }

  // ---------- 라이브 신청 ----------
  if (page === 'live') {
    var round = liveRound();
    $('live-round').textContent = round.label;
    var form = $('live-form');
    prefill(form);
    var liveOnce = PSC.submitOnce();
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!PSC.validate(form, { name: PSC.nameRule, contact: PSC.contactRule })) return;
      if (liveOnce.repeated()) return;
      saveLead(form);
      writeJSON(LIVE_KEY, { round: round.id, label: round.label });
      PSC.events.registerLive(round.id, liveOnce.go('live-done.html'));
    });
  }

  // ---------- 라이브 신청 완료 ----------
  if (page === 'live-done') {
    var live = readJSON(LIVE_KEY) || liveRound();
    $('done-round').textContent = live.label;
    var lead = PSC.lead.get();
    if (lead.name) {
      $('done-greet').textContent = lead.name + ' 사장님,';
      $('done-greet').hidden = false;
    }
  }

  // ---------- 15분 상담 예약 ----------
  if (page === 'consult') {
    var pick = { date: '', time: '', target: '' };
    var dateBox = $('date-options');

    // 내일부터 평일 5일 (데모)
    var d = new Date();
    var made = 0;
    while (made < 5) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() === 0 || d.getDay() === 6) continue;
      var label = d.getMonth() + 1 + '/' + d.getDate() + ' (' + DAYS[d.getDay()] + ')';
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'choice';
      b.setAttribute('aria-pressed', 'false');
      b.setAttribute('data-value', label);
      b.textContent = label;
      dateBox.appendChild(b);
      made++;
    }

    function bindGroup(box, key) {
      box.addEventListener('click', function (e) {
        var btn = e.target.closest('.choice');
        if (!btn) return;
        Array.prototype.forEach.call(box.querySelectorAll('.choice'), function (x) {
          x.setAttribute('aria-pressed', x === btn ? 'true' : 'false');
        });
        pick[key] = btn.getAttribute('data-value');
        var group = box.closest('.field');
        if (group) group.classList.remove('is-error');
      });
    }
    bindGroup(dateBox, 'date');
    bindGroup($('time-options'), 'time');

    var cform = $('consult-form');
    cform.addEventListener('change', function (e) {
      if (e.target.name === 'target') {
        pick.target = e.target.value;
        e.target.closest('.field').classList.remove('is-error');
      }
    });
    prefill(cform);

    // 진단에서 넘어왔으면 운영 단계를 미리 골라두기
    if (PSC.param('target') === 'operate' || PSC.param('target') === 'open') {
      var r = cform.querySelector('input[name=target][value=' + PSC.param('target') + ']');
      if (r) {
        r.checked = true;
        pick.target = r.value;
      }
    }

    function groupError(id, msg) {
      var field = $(id);
      field.classList.toggle('is-error', !!msg);
      field.querySelector('.error-msg').textContent = msg;
      return !msg;
    }

    var consultOnce = PSC.submitOnce();
    cform.addEventListener('submit', function (e) {
      e.preventDefault();
      // 뒤로 가기로 돌아오면 브라우저가 라디오를 복원해도 change 가 나지 않으므로 화면 값을 다시 읽는다
      var checkedTarget = cform.querySelector('input[name=target]:checked');
      pick.target = checkedTarget ? checkedTarget.value : '';
      var ok = groupError('field-date', pick.date ? '' : '날짜를 골라주세요');
      ok = groupError('field-time', pick.time ? '' : '시간을 골라주세요') && ok;
      ok = groupError('field-target', pick.target ? '' : '오픈 단계 / 운영 단계 중 하나를 골라주세요') && ok;
      var fieldsOk = PSC.validate(cform, { name: PSC.nameRule, contact: PSC.contactRule });
      if (!ok) {
        var first = cform.querySelector('.field.is-error');
        if (first) first.scrollIntoView({ block: 'center' });
        return;
      }
      if (!fieldsOk) return;
      if (consultOnce.repeated()) return;
      saveLead(cform);
      writeJSON(BOOK_KEY, { date: pick.date, time: pick.time, target: pick.target });
      // 상담 예약 화면에는 수신 동의 칸이 없어서, 앞 화면에서 받은 동의 여부를 그대로 쓴다 (없으면 false)
      PSC.events.lead('consult', PSC.lead.get().marketingConsent, consultOnce.go('coaching.html?type=' + pick.target + '&booked=1'));
    });
  }

  // ---------- 코칭 상세 ----------
  if (page === 'coaching') {
    var booking = readJSON(BOOK_KEY);
    var type = (PSC.param('type') || (booking && booking.target) || 'open').toLowerCase();
    if (type !== 'operate') type = 'open';

    $('coach-open').hidden = type !== 'open';
    $('coach-operate').hidden = type !== 'operate';
    document.title = (type === 'open' ? '1:1 Zoom 코칭' : '프리미엄 1주 집중 현장 컨설팅') + ' · 박사장 클라쓰';

    if (booking && booking.date) {
      $('booked-when').textContent = booking.date + ' ' + booking.time;
      $('booked-box').hidden = false;
    }

    var itemId = type === 'open' ? 'coaching' : 'premium';
    var prod = (window.PSC_PRODUCTS || {})[itemId];
    if (prod) PSC.events.viewItem(itemId, prod.price);
  }
})();
