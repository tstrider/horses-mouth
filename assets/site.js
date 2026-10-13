/* Horse's Mouth. Every answer shown is a saved, real answer from assets/data.js. This file only lays them out. */
(function () {
  'use strict';
  const V = 10;
  const doc = document, root = doc.documentElement, HM = window.HM;
  const STATIC = /[?&]static=1/.test(location.search) || matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (STATIC) root.classList.add('static');

  const $ = (s, n) => (n || doc).querySelector(s);
  const $$ = (s, n) => Array.from((n || doc).querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  function el(tag, cls, html) { const n = doc.createElement(tag); if (cls) n.className = cls; if (html !== undefined) n.innerHTML = html; return n; }
  function btn(cls, html) { const b = el('button', cls, html); b.type = 'button'; return b; }
  function hint(node, text) { const h = el('span', 'hint', esc(text)); h.setAttribute('aria-hidden', 'true'); node.classList.add('has-hint'); node.appendChild(h); }
  function used(id) { $$('#' + id + ' .hint').forEach((h) => h.classList.add('is-gone')); }
  function pick(nodes, on) { nodes.forEach((n) => { const is = n === on; n.classList.toggle('is-on', is); n.setAttribute('aria-pressed', is ? 'true' : 'false'); }); }
  function swap(box, node) { box.replaceChildren(node); if (!STATIC) node.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 320, easing: 'cubic-bezier(.2,.7,.2,1)' }); }

  const HOW = { named: 'Skill called by name', auto: 'Claude picked up the skill', none: 'No skill' };
  const SAW = { read: 'Claude read it', unread: 'Opened, couldn\'t read it', blocked: 'Didn\'t load', found: 'In search results, not opened' };
  const SAWN = { read: (n) => 'Claude read ' + n + ' pages', unread: (n) => 'Opened ' + n + ' pages, couldn\'t read them', blocked: (n) => n + ' pages didn\'t load' };
  const labeled = (r) => (r.html.match(/class="f" data-l="[a-z]/g) || []).length;

  /* a real question and its real answer */
  function chat(id, o) {
    o = o || {};
    const r = HM.runs[id], c = el('article', 'chat inked' + (o.fix ? ' chat--fix' : '') + (o.fold ? ' chat--fold' : ''));
    const how = r.skill ? (r.named ? '' : HOW.auto) : HOW.none;
    c.innerHTML = (o.noq ? '' : '<div class="chat-q"><span class="who">You</span><p>' + esc(r.prompt) + '</p></div>') +
      '<div class="chat-a" tabindex="-1">' + r.html + '</div>' +
      '<div class="chat-m">' + (o.fold ? '<button type="button" class="more">Read the whole answer</button>' : '') + ((o.how || how) && !o.nochip ? '<span class="chip">' + (o.how || how) + '</span>' : '') + '</div>';
    $$('.lb', c).forEach((m, i) => m.style.setProperty('--i', i));
    return c;
  }

  /* what Claude did, in order, from the run's own record */
  function trail(id, focus) {
    const r = HM.runs[id], nodes = [], box = el('div', 'trail');
    r.trail.forEach((t) => {
      const last = nodes[nodes.length - 1];
      if (t.t === 'open' && last && last.t === 'open' && last.host === t.host && last.s === t.s) { if (!last.urls.includes(t.url)) { last.urls.push(t.url); last.n++; } return; }
      nodes.push(Object.assign({ n: 1, urls: [t.url] }, t));
    });
    nodes.push({ t: 'answer' });
    nodes.forEach((t, i) => {
      let k, v, s = '', cls = t.t;
      if (t.t === 'skill') { k = 'Skill'; v = r.named ? 'horses-mouth, called by name' : 'Claude picked up horses-mouth'; }
      else if (t.t === 'search') { k = 'Search'; v = esc(t.q); }
      else if (t.t === 'open') { k = t.n > 1 ? SAWN[t.s](t.n) : SAW[t.s]; v = esc(t.host); cls = t.s; }
      else { k = 'Answer'; v = labeled(r) + (labeled(r) === 1 ? ' labeled fact' : ' labeled facts'); }
      const n = el('div', 'tn tn--' + cls, '<span class="tn-k">' + k + '</span><span class="tn-v">' + v + '</span>' + (s ? '<span class="tn-s">' + s + '</span>' : ''));
      n.style.setProperty('--i', i);
      if (focus && focus(t, i, nodes)) n.classList.add('is-focus');
      box.appendChild(n);
    });
    if (focus) box.classList.add('has-focus');
    /* a node that starts a new row has no arrow coming into it */
    const rows = () => requestAnimationFrame(() => { const ns = $$('.tn', box), tops = ns.map((n) => n.offsetTop); ns.forEach((n, i) => n.classList.toggle('tn--row', i > 0 && tops[i] !== tops[i - 1])); });
    if ('ResizeObserver' in window) new ResizeObserver(rows).observe(box);
    return box;
  }

  /* ---------------------------------------------------------------- 1. hero: the opening line of five real answers, one at a time */
  function hero() {
    const items = HM.hero, box = el('div', 'fx'), dots = el('div', 'fx-dots');
    box.innerHTML = '<div class="aur" aria-hidden="true"><i></i><i></i><i></i></div><div class="fx-in"><p class="fx-q"></p><div class="fx-a"></div><div class="fx-beam" aria-hidden="true"></div><div class="fx-src"></div></div>';
    const q = $('.fx-q', box), a = $('.fx-a', box), src = $('.fx-src', box), inner = $('.fx-in', box);
    let cur = -1, timer = 0, held = false;
    const ds = items.map((it, i) => { const b = btn('fx-dot', '<i></i>'); b.setAttribute('aria-label', it.q); b.addEventListener('click', () => { held = true; show(i); }); dots.appendChild(b); return b; });
    function show(i) {
      const it = items[i];
      cur = i;
      box.dataset.l = it.l;
      pick(ds, ds[i]);
      q.textContent = it.q;
      a.innerHTML = '<p>' + it.html + '</p>';
      src.innerHTML = it.src ? '<a href="' + esc(it.src.u) + '" target="_blank" rel="noopener"><span class="dot"></span><b>' + esc(it.src.host) + '</b><span>' + SAW[it.src.s] + '</span></a>' : '<span class="fx-none"><span class="dot"></span><b>Web access off</b><span>From memory</span></span>';
      if (!STATIC) inner.animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 520, easing: 'cubic-bezier(.2,.7,.2,1)' });
    }
    box.appendChild(dots);
    $('#d-hero').appendChild(box);
    show(0);
    if (STATIC) return;
    box.addEventListener('pointerenter', () => { held = true; });
    box.addEventListener('pointerleave', () => { held = false; });
    timer = setInterval(() => { if (!held && !doc.hidden) show((cur + 1) % items.length); }, 4600);
  }

  /* ---------------------------------------------------------------- 6. one whole answer: each fact tied to the page behind it */
  function proof() {
    const r = HM.runs['S-hero'], st = el('div', 'h-stage'), c = chat('S-hero'), side = el('div', 'h-srcs');
    side.innerHTML = r.srcs.map((s, i) =>
      '<a class="src" data-i="' + i + '" data-s="' + s.s + '" href="' + esc(s.u) + '" target="_blank" rel="noopener"><span class="src-h">' + esc(s.host) +
      '</span><span class="src-t">' + s.title + '</span><span class="src-s">' + SAW[s.s] + '</span></a>').join('');
    const svg = doc.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'tether');
    svg.setAttribute('aria-hidden', 'true');
    st.append(c, side, svg);
    $('#d-proof').appendChild(st);
    const facts = $$('.chat-a .f', c).filter((f) => f.dataset.s), cards = $$('.src', side);
    let cur = 0;
    function show(i, user) {
      cur = i;
      const f = facts[i], want = f.dataset.s.split(','), col = 'var(--' + (f.dataset.l.split(' ')[0] || 'official') + ')';
      pick(facts, f);
      side.classList.add('has-on');
      cards.forEach((cd) => { cd.classList.toggle('is-on', want.includes(cd.dataset.i)); cd.style.setProperty('--c', col); });
      $$('path', svg).forEach((p) => { p.classList.toggle('is-on', +p.dataset.f === i); p.style.setProperty('--c', col); });
      if (user) used('proof');
    }
    function draw() {
      const b = st.getBoundingClientRect();
      let h = '';
      facts.forEach((f, fi) => {
        const fr = f.getBoundingClientRect();
        f.dataset.s.split(',').forEach((si) => {
          const cr = cards[si].getBoundingClientRect();
          const x1 = fr.right - b.left + 6, y1 = fr.top + fr.height / 2 - b.top, x2 = cr.left - b.left - 4, y2 = cr.top + cr.height / 2 - b.top, mx = (x1 + x2) / 2;
          h += '<path data-f="' + fi + '" d="M' + x1.toFixed(1) + ' ' + y1.toFixed(1) + ' C' + mx.toFixed(1) + ' ' + y1.toFixed(1) + ' ' + mx.toFixed(1) + ' ' + y2.toFixed(1) + ' ' + x2.toFixed(1) + ' ' + y2.toFixed(1) + '"/>';
        });
      });
      svg.innerHTML = h;
      show(cur, false);
    }
    facts.forEach((f, i) => {
      f.tabIndex = 0;
      f.setAttribute('role', 'button');
      ['pointerenter', 'click', 'focus'].forEach((ev) => f.addEventListener(ev, () => show(i, true)));
    });
    hint(facts[0], 'Pick a fact');
    if ('ResizeObserver' in window) new ResizeObserver(() => requestAnimationFrame(draw)).observe(st); else draw();
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(() => requestAnimationFrame(draw));
    $('#foot-real').textContent = 'Every answer on this page is real: ' + HM.meta.model + ', ' + HM.meta.date + '.';
  }

  /* ---------------------------------------------------------------- 2. labels */
  function labels() {
    const box = $('#d-labels'), row = el('div', 'lb-row'), def = el('p', 'lb-def'), stage = el('div', 'lb-stage');
    const pens = HM.labels.map((l, i) => {
      const b = btn('pen', '<span class="pen-body">' + l.k + '</span>');
      b.dataset.k = l.k;
      b.addEventListener('click', () => set(i, true));
      row.appendChild(b);
      return b;
    });
    function set(i, user) {
      const l = HM.labels[i];
      pick(pens, pens[i]);
      def.innerHTML = '<span><mark class="lb lb-' + l.k + '">' + l.k + '</mark> ' + esc(l.def) + '</span>';
      stage.dataset.pick = l.k;
      swap(stage, chat(l.run, { fold: true }));
      root.dataset.accent = l.k;
      if (user) used('labels');
    }
    box.append(row, def, stage);
    hint(pens[1], 'Pick a label');
    set(0, false);
  }

  /* ---------------------------------------------------------------- 3. what it covers */
  function covers() {
    const box = el('div', 'cv'), keys = el('div', 'cv-keys'), right = el('div', 'cv-right'), read = el('p', 'cv-read'), stage = el('div');
    const ks = HM.kinds.map((k, i) => {
      const b = btn('key', '<span class="key-n">' + String(i + 1).padStart(2, '0') + '</span><span class="key-t">' + esc(k.ask) + '</span>');
      b.addEventListener('click', () => set(i, true));
      keys.appendChild(b);
      return b;
    });
    function set(i, user) {
      const k = HM.kinds[i];
      pick(ks, ks[i]);
      read.innerHTML = '<span>The official source</span><b>' + esc(k.reads) + '</b>';
      const w = el('div', 'cv-stack');
      w.append(chat(k.run, { fold: true, nochip: true }), trail(k.run));
      swap(stage, w);
      if (user) used('covers');
    }
    right.append(read, stage);
    box.append(keys, right);
    $('#d-covers').appendChild(box);
    hint(ks[1], 'Pick a kind of fact');
    set(0, false);
  }

  /* ---------------------------------------------------------------- 4. the seven steps, each on a real run */
  const STEP = [
    { f: (t) => t.t === 'open' },
    { f: (t) => t.t === 'open' && t.host === 'copyright.gov' && t.s === 'read' },
    { f: (t) => t.t === 'search' },
    { f: (t, i, a) => i > a.findIndex((x) => x.t === 'open') },
    { f: (t) => t.t === 'open' && t.s === 'read' },
    { f: (t) => t.t === 'open' && t.s === 'read' },
    { f: () => true },
  ];
  function steps() {
    const box = $('#d-steps'), rail = el('div', 'st-rail', '<i></i>'), title = el('h3', 'st-title'), tr = el('div', 'st-trail'), ch = el('div', 'st-chat'), nav = el('div', 'st-nav');
    let cur = 0;
    const bs = HM.steps.map((s, i) => {
      const b = btn('st-b', '<b>' + (i + 1) + '</b>');
      b.setAttribute('aria-label', 'Step ' + (i + 1) + ': ' + s.t);
      b.addEventListener('click', () => set(i, true));
      rail.appendChild(b);
      return b;
    });
    const prev = btn('btn btn--ghost', 'Back'), next = btn('btn btn--ink', 'Next step');
    prev.addEventListener('click', () => set((cur + 6) % 7, true));
    next.addEventListener('click', () => set((cur + 1) % 7, true));
    nav.append(prev, next);
    const trs = HM.steps.map((s, i) => { const t = trail(s.run, STEP[i].f); t.classList.add('st-t'); tr.appendChild(t); return t; });
    function set(i, user) {
      cur = i;
      const s = HM.steps[i];
      pick(bs, bs[i]);
      bs.forEach((b, k) => b.classList.toggle('is-done', k < i));
      $('i', rail).style.transform = 'scaleX(' + i / 6 + ')';
      title.textContent = s.t;
      trs.forEach((t, k) => t.classList.toggle('is-on', k === i));
      ch.replaceChildren(chat(s.run, { fold: true, nochip: true }));
      if (user) used('steps');
    }
    box.append(rail, title, nav, tr, ch);
    hint(next, 'Step through');
    set(0, false);
  }

  /* ---------------------------------------------------------------- 5. effort dial */
  function effort() {
    const levels = ['low', 'medium', 'high'], turn = { low: -120, medium: 0, high: 120 };
    const box = el('div', 'ef'), side = el('div', 'ef-side'), dial = el('div', 'dial', '<div class="dial-knob"></div>'), meter = el('div', 'meter'), stage = el('div');
    const ts = levels.map((k) => { const b = btn('dial-t', k); b.dataset.k = k; b.addEventListener('click', () => set(k, true)); dial.appendChild(b); return b; });
    function set(k, user) {
      const r = HM.runs['N-effort-' + k];
      if (dial.dataset.k === k) return;
      dial.dataset.k = k;
      pick(ts, ts[levels.indexOf(k)]);
      $('.dial-knob', dial).style.transform = 'rotate(' + turn[k] + 'deg)';
      meter.innerHTML = '<div><b>' + r.n.search + '</b><span>' + (r.n.search === 1 ? 'search' : 'searches') + '</span></div><div><b>' + r.n.read + '</b><span>' + (r.n.read === 1 ? 'page read' : 'pages read') + '</span></div><div><b>' + labeled(r) + '</b><span>' + (labeled(r) === 1 ? 'labeled fact' : 'labeled facts') + '</span></div>';
      swap(stage, chat('N-effort-' + k, { fold: true }));
      if (user) used('effort');
    }
    function drag(e) {
      const b = dial.getBoundingClientRect(), a = Math.atan2(e.clientX - (b.left + b.width / 2), -(e.clientY - (b.top + b.height / 2))) * 180 / Math.PI;
      set(a < -60 ? 'low' : a > 60 ? 'high' : 'medium', true);
    }
    dial.addEventListener('pointerdown', (e) => { if (e.target.closest('.dial-t')) return; dial.setPointerCapture(e.pointerId); drag(e); dial.onpointermove = drag; });
    dial.addEventListener('pointerup', () => { dial.onpointermove = null; });
    side.append(dial, meter);
    box.append(side, stage);
    $('#d-effort').appendChild(box);
    hint(ts[2], 'Turn the dial');
    set('low', false);
  }

  /* ---------------------------------------------------------------- 6. the source never published it */
  function neverpub() {
    const r = HM.runs['N-neverpub'], box = el('div', 'np'), cards = el('div', 'np-cards');
    r.trail.filter((t) => t.t === 'open').forEach((t, i) => {
      const b = btn('flip', '<span class="flip-in"><span class="flip-f"><span class="flip-k">Claude opened</span><span class="flip-v">' + esc(t.host) + '</span><span class="flip-s">' + esc(t.path) +
        '</span></span><span class="flip-b"><span class="flip-k">What came back to Claude</span><span class="flip-s">' + esc(t.said) + '</span></span></span>');
      b.addEventListener('click', () => { b.classList.toggle('is-on'); used('neverpub'); });
      cards.appendChild(b);
      if (i === 0) hint(b, 'Flip a card');
    });
    box.append(cards, chat('N-neverpub', { fold: true }));
    $('#d-neverpub').appendChild(box);
  }

  /* ---------------------------------------------------------------- 7. no one owns the fact: Claude's own words on what it used, set large */
  function nosource() {
    const box = el('div', 'one'), c = chat('N-nosource3', { fold: true, nochip: true });
    const f = $$('.chat-a .f', c).find((n) => n.textContent.includes('No one owns this fact'));
    const pull = el('blockquote', 'pull', f.innerHTML);
    box.append(trail('N-nosource3', (t) => t.t !== 'skill'), pull, c);
    $('#d-nosource').appendChild(box);
  }

  /* ---------------------------------------------------------------- 8. the four checks, on an answer where one could not be met */
  const CHECK = [
    { no: 1, r: 'Claude could not. The answer says so.', p: 'refused my direct fetches with an HTTP 403 error' },
    { r: 'The answer labels its figures secondhand.', h: /The figures above are <strong><mark[^>]*>secondhand<\/mark><\/strong>\./ },
    { no: 1, r: 'One fee stayed unclear. The answer names it.', p: 'I couldn\'t check the delivery fee, because the summary said an older page lists a different figure.' },
    { r: 'Nothing in this answer is labeled calculated.', p: '' },
  ];
  function checks() {
    const box = el('div', 'ck'), list = el('div', 'ck-list'), c = chat('S-k04', { fix: true }), a = $('.chat-a', c);
    const qs = (HM.skill.match(/- \[ \] (.+?\?)/g) || []).map((s) => s.replace('- [ ] ', ''));
    CHECK.forEach((k, i) => { const n = k.h || (k.p && esc(k.p).replace(/&quot;/g, '"')); if (n) a.innerHTML = a.innerHTML.replace(n, (m) => '<span class="hl" data-c="' + i + '">' + m + '</span>'); });
    const bs = qs.map((text, i) => {
      const b = btn('ck-b', '<span class="ck-box"><svg viewBox="0 0 16 16" aria-hidden="true">' + (CHECK[i].no ? '<path d="M4 8h8" fill="none" stroke="#fff" stroke-width="2.400" stroke-linecap="round"/>' : '<circle cx="8" cy="8" r="3.200" fill="#fff"/>') + '</svg></span><span class="ck-q">' + esc(text) + '</span><span class="ck-r"></span>');
      b.addEventListener('click', () => {
        pick(bs, b);
        b.classList.add('is-done');
        b.classList.toggle('is-no', !!CHECK[i].no);
        $('.ck-r', b).textContent = CHECK[i].r;
        const hit = $('.hl[data-c="' + i + '"]', a);
        $$('.hl', a).forEach((n) => n.classList.toggle('is-on', n === hit));
        if (hit) a.scrollTo({ top: hit.offsetTop - a.offsetTop - 60, behavior: STATIC ? 'auto' : 'smooth' });
        used('checks');
      });
      list.appendChild(b);
      return b;
    });
    box.append(list, c);
    $('#d-checks').appendChild(box);
    hint(bs[0], 'Start here');
  }

  /* ---------------------------------------------------------------- 9. everyday chat */
  function skip() {
    const ids = ['S-skip1', 'S-skip2', 'S-skip3'], box = el('div', 'one'), ctl = el('div', 'ctl'), gauge = el('div', 'trail'), stage = el('div');
    stage.style.width = '100%';
    const ps = ids.map((id, i) => { const b = btn('pill', esc(HM.runs[id].q)); b.addEventListener('click', () => set(i, true)); ctl.appendChild(b); return b; });
    function set(i, user) {
      const r = HM.runs[ids[i]];
      pick(ps, ps[i]);
      gauge.innerHTML = '<div class="tn tn--off"><span class="tn-k">Skill</span><span class="tn-v">' + (r.skill ? 'Used' : 'Not used') + '</span></div><div class="tn tn--off"><span class="tn-k">Web</span><span class="tn-v">' + r.n.search + ' searches, ' + r.n.open + ' pages</span></div><div class="tn"><span class="tn-k">Answer</span><span class="tn-v">Plain answer, no labels</span></div>';
      swap(stage, chat(ids[i], { fix: i === 2, noq: true, nochip: true }));
      if (user) used('skip');
    }
    box.append(ctl, gauge, stage);
    $('#d-skip').appendChild(box);
    hint(ps[1], 'Ask a question');
    set(0, false);
  }

  /* ---------------------------------------------------------------- 10. on purpose */
  function purpose() {
    const r = HM.runs['N-purpose'], box = el('div', 'one'), bar = el('div', 'prompt'), p = el('p'), run = btn('btn btn--ink', 'Run'), out = el('div', 'one');
    const name = r.prompt.slice(0, r.prompt.length - r.q.length), full = '<mark class="lb lb-official">' + esc(name.trim()) + '</mark> ' + esc(r.q);
    out.style.width = '100%';
    p.innerHTML = full;
    bar.append(p, run);
    out.append(trail('N-purpose'), chat('N-purpose', { noq: true }));
    let busy = 0;
    run.addEventListener('click', () => {
      used('purpose');
      if (STATIC || busy) return;
      busy = 1;
      p.style.minHeight = p.offsetHeight + 'px';
      out.style.visibility = 'hidden';
      out.classList.remove('play');
      p.classList.add('caret');
      let n = 0;
      const tick = () => {
        n += 2;
        p.textContent = r.prompt.slice(0, n);
        if (n < r.prompt.length) return setTimeout(tick, 18);
        p.innerHTML = full;
        p.classList.remove('caret');
        out.style.visibility = '';
        $$('.chat-a > *', out).forEach((x, i) => x.style.setProperty('--i', i + 4));
        out.classList.add('play');
        busy = 0;
      };
      tick();
    });
    box.append(bar, out);
    $('#d-purpose').appendChild(box);
    hint(run, 'Press run');
  }

  /* ---------------------------------------------------------------- 12. the skill file itself */
  function light() {
    const m = HM.meta, box = el('div', 'sk'), ctl = el('div', 'ctl'), file = el('div', 'sk-file');
    const at = HM.skill.indexOf(HM.desc);
    file.innerHTML = '<div class="sk-bar"><span>skills/horses-mouth/SKILL.md</span><b></b></div><pre tabindex="0"><span class="sk-rest">' + esc(HM.skill.slice(0, at)) + '</span><span class="sk-desc">' + esc(HM.desc) +
      '</span><span class="sk-rest">' + esc(HM.skill.slice(at + HM.desc.length)) + '</span></pre>';
    const views = [['desc', 'What Claude always sees', m.descWords + ' words in view'], ['full', 'What it reads when a question calls for it', m.skillWords + ' words in view']];
    const ps = views.map((v, i) => { const b = btn('pill', v[1]); b.addEventListener('click', () => set(i, true)); ctl.appendChild(b); return b; });
    function set(i, user) { pick(ps, ps[i]); file.dataset.view = views[i][0]; $('.sk-bar b', file).textContent = views[i][2]; if (user) used('light'); }
    box.append(ctl, file);
    $('#d-light').appendChild(box);
    hint(ps[1], 'Flip it');
    set(0, false);
  }

  /* ---------------------------------------------------------------- boot */
  hero();
  const seen = (sec) => sec.classList.add('is-shown');
  seen($('#hero'));
  root.classList.add('is-booted');
  if ('IntersectionObserver' in window && !STATIC) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { io.unobserve(e.target); seen(e.target); } }), { rootMargin: '0px 0px -14% 0px' });
    $$('.sec').forEach((s) => io.observe(s));
  } else $$('.sec').forEach(seen);
  /* a second way in, in case the observer never fires */
  let tick = 0;
  addEventListener('scroll', () => { if (tick) return; tick = requestAnimationFrame(() => { tick = 0; $$('.sec:not(.is-shown)').forEach((s) => { if (s.getBoundingClientRect().top < innerHeight * .9) seen(s); }); }); }, { passive: true });

  doc.addEventListener('click', (e) => {
    const dl = e.target.closest('a.dl');
    if (dl) setTimeout(() => $('#install').scrollIntoView({ behavior: STATIC ? 'auto' : 'smooth', block: 'start' }), 400);
    const cp = e.target.closest('[data-copy]');
    if (cp) {
      const was = cp.textContent, done = () => { cp.textContent = 'Copied'; setTimeout(() => { cp.textContent = was; }, 1600); };
      if (navigator.clipboard) navigator.clipboard.writeText(doc.getElementById(cp.dataset.copy).textContent).then(done, () => {}); else done();
    }
    const more = e.target.closest('.more');
    if (more) { const c = more.closest('.chat'), open = c.classList.toggle('chat--fix'); c.classList.toggle('chat--fold', !open); more.textContent = open ? 'Show less' : 'Read the whole answer'; const sec = more.closest('.sec'); if (sec) used(sec.id); }
    const tab = e.target.closest('.tab');
    if (tab) {
      $$('.tab').forEach((t) => { const is = t === tab; t.classList.toggle('is-on', is); t.setAttribute('aria-selected', is ? 'true' : 'false'); });
      $$('[data-pane]').forEach((p) => { p.hidden = p.dataset.pane !== tab.dataset.tab; });
    }
  });

  if (!STATIC && matchMedia('(hover: hover)').matches) $$('.sec--dark').forEach((sec) => {
    const t = el('div', 'torch');
    let raf = 0, x = 0, y = 0;
    sec.prepend(t);
    let top = 0;
    sec.addEventListener('pointerenter', () => { top = sec.getBoundingClientRect().top + scrollY; });
    sec.addEventListener('pointermove', (e) => {
      x = e.pageX; y = e.pageY - top;
      if (!raf) raf = requestAnimationFrame(() => { raf = 0; t.style.setProperty('--x', x + 'px'); t.style.setProperty('--y', y + 'px'); });
    });
  });

  function late() {
    const s = doc.createElement('script');
    s.src = 'assets/data.js?v=' + V;
    s.onload = () => [labels, covers, steps, effort, proof, nosource, neverpub, skip, checks, purpose, light].forEach((fn) => { try { fn(); } catch (err) { console.error(fn.name, err); } });
    doc.head.appendChild(s);
  }
  if (doc.readyState === 'complete') late(); else window.addEventListener('load', late);
})();
