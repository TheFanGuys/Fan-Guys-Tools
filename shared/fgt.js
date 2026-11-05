/* Fan Guys Tools: shared bits loaded by every tool page.
   - Home button (draggable) to get back to the job screen
   - Fills the tool's job fields from the current job, only when they're empty
   - Labor rates live on this phone (Settings), never in the code */
(function () {
  var TOOL = (document.currentScript && document.currentScript.getAttribute('data-tool')) || '';

  function get(k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }
  function set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  function currentJob() {
    var id = get('fgt-current', null), jobs = get('fgt-jobs', []);
    for (var i = 0; i < jobs.length; i++) if (jobs[i].id === id) return jobs[i];
    return null;
  }
  function oneLine(j) {
    var cityLine = [j.city, [j.state, j.zip].filter(Boolean).join(' ')].filter(Boolean).join(', ');
    return [j.street, cityLine].filter(Boolean).join(', ');
  }

  /* ---------- Labor rates ---------- */
  var RATE_MODELS = ['ztech', 'zchill', 'taz', 'taz36'];
  var RATE_TYPES = ['turnkey', 'mech_hook', 'mech_hang'];
  function rates() { return get('fgt-rates', null); }
  function applyRates(models) {
    var r = rates() || {};
    models.forEach(function (m) {
      RATE_TYPES.forEach(function (t) { m.labor[t] = +((r[m.id] || {})[t]) || 0; });
    });
    return !!rates();
  }

  /* ---------- Materials: seed its save before React reads it ---------- */
  if (TOOL === 'materials') {
    var j = currentJob();
    if (j) {
      var s = get('fg_materials_autosave_v1', {}) || {};
      if (!s.jobName && !s.jobLocation) {
        s.jobName = j.name || ''; s.jobLocation = oneLine(j);
        set('fg_materials_autosave_v1', s);
      }
    }
  }

  /* ---------- Fill empty DOM fields after the tool restores its own save ---------- */
  function fill(id, val) {
    var el = document.getElementById(id);
    if (!el || !val || el.value) return false;
    el.value = val;
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }
  function prefill() {
    var j = currentJob(); if (!j) return;
    if (TOOL === 'survey') {
      fill('jobName', j.name); fill('addrStreet', j.street); fill('addrCity', j.city);
      fill('addrState', j.state); fill('addrZip', j.zip);
    } else if (TOOL === 'estimate') {
      var z = document.getElementById('zip');
      if (z && !z.value && j.zip) { z.value = String(j.zip).slice(0, 5); z.dispatchEvent(new Event('input', { bubbles: true })); z.dispatchEvent(new Event('change', { bubbles: true })); }
    }
  }

  /* ---------- Home button ---------- */
  function homeButton() {
    var css = document.createElement('style');
    css.textContent =
      '#fgt-home{position:fixed;z-index:2147483000;width:44px;height:44px;border-radius:13px;opacity:.9;border:2px solid #F28C0F;' +
      'background:#1B1C1E url(../shared/mark.png) center/36px no-repeat;box-shadow:0 4px 14px rgba(0,0,0,.45);' +
      'touch-action:none;-webkit-tap-highlight-color:transparent;padding:0;cursor:pointer}' +
      '#fgt-home:active{transform:scale(.94)}' +
      '#fgt-ratebar{position:sticky;top:0;z-index:2147482999;background:#F28C0F;color:#1B1C1E;font:600 14px/1.35 Barlow,system-ui,sans-serif;' +
      'padding:10px 14px;padding-top:calc(10px + env(safe-area-inset-top))}#fgt-ratebar a{color:#1B1C1E;font-weight:800}';
    document.head.appendChild(css);
    var b = document.createElement('button');
    b.id = 'fgt-home'; b.type = 'button'; b.setAttribute('aria-label', 'Back to Fan Guys Tools home');
    var pos = get('fgt-home-pos-' + TOOL, null);
    function place(x, y) {
      var w = window.innerWidth, h = window.innerHeight;
      x = Math.max(6, Math.min(w - 52, x)); y = Math.max(6, Math.min(h - 52, y));
      b.style.left = x + 'px'; b.style.top = y + 'px';
      return { x: x, y: y };
    }
    var start = pos || { x: 10, y: window.innerHeight - 120 };
    var at = place(start.x, start.y);
    var drag = null, moved = false;
    b.addEventListener('pointerdown', function (e) { drag = { dx: e.clientX - at.x, dy: e.clientY - at.y, sx: e.clientX, sy: e.clientY }; moved = false; b.setPointerCapture(e.pointerId); });
    b.addEventListener('pointermove', function (e) {
      if (!drag) return;
      if (Math.abs(e.clientX - drag.sx) + Math.abs(e.clientY - drag.sy) > 8) moved = true;
      if (moved) at = place(e.clientX - drag.dx, e.clientY - drag.dy);
    });
    b.addEventListener('pointerup', function () {
      if (moved) set('fgt-home-pos-' + TOOL, at);
      else location.href = '../';
      drag = null;
    });
    window.addEventListener('resize', function () { at = place(at.x, at.y); });
    document.body.appendChild(b);

    if (TOOL === 'estimate' && !rates()) {
      var bar = document.createElement('div');
      bar.id = 'fgt-ratebar';
      bar.innerHTML = 'Labor rates aren\'t set, so labor shows $0. <a href="../#rates">Set your rates</a>';
      document.body.insertBefore(bar, document.body.firstChild);
    }
  }

  function ready() {
    homeButton();
    setTimeout(prefill, 700);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready); else ready();

  window.FGT = { currentJob: currentJob, applyRates: applyRates, rates: rates, RATE_MODELS: RATE_MODELS, RATE_TYPES: RATE_TYPES };
})();
