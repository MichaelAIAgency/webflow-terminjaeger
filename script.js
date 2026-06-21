/* Terminjäger — hero + nav interactions */
(function () {
  'use strict';

  // --- Mobile menu toggle & smooth scroll ---
  var burger = document.getElementById('tjBurger');
  var mobile = document.getElementById('tjMobile');
  if (burger && mobile) {
    burger.addEventListener('click', function () {
      var open = mobile.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // --- Smooth scroll for same-page anchors ---
  document.querySelectorAll('a[href^="#"], a[href^="/#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      var hashIndex = href.indexOf('#');
      if (hashIndex === -1) return;
      
      var targetId = href.substring(hashIndex + 1);
      if (!targetId) return;
      
      var targetEl = document.getElementById(targetId);
      if (targetEl) {
        e.preventDefault();
        
        // Close mobile dropdown if open
        if (mobile && mobile.classList.contains('is-open')) {
          mobile.classList.remove('is-open');
          if (burger) {
            burger.setAttribute('aria-expanded', 'false');
          }
        }
        
        // Calculate sticky header offset dynamically
        var nav = document.querySelector('.tj-nav');
        var navHeight = nav ? nav.offsetHeight : 80;
        
        // Smooth scroll with offset
        var targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Update URL hash without jumping
        if (history.pushState) {
          history.pushState(null, null, '#' + targetId);
        }
      }
    });
  });

  // --- Seamless logo marquee ---
  // Wait for every logo image to settle (load or error), THEN clone the track
  // so both copies are identical, then start the CSS animation.
  // This prevents the "cut" caused by onerror removals happening after the
  // clone was already made, leaving the two tracks at different widths.
  (function () {
    var track = document.getElementById('tjMarquee');
    if (!track) return;
    var imgs = Array.from(track.querySelectorAll('img'));
    var remaining = imgs.length || 1;

    function onSettle() {
      remaining -= 1;
      if (remaining > 0) return;
      // All images settled — clone now so both tracks are identical
      var clone = track.cloneNode(true);
      clone.removeAttribute('id');
      clone.setAttribute('aria-hidden', 'true');
      track.parentNode.appendChild(clone);
      // Start animation on both tracks simultaneously
      track.classList.add('is-running');
      clone.classList.add('is-running');
    }

    if (imgs.length === 0) { onSettle(); return; }
    imgs.forEach(function (img) {
      if (img.complete) {
        // already done (cached or data-uri)
        onSettle();
      } else {
        img.addEventListener('load', onSettle, { once: true });
        img.addEventListener('error', function () { img.remove(); onSettle(); }, { once: true });
      }
    });
  }());

  // --- Stat counters: animate 0 -> target when scrolled into view ---
  function animateCount(el) {
    var raw = el.getAttribute('data-target') || el.textContent.trim();
    el.setAttribute('data-target', raw);
    var m = raw.match(/^([\d.,]+)(.*)$/);          // "100K+" -> ["100","K+"]
    if (!m) { return; }
    var target = parseFloat(m[1].replace(/,/g, ''));
    var suffix = m[2];
    var dur = 1600, start = null;
    function tick(now) {
      if (start === null) { start = now; }
      var p = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);          // easeOutCubic
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) { requestAnimationFrame(tick); }
      else { el.textContent = m[1] + suffix; }     // restore exact original
    }
    el.textContent = '0' + suffix;
    requestAnimationFrame(tick);
  }

  // --- Testimonials carousel: arrows scroll the snap track by one card ---
  var tTrack = document.getElementById('tjTestiTrack');
  var tPrev = document.getElementById('tjTestiPrev');
  var tNext = document.getElementById('tjTestiNext');
  if (tTrack && tPrev && tNext) {
    var stepWidth = function () {
      var card = tTrack.querySelector('.tj-tcard');
      if (!card) { return tTrack.clientWidth; }
      var styles = getComputedStyle(tTrack);
      var gap = parseFloat(styles.columnGap || styles.gap) || 24;
      return card.getBoundingClientRect().width + gap;
    };
    tPrev.addEventListener('click', function () { tTrack.scrollBy({ left: -stepWidth(), behavior: 'smooth' }); });
    tNext.addEventListener('click', function () { tTrack.scrollBy({ left: stepWidth(), behavior: 'smooth' }); });
  }

  // --- FAQ accordion: toggle each item independently ---
  var faq = document.getElementById('tjFaq');
  if (faq) {
    faq.querySelectorAll('.tj-acc__head').forEach(function (head) {
      head.addEventListener('click', function () {
        var item = head.closest('.tj-acc');
        var open = item.classList.toggle('is-open');
        head.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    });
  }

  // --- Scroll reveal: add .is-in to cards when they enter the viewport ---
  var reveals = document.querySelectorAll('.tj-wcard');
  var reduceMo = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reveals.length && 'IntersectionObserver' in window && !reduceMo) {
    var revObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); revObs.unobserve(e.target); }
      });
    }, { threshold: 0.2 });
    reveals.forEach(function (el) { revObs.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  // --- Timeline Step Animations ---
  var steps = document.querySelectorAll('.tj-step');
  if (steps.length && 'IntersectionObserver' in window && !reduceMo) {
    var stepObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var step = e.target;
          step.classList.add('is-in');
          
          // Animate Step 1 percentages
          step.querySelectorAll('.tj-mock__match').forEach(function (el) {
            animatePercent(el);
          });
          
          // Animate Step 5 hours
          step.querySelectorAll('.tj-mock__timer-hours').forEach(function (el) {
            animateHours(el);
          });
          
          // Animate Step 6 cost countdown
          step.querySelectorAll('.tj-mock__guarantee-price').forEach(function (el) {
            animateCountdown(el);
          });
          
          stepObs.unobserve(step);
        }
      });
    }, { threshold: 0.25 });
    steps.forEach(function (el) { stepObs.observe(el); });
  } else {
    steps.forEach(function (el) {
      el.classList.add('is-in');
      el.querySelectorAll('.tj-mock__match').forEach(function (el) { el.textContent = el.getAttribute('data-value') + '%'; });
      el.querySelectorAll('.tj-mock__timer-hours').forEach(function (el) {
        el.textContent = el.getAttribute('data-value');
        var progressEl = el.closest('.tj-mock--timer') ? el.closest('.tj-mock--timer').querySelector('.tj-mock__progress i') : null;
        if (progressEl) { progressEl.style.width = '100%'; }
      });
      el.querySelectorAll('.tj-mock__guarantee-price').forEach(function (el) {
        el.textContent = el.getAttribute('data-value');
        if (parseInt(el.getAttribute('data-value'), 10) === 0) { el.classList.add('is-success'); }
      });
    });
  }

  function animatePercent(el) {
    var target = parseInt(el.getAttribute('data-value'), 10) || 0;
    var dur = 1200, start = null;
    function tick(now) {
      if (start === null) { start = now; }
      var p = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + '%';
      if (p < 1) { requestAnimationFrame(tick); }
    }
    requestAnimationFrame(tick);
  }

  function animateHours(el) {
    var target = parseInt(el.getAttribute('data-value'), 10) || 0;
    var progressEl = el.closest('.tj-mock--timer') ? el.closest('.tj-mock--timer').querySelector('.tj-mock__progress i') : null;
    var dur = 1400, start = null;
    function tick(now) {
      if (start === null) { start = now; }
      var p = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var current = Math.round(target * eased);
      el.textContent = current < 10 ? '0' + current : current;
      if (progressEl) {
        progressEl.style.width = (eased * 100) + '%';
      }
      if (p < 1) { requestAnimationFrame(tick); }
    }
    requestAnimationFrame(tick);
  }

  function animateCountdown(el) {
    var startVal = parseInt(el.getAttribute('data-start'), 10) || 450;
    var targetVal = parseInt(el.getAttribute('data-value'), 10) || 0;
    var dur = 1500, start = null;
    function tick(now) {
      if (start === null) { start = now; }
      var p = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var current = Math.round(startVal - (startVal - targetVal) * eased);
      el.textContent = current;
      if (p < 1) {
        requestAnimationFrame(tick);
      } else {
        if (targetVal === 0) {
          el.classList.add('is-success');
        }
      }
    }
    requestAnimationFrame(tick);
  }

  var nums = document.querySelectorAll('.tj-stat__num');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (nums.length && 'IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCount(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.4 });
    nums.forEach(function (n) { io.observe(n); });
  }
})();

(function () {
  var bar = document.getElementById('tjAnnounce');
  if (!bar) return;
  if (localStorage.getItem('tjAnnounceClosed') === '1') { bar.classList.add('is-hidden'); return; }
  var btn = document.getElementById('tjAnnounceClose');
  if (btn) btn.addEventListener('click', function () {
    bar.classList.add('is-hidden');
    try { localStorage.setItem('tjAnnounceClosed', '1'); } catch (e) {}
  });
})();

