(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.add('js');

  /* Footer year */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* Theme toggle (persists choice; otherwise follows the system) */
  var toggle = document.getElementById('theme-toggle');
  var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
  function isDark() {
    var t = root.dataset.theme;
    return t ? t === 'dark' : darkQuery.matches;
  }
  function syncThemeColor() {
    var color = isDark() ? '#0b0b12' : '#f7f7fb';
    document.querySelectorAll('meta[name="theme-color"]').forEach(function (m) { m.setAttribute('content', color); });
  }
  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = isDark() ? 'light' : 'dark';
      root.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch (e) {}
      syncThemeColor();
    });
  }
  if (root.dataset.theme) syncThemeColor();

  /* Header shadow + back-to-top visibility */
  var header = document.getElementById('header');
  var toTop = document.getElementById('to-top');
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 10);
    if (toTop) toTop.classList.toggle('is-visible', y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Typing effect */
  var typed = document.getElementById('typed');
  if (typed && !reduceMotion) {
    var words = JSON.parse(typed.dataset.words || '[]');
    var w = 0, c = words[0] ? words[0].length : 0, deleting = true;
    (function tick() {
      var word = words[w];
      c += deleting ? -1 : 1;
      typed.textContent = word.slice(0, c);
      var delay = deleting ? 45 : 85;
      if (!deleting && c === word.length) { deleting = true; delay = 1800; }
      else if (deleting && c === 0) { deleting = false; w = (w + 1) % words.length; delay = 300; }
      setTimeout(tick, delay);
    })();
  }

  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  /* Reveal on scroll */
  var revealer = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); revealer.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(function (el) { revealer.observe(el); });

  /* Active section highlighting for top nav + bottom tab bar */
  var links = document.querySelectorAll('.nav a, .tabbar a');
  function setActive(id) {
    links.forEach(function (a) {
      var match = a.getAttribute('href') === '#' + id || a.dataset.also === id;
      a.classList.toggle('is-active', match);
      if (match) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
  }
  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) setActive(e.target.id); });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main section[id]').forEach(function (s) { spy.observe(s); });
})();

/* Offline support / installable app */
if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('sw.js').catch(function () {});
  });
}
