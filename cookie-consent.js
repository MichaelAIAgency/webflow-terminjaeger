(function() {
  'use strict';

  // CSS Styles for the Cookie Banner & Dynamic Video Blockers
  var styles = `
    .tj-cookie-banner {
      position: fixed;
      bottom: 24px;
      left: 24px;
      transform: translateY(120px);
      width: calc(100% - 48px);
      max-width: 360px;
      background: #133227;
      color: #f5f3ed;
      border: 1px solid rgba(237, 188, 108, 0.3);
      border-radius: 14px;
      box-shadow: 0 10px 32px rgba(0, 0, 0, 0.5);
      padding: 18px;
      z-index: 100000;
      opacity: 0;
      visibility: hidden;
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease, visibility 0.4s;
      font-family: 'Lato', sans-serif;
    }
    .tj-cookie-banner.is-visible {
      transform: translateY(0);
      opacity: 1;
      visibility: visible;
    }
    .tj-cookie-banner__title {
      font-family: 'Lora', Georgia, serif;
      font-size: 16px;
      font-weight: 600;
      color: #edbc6c;
      margin-bottom: 8px;
    }
    .tj-cookie-banner__text {
      font-size: 12px;
      line-height: 1.5;
      color: rgba(245, 243, 237, 0.85);
      margin-bottom: 14px;
    }
    .tj-cookie-banner__text a {
      color: #edbc6c;
      text-decoration: underline;
      transition: color 0.2s;
    }
    .tj-cookie-banner__text a:hover {
      color: #fff;
    }
    .tj-cookie-banner__options {
      display: flex;
      flex-direction: column;
      gap: 9px;
      margin-bottom: 16px;
      background: rgba(255, 255, 255, 0.05);
      padding: 12px;
      border-radius: 10px;
    }
    .tj-cookie-banner__option {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      cursor: pointer;
    }
    .tj-cookie-banner__option input[type="checkbox"] {
      width: 18px;
      height: 18px;
      accent-color: #c68857;
      margin-top: 2px;
      cursor: pointer;
    }
    .tj-cookie-banner__option-label {
      font-size: 12.5px;
      font-weight: 700;
      color: #f5f3ed;
    }
    .tj-cookie-banner__option-desc {
      font-size: 11px;
      color: rgba(245, 243, 237, 0.6);
      margin-top: 2px;
    }
    .tj-cookie-banner__buttons {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    @media (max-width: 480px) {
      .tj-cookie-banner__buttons {
        grid-template-columns: 1fr;
      }
    }
    .tj-cookie-banner__btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 9px 14px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
      text-align: center;
    }
    .tj-cookie-banner__btn--accept {
      background: #c68857;
      color: #fff;
    }
    .tj-cookie-banner__btn--accept:hover {
      background: #edbc6c;
      transform: translateY(-1px);
    }
    .tj-cookie-banner__btn--reject {
      background: transparent;
      border: 1px solid rgba(245, 243, 237, 0.3);
      color: #f5f3ed;
    }
    .tj-cookie-banner__btn--reject:hover {
      background: rgba(245, 243, 237, 0.1);
      border-color: #f5f3ed;
    }
    .tj-cookie-banner__btn--save {
      background: rgba(198, 136, 87, 0.15);
      border: 1px solid #c68857;
      color: #edbc6c;
      grid-column: span 2;
    }
    @media (max-width: 480px) {
      .tj-cookie-banner__btn--save {
        grid-column: span 1;
      }
    }
    .tj-cookie-banner__btn--save:hover {
      background: rgba(198, 136, 87, 0.3);
      color: #fff;
    }
    /* Content blocker styles for Wistia iFrames */
    .tj-video-blocked {
      position: absolute;
      inset: 0;
      background: radial-gradient(120% 100% at 50% 30%, #153729 0%, #071711 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 16px;
      text-align: center;
      color: #f5f3ed;
      z-index: 10;
      border-radius: 12px;
      font-family: 'Lato', sans-serif;
    }
    .tj-video-blocked p {
      font-size: 11px;
      margin: 0 0 10px 0;
      color: rgba(245, 243, 237, 0.75);
      max-width: 220px;
      line-height: 1.45;
    }
    .tj-video-blocked button {
      background: #c68857;
      border: none;
      color: #fff;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.2s, transform 0.2s;
    }
    .tj-video-blocked button:hover {
      background: #edbc6c;
      transform: scale(1.03);
    }
  `;

  // Inject Stylesheet dynamically
  var styleEl = document.createElement('style');
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);

  var STORAGE_KEY = 'tj_cookie_consent';

  function getConsent() {
    try {
      var val = localStorage.getItem(STORAGE_KEY);
      return val ? JSON.parse(val) : null;
    } catch(e) {
      return null;
    }
  }

  function setConsent(consent) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
      window.dispatchEvent(new CustomEvent('tjCookieConsentChanged', { detail: consent }));
    } catch(e) {}
  }

  // Videos are always loaded and visible regardless of cookie consent.
  function updateExternalMedias(consent) {
    var hasMarketing = true;
    var iframes = document.querySelectorAll('.tj-vcard__video iframe, .tj-case__video iframe');
    
    iframes.forEach(function(iframe) {
      var src = iframe.getAttribute('src') || iframe.getAttribute('data-src');
      if (!iframe.getAttribute('data-src') && src) {
        iframe.setAttribute('data-src', src);
      }
      
      var originalSrc = iframe.getAttribute('data-src');
      var parent = iframe.parentNode;
      
      var blocker = parent.querySelector('.tj-video-blocked');
      if (blocker) {
        blocker.remove();
      }
      
      if (hasMarketing) {
        iframe.style.display = 'block';
        if (iframe.getAttribute('src') !== originalSrc) {
          iframe.setAttribute('src', originalSrc);
        }
      } else {
        iframe.style.display = 'none';
        iframe.removeAttribute('src'); // Stop execution and cookie creation
        
        var blockerEl = document.createElement('div');
        blockerEl.className = 'tj-video-blocked';
        blockerEl.innerHTML = `
          <p>Dieses Video-Testimonial wird von Wistia geladen. Bitte akzeptieren Sie Cookies für Externe Medien, um das Video anzusehen.</p>
          <button class="tj-cookie-enable-video">Video laden</button>
        `;
        blockerEl.querySelector('button').addEventListener('click', function() {
          var newConsent = { essential: true, marketing: true };
          setConsent(newConsent);
          updateExternalMedias(newConsent);
          
          var banner = document.querySelector('.tj-cookie-banner');
          if (banner) {
            banner.classList.remove('is-visible');
          }
        });
        parent.appendChild(blockerEl);
      }
    });
  }

  // Create markup
  function init() {
    var consent = getConsent();
    
    var banner = document.createElement('div');
    banner.className = 'tj-cookie-banner';
    banner.innerHTML = `
      <div class="tj-cookie-banner__title">Cookie-Einstellungen</div>
      <div class="tj-cookie-banner__text">
        Wir verwenden Cookies auf unserer Website, um Ihnen ein optimales Nutzererlebnis zu bieten. Einige von ihnen sind technisch erforderlich (Essenziell), während andere uns dabei helfen, externe Medien (wie z. B. Wistia Video-Testimonials) zu laden. Sie können Ihre Einstellungen jederzeit anpassen. Weitere Details finden Sie in unserer <a href="/datenschutzerklaerung" target="_blank">Datenschutzerklärung</a> und unserem <a href="/impressum" target="_blank">Impressum</a>.
      </div>
      
      <div class="tj-cookie-banner__options">
        <label class="tj-cookie-banner__option">
          <input type="checkbox" checked disabled>
          <div>
            <div class="tj-cookie-banner__option-label">Essenziell</div>
            <div class="tj-cookie-banner__option-desc">Erforderlich für die grundlegende Funktion der Website (z. B. Speichern Ihrer getroffenen Cookie-Auswahl).</div>
          </div>
        </label>
        
        <label class="tj-cookie-banner__option">
          <input type="checkbox" id="tj-cookie-opt-marketing" ${consent && consent.marketing ? 'checked' : ''}>
          <div>
            <div class="tj-cookie-banner__option-label">Externe Medien &amp; Statistiken</div>
            <div class="tj-cookie-banner__option-desc">Ermöglicht das direkte Laden und Abspielen der Wistia Video-Testimonials auf unserer Website.</div>
          </div>
        </label>
      </div>
      
      <div class="tj-cookie-banner__buttons">
        <button class="tj-cookie-banner__btn tj-cookie-banner__btn--reject" id="tj-cookie-btn-reject">Alle ablehnen</button>
        <button class="tj-cookie-banner__btn tj-cookie-banner__btn--accept" id="tj-cookie-btn-accept">Alle akzeptieren</button>
        <button class="tj-cookie-banner__btn tj-cookie-banner__btn--save" id="tj-cookie-btn-save">Auswahl speichern</button>
      </div>
    `;
    
    document.body.appendChild(banner);

    // Re-open the banner from a link in the footer (instead of a floating button).
    function openBanner() {
      var current = getConsent() || { essential: true, marketing: false };
      var cb = document.getElementById('tj-cookie-opt-marketing');
      if (cb) cb.checked = !!current.marketing;
      banner.classList.add('is-visible');
    }

    // Inject a "Cookie-Einstellungen" link into the footer's "Rechtliches" column.
    var heads = document.querySelectorAll('.tj-footer__h');
    for (var hi = 0; hi < heads.length; hi++) {
      if (heads[hi].textContent.trim().toLowerCase() === 'rechtliches') {
        var col = heads[hi].parentNode;
        if (col.querySelector('.tj-cookie-settings')) continue;
        var link = document.createElement('a');
        link.href = '#';
        link.className = 'tj-cookie-settings';
        link.textContent = 'Cookie-Einstellungen';
        link.addEventListener('click', function(e) { e.preventDefault(); openBanner(); });
        col.appendChild(link);
      }
    }

    if (!consent) {
      setTimeout(function() {
        banner.classList.add('is-visible');
      }, 800);
      updateExternalMedias({ essential: true, marketing: false });
    } else {
      updateExternalMedias(consent);
    }

    document.getElementById('tj-cookie-btn-accept').addEventListener('click', function() {
      var newConsent = { essential: true, marketing: true };
      setConsent(newConsent);
      updateExternalMedias(newConsent);
      banner.classList.remove('is-visible');
    });
    
    document.getElementById('tj-cookie-btn-reject').addEventListener('click', function() {
      var newConsent = { essential: true, marketing: false };
      setConsent(newConsent);
      updateExternalMedias(newConsent);
      banner.classList.remove('is-visible');
    });
    
    document.getElementById('tj-cookie-btn-save').addEventListener('click', function() {
      var isMarketingChecked = document.getElementById('tj-cookie-opt-marketing').checked;
      var newConsent = { essential: true, marketing: isMarketingChecked };
      setConsent(newConsent);
      updateExternalMedias(newConsent);
      banner.classList.remove('is-visible');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
