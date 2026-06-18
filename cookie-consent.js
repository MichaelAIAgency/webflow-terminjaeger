(function() {
  'use strict';

  // CSS Styles for the Cookie Banner & Dynamic Video Blockers
  var styles = `
    .tj-cookie-banner {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translate(-50%, 100px);
      width: 90%;
      max-width: 580px;
      background: #133227;
      color: #f5f3ed;
      border: 1px solid rgba(237, 188, 108, 0.3);
      border-radius: 16px;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
      padding: 24px;
      z-index: 100000;
      opacity: 0;
      visibility: hidden;
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease, visibility 0.4s;
      font-family: 'Lato', sans-serif;
    }
    .tj-cookie-banner.is-visible {
      transform: translate(-50%, 0);
      opacity: 1;
      visibility: visible;
    }
    .tj-cookie-banner__title {
      font-family: 'Lora', Georgia, serif;
      font-size: 20px;
      font-weight: 600;
      color: #edbc6c;
      margin-bottom: 12px;
    }
    .tj-cookie-banner__text {
      font-size: 13.5px;
      line-height: 1.6;
      color: rgba(245, 243, 237, 0.85);
      margin-bottom: 20px;
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
      gap: 12px;
      margin-bottom: 24px;
      background: rgba(255, 255, 255, 0.05);
      padding: 16px;
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
      font-size: 13.5px;
      font-weight: 700;
      color: #f5f3ed;
    }
    .tj-cookie-banner__option-desc {
      font-size: 12px;
      color: rgba(245, 243, 237, 0.6);
      margin-top: 2px;
    }
    .tj-cookie-banner__buttons {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
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
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 13.5px;
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
    
    /* Floating trigger badge */
    .tj-cookie-trigger {
      position: fixed;
      bottom: 20px;
      left: 20px;
      width: 40px;
      height: 40px;
      background: #133227;
      border: 1px solid rgba(237, 188, 108, 0.4);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #edbc6c;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 99999;
      transition: transform 0.2s, background 0.2s, color 0.2s;
    }
    .tj-cookie-trigger:hover {
      transform: scale(1.1);
      background: #1f4939;
      color: #fff;
    }
    .tj-cookie-trigger svg {
      width: 20px;
      height: 20px;
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

  // Manage iframe loading dynamically based on marketing consent
  function updateExternalMedias(consent) {
    var hasMarketing = consent && consent.marketing;
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
    
    var trigger = document.createElement('button');
    trigger.className = 'tj-cookie-trigger';
    trigger.setAttribute('aria-label', 'Cookie-Einstellungen ändern');
    trigger.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2a10 10 0 0 0-10 10c0 5.523 4.477 10 10 10a9.98 9.98 0 0 0 8-4 .75.75 0 0 0-.43-1.18c-.89-.25-1.57-.93-1.82-1.82a.75.75 0 0 0-1.18-.43 9.98 9.98 0 0 0-4-8z"/>
        <path d="M12 2v10a9.98 9.98 0 0 0 4 8"/>
        <circle cx="7.5" cy="10.5" r=".5" fill="currentColor"/>
        <circle cx="11.5" cy="7.5" r=".5" fill="currentColor"/>
        <circle cx="7.5" cy="15.5" r=".5" fill="currentColor"/>
        <circle cx="15.5" cy="11.5" r=".5" fill="currentColor"/>
        <circle cx="11.5" cy="16.5" r=".5" fill="currentColor"/>
      </svg>
    `;
    
    document.body.appendChild(banner);
    document.body.appendChild(trigger);
    
    if (!consent) {
      setTimeout(function() {
        banner.classList.add('is-visible');
      }, 800);
      updateExternalMedias({ essential: true, marketing: false });
    } else {
      updateExternalMedias(consent);
    }
    
    trigger.addEventListener('click', function() {
      var currentConsent = getConsent() || { essential: true, marketing: false };
      document.getElementById('tj-cookie-opt-marketing').checked = !!currentConsent.marketing;
      banner.classList.toggle('is-visible');
    });
    
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
