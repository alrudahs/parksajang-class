/*
 * 박사장 클라쓰 · 랜딩 전용 스크립트
 * - ④ 월별 매출 막대그래프 (외부 라이브러리 없이 SVG)
 */
(function () {
  // docs/landing-content.md 3장 · 월별 매출 (만 원, 2023.03 ~ 2026.04, 38개월)
  var SALES = [
    1567, 1384, 1605, 1362, 1367, 1417, 1663, 1824, 1761, 1956,
    1792, 1480, 1711, 2069, 2385, 2474, 3812, 3829, 3533, 3063,
    2626, 2630, 2972, 2730, 3251, 3398, 3297, 4023, 4246, 4233,
    4125, 3983, 4174, 3718, 4086, 3185, 2615, 2410,
  ];
  var START_YEAR = 2023;
  var START_MONTH = 3;

  function monthLabel(i) {
    var t = START_MONTH - 1 + i;
    var y = START_YEAR + Math.floor(t / 12);
    var m = (t % 12) + 1;
    return y + '.' + (m < 10 ? '0' : '') + m;
  }

  function drawChart() {
    var host = document.getElementById('sales-chart');
    var axis = document.getElementById('chart-axis');
    var readout = document.getElementById('chart-readout');
    if (!host) return;

    var n = SALES.length;
    var peak = SALES.indexOf(Math.max.apply(null, SALES));
    var W = 380;
    var H = 200;
    var GAP = 3;
    var BW = (W - GAP * (n - 1)) / n;
    var TOP = 4500; // 세로축 최댓값 (만 원)
    var NS = 'http://www.w3.org/2000/svg';

    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');

    var bars = [];
    SALES.forEach(function (v, i) {
      var h = Math.max(2, (v / TOP) * H);
      var r = document.createElementNS(NS, 'rect');
      r.setAttribute('x', (i * (BW + GAP)).toFixed(2));
      r.setAttribute('y', (H - h).toFixed(2));
      r.setAttribute('width', BW.toFixed(2));
      r.setAttribute('height', h.toFixed(2));
      r.setAttribute('rx', '1.5');
      r.setAttribute('class', i === peak ? 'bar bar--peak' : 'bar');
      svg.appendChild(r);
      bars.push(r);
    });

    var base = document.createElementNS(NS, 'line');
    base.setAttribute('x1', '0');
    base.setAttribute('x2', String(W));
    base.setAttribute('y1', String(H - 0.5));
    base.setAttribute('y2', String(H - 0.5));
    base.setAttribute('class', 'baseline');
    base.setAttribute('vector-effect', 'non-scaling-stroke');
    svg.appendChild(base);
    host.appendChild(svg);

    // 가로축: 시작 달 + 각 해 1월
    if (axis) {
      SALES.forEach(function (_, i) {
        var label = monthLabel(i);
        if (i !== 0 && label.slice(5) !== '01') return;
        var span = document.createElement('span');
        span.textContent = i === 0 ? label : label.slice(0, 4);
        span.style.left = i === 0 ? '0' : (((i * (BW + GAP) + BW / 2) / W) * 100).toFixed(2) + '%';
        axis.appendChild(span);
      });
    }

    // 막대를 가리키면 그 달 매출 표시 (터치·마우스·키보드)
    var current = peak;
    function show(i) {
      current = i;
      bars.forEach(function (b, k) {
        b.classList.toggle('is-on', k === i);
      });
      host.classList.add('is-active');
      var tag = i === peak ? '<span class="tag">최고 달</span>' : '';
      readout.innerHTML =
        '<span class="num">' + monthLabel(i) + '</span><b class="num">' + PSC.won(SALES[i]) + '만 원</b>' + tag;
    }
    function reset() {
      host.classList.remove('is-active');
      bars.forEach(function (b) {
        b.classList.remove('is-on');
      });
      current = peak;
      show(peak);
      host.classList.remove('is-active');
    }
    function indexAt(clientX) {
      var rect = host.getBoundingClientRect();
      var x = Math.min(Math.max(clientX - rect.left, 0), rect.width - 1);
      return Math.min(n - 1, Math.floor((x / rect.width) * n));
    }

    host.addEventListener('pointermove', function (e) {
      show(indexAt(e.clientX));
    });
    host.addEventListener('pointerdown', function (e) {
      show(indexAt(e.clientX));
    });
    host.addEventListener('pointerleave', function (e) {
      if (e.pointerType === 'mouse') reset();
    });
    host.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') {
        show(Math.min(n - 1, current + 1));
        e.preventDefault();
      } else if (e.key === 'ArrowLeft') {
        show(Math.max(0, current - 1));
        e.preventDefault();
      } else if (e.key === 'Escape') {
        reset();
      }
    });
    host.addEventListener('blur', reset);
  }

  // data-cta 버튼(히어로 2개·최종 CTA) 클릭 · 갈림길 카드는 2026-11-12 삭제 → click_cta (전송을 기다렸다가 이동)
  function bindCta() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-cta]'), function (a) {
      var sent = false; // 이 버튼의 click_cta 를 이미 보냈는지
      var moving = false; // 전송 대기가 끝나 이동을 시작했는지
      a.addEventListener('click', function (e) {
        var pos = a.getAttribute('data-cta');
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) {
          PSC.events.ctaClick(pos); // 새 탭으로 여는 경우는 이동을 막지 않음
          return;
        }
        e.preventDefault();
        var href = a.href;
        // 다시 누르면 보내지 않는다. 대기 중이면 첫 클릭이 이동시키고, 이동이 끊겼으면 다시 이동한다
        if (sent) {
          if (moving) window.location.href = href;
          return;
        }
        sent = true;
        PSC.events.ctaClick(pos, function () {
          moving = true;
          window.location.href = href;
        });
      });
      // 뒤로 가기로 돌아온 화면에서 누르면 새 클릭으로 센다
      window.addEventListener('pageshow', function (e) {
        if (e.persisted) {
          sent = false;
          moving = false;
        }
      });
    });
  }

  function init() {
    drawChart();
    bindCta();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
