/* ─── NexGear Animations — GPU-only, 60fps ──────────────────────
   Only transform + opacity are animated. These run on the GPU
   compositor thread and never trigger layout or paint.
   box-shadow / background / border-color are set instantly (no transition).
──────────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  /* ─ Shared fast easing strings ─ */
  const SPRING  = 'transform 0.2s cubic-bezier(0.34,1.56,0.64,1), opacity 0.15s ease';
  const LIFT    = 'transform 0.22s cubic-bezier(0.34,1.4,0.64,1)';
  const SNAP    = 'transform 0.09s ease';
  const RELEASE = 'transform 0.22s cubic-bezier(0.34,1.56,0.64,1)';

  /* ══════════════════════════════════════════
     1. CATEGORY CARDS  — GPU only
  ══════════════════════════════════════════ */
  function initCategoryHovers() {
    document.querySelectorAll('.category-card').forEach(card => {
      const icon = card.querySelector('.category-icon');
      const name = card.querySelector('.category-name');

      /* Pre-promote to compositor layer */
      card.style.willChange = 'transform';
      if (icon) icon.style.willChange = 'transform';

      card.addEventListener('mouseenter', () => {
        card.style.transition = LIFT;
        card.style.transform  = 'translateY(-8px) scale(1.025)';
        /* Instant non-animated props (no transition cost) */
        card.style.boxShadow   = '0 18px 48px rgba(0,113,227,0.14), 0 4px 12px rgba(0,0,0,0.07)';
        card.style.borderColor = 'rgba(0,113,227,0.2)';

        if (icon) {
          icon.style.transition = SPRING;
          icon.style.transform  = 'scale(1.15) translateY(-3px)';
          icon.style.background = 'rgba(0,113,227,0.11)';
        }
        if (name) name.style.color = 'var(--accent-blue)';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transition  = LIFT;
        card.style.transform   = 'none';
        card.style.boxShadow   = '';
        card.style.borderColor = '';

        if (icon) {
          icon.style.transition = LIFT;
          icon.style.transform  = 'none';
          icon.style.background = '';
        }
        if (name) name.style.color = '';
      });

      card.addEventListener('mousedown', () => {
        card.style.transition = SNAP;
        card.style.transform  = 'translateY(-2px) scale(0.97)';
      });
      card.addEventListener('mouseup', () => {
        card.style.transition = RELEASE;
        card.style.transform  = 'translateY(-8px) scale(1.025)';
      });
    });
  }

  /* ══════════════════════════════════════════
     2. ADD TO CART BUTTONS — GPU only
  ══════════════════════════════════════════ */
  function initCartBtnHovers() {
    document.querySelectorAll('.btn-add-cart').forEach(btn => {
      btn.style.willChange = 'transform';

      btn.addEventListener('mouseenter', () => {
        btn.style.transition = SPRING;
        btn.style.transform  = 'scale(1.1) translateY(-2px)';
        btn.style.boxShadow  = '0 6px 20px rgba(0,113,227,0.35)';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transition = LIFT;
        btn.style.transform  = 'none';
        btn.style.boxShadow  = '';
      });
      btn.addEventListener('mousedown', () => {
        btn.style.transition = SNAP;
        btn.style.transform  = 'scale(0.94)';
        btn.style.boxShadow  = 'none';
      });
      btn.addEventListener('mouseup', () => {
        btn.style.transition = RELEASE;
        btn.style.transform  = 'scale(1.1) translateY(-2px)';
      });
    });
  }

  /* ══════════════════════════════════════════
     3. CHECKOUT / SUBMIT BUTTONS — GPU only
  ══════════════════════════════════════════ */
  function initPrimaryBtnHovers() {
    document.querySelectorAll(
      '.btn-checkout, .btn-place-order, .btn-submit, .login-btn'
    ).forEach(btn => {
      btn.style.willChange = 'transform';

      btn.addEventListener('mouseenter', () => {
        btn.style.transition = SPRING;
        btn.style.transform  = 'translateY(-3px) scale(1.02)';
        btn.style.boxShadow  = '0 10px 32px rgba(0,113,227,0.38)';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transition = LIFT;
        btn.style.transform  = 'none';
        btn.style.boxShadow  = '';
      });
      btn.addEventListener('mousedown', () => {
        btn.style.transition = SNAP;
        btn.style.transform  = 'scale(0.97)';
      });
      btn.addEventListener('mouseup', () => {
        btn.style.transition = RELEASE;
        btn.style.transform  = 'translateY(-3px) scale(1.02)';
      });
    });
  }

  /* ══════════════════════════════════════════
     4. CARD POP ENTRANCE
        Short, fast — class removed immediately
        after so hover works with no fight.
  ══════════════════════════════════════════ */
  function initCardAnims() {
    document.querySelectorAll('.category-card, .product-card').forEach((card, i) => {
      card.classList.add('card-anim');
      card.style.animationDelay = `${Math.min(i * 0.04, 0.24)}s`;
      card.addEventListener('animationend', () => {
        card.classList.remove('card-anim');
        card.style.animationDelay = '';
      }, { once: true });
    });
  }

  /* ══════════════════════════════════════════
     5. RIPPLE CLICK EFFECT — fast & light
  ══════════════════════════════════════════ */
  function createRipple(e) {
    const el   = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.5;
    const r    = document.createElement('span');
    r.className = 'ripple-wave';
    r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px;`;
    el.appendChild(r);
    r.addEventListener('animationend', () => r.remove(), { once: true });
  }

  function attachRipples() {
    const sel =
      'button, .btn-primary, .btn-large, .btn-filled, .btn-outlined, ' +
      '.btn-add-cart, .btn-checkout, .btn-apply, .btn-submit-review, ' +
      '.btn-submit-contact, .btn-helpful, .btn-apply-filter, '         +
      '.page-btn, .tag, .topic-chip, .login-btn, a.btn-primary, '     +
      'a.btn-large, a.btn-checkout, a.btn-outlined, a.btn-filled';

    document.querySelectorAll(sel).forEach(el => {
      if (!el.dataset.rippleReady) {
        el.addEventListener('click', createRipple);
        el.dataset.rippleReady = '1';
      }
    });
  }

  /* ══════════════════════════════════════════
     BOOT
  ══════════════════════════════════════════ */
  function init() {
    initCardAnims();
    initCategoryHovers();
    initCartBtnHovers();
    initPrimaryBtnHovers();
    attachRipples();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
