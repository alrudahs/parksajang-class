/*
 * 경로 A · 체크리스트 신청 폼 (checklist.html) + 신청 완료 (checklist-done.html)
 */
(function () {
  var page = document.body.getAttribute('data-page');

  // ---------- 신청 폼 ----------
  if (page === 'checklist') {
    var form = document.getElementById('lead-form');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = PSC.validate(form, { name: PSC.nameRule, contact: PSC.contactRule });
      if (!ok) return;

      // 다음 화면에 이름을 보여주는 데만 사용 (이 탭에서만, 저장·전송 없음)
      PSC.lead.set({
        name: form.elements.name.value.trim(),
        contact: form.elements.contact.value.trim(),
        marketingConsent: form.elements.marketing.checked,
      });
      PSC.offer.start(); // 3일 한정 할인 시작
      PSC.events.lead('checklist', form.elements.marketing.checked, function () {
        window.location.href = 'checklist-done.html';
      });
    });

    // 고치는 중에는 오류 표시를 바로 지운다
    form.addEventListener('input', function (e) {
      var field = e.target.closest('.field');
      if (field && field.classList.contains('is-error') && e.target.value.trim()) {
        field.classList.remove('is-error');
        e.target.setAttribute('aria-invalid', 'false');
      }
    });
  }

  // ---------- 신청 완료 ----------
  if (page === 'checklist-done') {
    // 신청 없이 바로 들어온 경우도 "방금 신청"으로 보고 할인 시작
    PSC.offer.start();

    var lead = PSC.lead.get();
    var greet = document.getElementById('done-greet');
    if (lead.name && greet) {
      greet.textContent = lead.name + ' 사장님,';
      greet.hidden = false;
    }

    // H1 가설: 템플릿 샘플 + 3일 할인 배너 (기본 on, ?offer=off 이면 숨김)
    var offer = PSC.variant('done_offer', 'offer', ['on', 'off'], 'on');
    var block = document.getElementById('done-offer');
    if (block) block.hidden = offer === 'off';
    PSC.dl({ exp_done_offer: offer });

    // D-7 체크리스트 다운로드 → file_download
    var dl = document.querySelector('a[download][href$=".pdf"]');
    if (dl) {
      dl.addEventListener('click', function () {
        PSC.events.download(dl.getAttribute('href').split('/').pop());
      });
    }
  }
})();
