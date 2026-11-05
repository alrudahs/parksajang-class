/*
 * 상품 상세 · 주문서 · 구매 완료 (경로 A, 경로 C 공용)
 * 결제는 데모 — PG 연동 없음, 결제 정보 입력 칸 없음.
 */
(function () {
  var P = window.PSC_PRODUCTS || {};
  var page = document.body.getAttribute('data-page');
  var ORDER_KEY = 'psc_last_order';

  function itemId() {
    var id = PSC.param('item') || document.body.getAttribute('data-item') || 'template';
    return P[id] ? id : 'template';
  }

  // 정가 · 최종가 · 할인 여부
  function pricing(id) {
    var p = P[id];
    var applied = !!(p.salePrice && PSC.offer.active());
    return {
      list: p.price,
      final: applied ? p.salePrice : p.price,
      discount: applied ? p.price - p.salePrice : 0,
      applied: applied,
    };
  }

  function won(n) {
    return PSC.won(n) + '원';
  }

  function orderId() {
    var d = new Date();
    var p = function (n) {
      return (n < 10 ? '0' : '') + n;
    };
    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    var rand = '';
    for (var i = 0; i < 4; i++) rand += chars[Math.floor(Math.random() * chars.length)];
    return 'DEMO-' + d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + '-' + rand;
  }

  function setText(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  // 금액 + (프리미엄) "VAT 별도"를 금액 아래 작게 — 글자는 "4,500,000원 VAT 별도" 그대로
  function setMoney(id, value, vatExcluded) {
    var el = document.getElementById(id);
    if (!el) return;
    el.textContent = won(value);
    if (vatExcluded) {
      el.appendChild(document.createTextNode(' '));
      var s = document.createElement('small');
      s.className = 'vat';
      s.textContent = 'VAT 별도';
      el.appendChild(s);
    }
  }

  // ---------- 상품 상세 (template.html) ----------
  if (page === 'template') {
    var pr = pricing('template');
    var box = document.getElementById('price-box');
    if (box && pr.applied) {
      box.innerHTML =
        '<span class="badge">신청 후 3일 한정</span>' +
        '<p class="price-line"><s class="num">' + won(pr.list) + '</s> → <b class="num sale">' + won(pr.final) + '</b></p>' +
        '<p class="countdown" data-countdown></p>';
      PSC.offer.bindCountdowns();
    }
    var nudge = document.getElementById('offer-nudge');
    if (nudge) nudge.hidden = pr.applied;
    PSC.events.viewItem('template', pr.final);
  }

  // ---------- 주문서 (checkout.html?item=...) ----------
  if (page === 'checkout') {
    var id = itemId();
    var prod = P[id];
    var c = pricing(id);

    setText('sum-name', prod.name);
    setText('sum-list', won(c.list));
    setMoney('sum-final', c.final, prod.vatExcluded);

    var discRow = document.getElementById('sum-discount-row');
    var chip = document.getElementById('discount-chip');
    if (c.applied) {
      setText('sum-discount', '-' + won(c.discount));
      discRow.hidden = false;
      chip.className = 'status-chip is-on';
      chip.textContent = '3일 한정 할인 적용';
    } else {
      discRow.hidden = true;
      chip.className = 'status-chip';
      chip.textContent = prod.salePrice ? '할인 미적용 (신청 후 3일이 지났거나 신청 전)' : '할인 없음';
    }
    var cd = document.getElementById('checkout-countdown');
    if (cd) cd.hidden = !c.applied;

    var back = document.getElementById('back-link');
    if (back && prod.detailUrl) back.href = prod.detailUrl;
    PSC.events.beginCheckout(id, c.final, c.applied);

    // 앞 화면에서 입력한 이름·연락처가 있으면 채워두기 (이 탭에서만)
    var lead = PSC.lead.get();
    var form = document.getElementById('order-form');
    if (lead.name) form.elements.name.value = lead.name;
    if (lead.contact) form.elements.contact.value = lead.contact;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!PSC.validate(form, { name: PSC.nameRule, contact: PSC.contactRule })) return;

      // 데모 결제: 바로 완료 화면으로. 주문 정보에 개인정보는 담지 않는다.
      var order = {
        id: orderId(),
        item: id,
        value: c.final,
        discountApplied: c.applied,
        fromCheckout: true, // 주문서를 거친 주문만 purchase 이벤트 대상
      };
      PSC.store.set(ORDER_KEY, JSON.stringify(order), 'session');
      window.location.href = 'order-complete.html?order=' + encodeURIComponent(order.id);
    });
  }

  // ---------- 구매 완료 (order-complete.html) ----------
  if (page === 'complete') {
    var order = null;
    try {
      order = JSON.parse(PSC.store.get(ORDER_KEY, 'session'));
    } catch (e) {}
    if (!order || !P[order.item]) {
      // 주문서를 거치지 않고 열었을 때(주소 직접 입력·시연·캡처): 화면만 임의 주문번호로 보여주고
      // 저장하지 않는다 → fromCheckout 이 없으므로 purchase 이벤트도 나가지 않는다
      var fid = itemId();
      order = { id: PSC.param('order') || orderId(), item: fid, value: pricing(fid).final, discountApplied: pricing(fid).applied, fromCheckout: false };
    }
    var item = P[order.item];

    setText('order-id', order.id);
    setText('order-item', item.name);
    setMoney('order-value', order.value, item.vatExcluded);

    var dl = document.getElementById('download-block');
    if (dl) {
      dl.hidden = !item.download;
      if (item.download) {
        var a = document.getElementById('download-link');
        a.href = item.download.url;
        a.textContent = item.download.label;
      }
    }
    var live = document.getElementById('live-block');
    if (live) live.hidden = !item.liveInvite;

    // 코칭 상품이면 예약한 15분 상담 일정 표시
    var bk = document.getElementById('booking-block');
    if (bk) {
      var booking = null;
      try {
        booking = JSON.parse(PSC.store.get('psc_booking', 'session'));
      } catch (e) {}
      var isCoaching = order.item === 'coaching' || order.item === 'premium';
      bk.hidden = !(isCoaching && booking && booking.date);
      if (!bk.hidden) setText('bk-when', booking.date + ' ' + booking.time);
    }

    // purchase — 같은 주문번호는 새로고침해도 한 번만
    PSC.events.purchase(order);

    // 넘겨받던 이름·연락처는 여기서 지운다
    PSC.lead.clear();
  }
})();
