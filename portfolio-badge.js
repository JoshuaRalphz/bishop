/* ==========================================================
   Portfolio-demo floating badge
   Loaded on every Bishop page. Tells visitors this is a
   portfolio demo and nudges them to submit a form.
   ========================================================== */
(function () {
  // CSS injected once
  const css = `
    .pf-badge {
      position: fixed;
      bottom: 22px;
      right: 22px;
      z-index: 90;
      background: #16264A;
      color: #fff;
      border-radius: 999px;
      padding: 14px 20px 14px 16px;
      box-shadow: 0 10px 30px rgba(13, 26, 48, 0.35), 0 0 0 1px rgba(255,255,255,0.05);
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      font-family: 'Inter', -apple-system, sans-serif;
      font-size: 14px;
      font-weight: 600;
      letter-spacing: -0.005em;
      transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
      animation: pfBadgePulse 2.4s ease-in-out 1.6s infinite;
      max-width: calc(100vw - 44px);
    }
    .pf-badge:hover {
      transform: translateY(-2px);
      background: #0D1A30;
      box-shadow: 0 14px 40px rgba(13, 26, 48, 0.45), 0 0 0 1px rgba(255,255,255,0.08);
      animation: none;
    }
    .pf-badge-icon {
      width: 30px; height: 30px;
      border-radius: 50%;
      background: #B33A2E;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      position: relative;
    }
    .pf-badge-icon svg {
      width: 16px; height: 16px;
      color: #fff;
    }
    .pf-badge-icon::after {
      content: '';
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      border: 2px solid #B33A2E;
      opacity: 0;
      animation: pfBadgeRing 2.4s ease-out infinite;
    }
    .pf-badge-text {
      display: flex;
      flex-direction: column;
      line-height: 1.2;
    }
    .pf-badge-eyebrow {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: rgba(255, 255, 255, 0.55);
      margin-bottom: 2px;
    }
    .pf-badge-main { color: #fff; }
    .pf-badge-arrow { margin-left: 4px; font-weight: 400; }

    @keyframes pfBadgePulse {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-3px); }
    }
    @keyframes pfBadgeRing {
      0% { opacity: 0.45; transform: scale(1); }
      80% { opacity: 0; transform: scale(1.6); }
      100% { opacity: 0; transform: scale(1.6); }
    }

    .pf-tip {
      position: fixed;
      bottom: 80px;
      right: 22px;
      z-index: 89;
      background: #fff;
      color: #14171F;
      border-radius: 12px;
      padding: 16px 18px 14px;
      width: 300px;
      box-shadow: 0 12px 40px rgba(13, 26, 48, 0.25), 0 0 0 1px rgba(13, 26, 48, 0.06);
      font-family: 'Inter', -apple-system, sans-serif;
      font-size: 13px;
      line-height: 1.5;
      display: none;
      animation: pfTipIn 0.25s ease;
    }
    .pf-tip.open { display: block; }
    .pf-tip::after {
      content: '';
      position: absolute;
      bottom: -7px;
      right: 30px;
      width: 14px; height: 14px;
      background: #fff;
      transform: rotate(45deg);
      box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.05);
    }
    .pf-tip-title {
      font-size: 14px;
      font-weight: 800;
      color: #16264A;
      margin-bottom: 6px;
    }
    .pf-tip-body { color: #4B5563; margin-bottom: 12px; }
    .pf-tip-cta {
      background: #B33A2E;
      color: #fff;
      border: none;
      padding: 9px 14px;
      border-radius: 7px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      width: 100%;
      font-family: inherit;
      transition: background 0.15s;
    }
    .pf-tip-cta:hover { background: #962B22; }
    .pf-tip-close {
      position: absolute;
      top: 8px; right: 8px;
      width: 22px; height: 22px;
      border-radius: 50%;
      background: transparent;
      border: none;
      cursor: pointer;
      color: #6B7280;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      line-height: 1;
    }
    .pf-tip-close:hover { background: #F3F4F6; color: #111827; }

    @keyframes pfTipIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 720px) {
      .pf-badge { bottom: 14px; right: 14px; padding: 10px 14px 10px 12px; font-size: 12.5px; }
      .pf-badge-icon { width: 26px; height: 26px; }
      .pf-badge-icon svg { width: 13px; height: 13px; }
      .pf-tip { right: 14px; bottom: 64px; width: calc(100vw - 28px); }
    }
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // Page-aware label/action
  const hasFormOnPage = !!document.querySelector('form#contactForm, form#guideForm');
  const label = hasFormOnPage
    ? 'Submit any form to see it fire'
    : 'See it fire — try the demo';

  // Build the badge
  const badge = document.createElement('div');
  badge.className = 'pf-badge';
  badge.setAttribute('role', 'button');
  badge.setAttribute('aria-label', 'Portfolio demo by Joshua Solomon');
  badge.innerHTML = `
    <span class="pf-badge-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="14.7 6.3 1 20 4 23 17.7 9.3"/>
        <path d="M19 1l1.4 1.4L19 4l1.4 1.4L19 7l-1.4-1.4L16.2 7l-1.4-1.4L16.2 4l-1.4-1.4L16.2 1l1.4 1.4L19 1z"/>
        <path d="M5 13l1.5 1.5L5 16 3.5 14.5 5 13z"/>
      </svg>
    </span>
    <span class="pf-badge-text">
      <span class="pf-badge-eyebrow">Portfolio demo</span>
      <span class="pf-badge-main">${label} <span class="pf-badge-arrow">→</span></span>
    </span>
  `;
  document.body.appendChild(badge);

  // Build the expanded tip popover
  const tip = document.createElement('div');
  tip.className = 'pf-tip';
  tip.innerHTML = `
    <button class="pf-tip-close" aria-label="Close">×</button>
    <div class="pf-tip-title">This is a portfolio demo.</div>
    <div class="pf-tip-body">
      Bishop Roofing isn't real — it's a working demo built by <strong>Joshua Solomon</strong>
      (CRM &amp; Automation Specialist). Submit any form on the site to see the live
      GoHighLevel workflow fire in real-time with a guided 7-step backend tour.
    </div>
    <button class="pf-tip-cta">${hasFormOnPage ? 'Take me to the form →' : 'Open the contact form →'}</button>
  `;
  document.body.appendChild(tip);

  const closeBtn = tip.querySelector('.pf-tip-close');
  const ctaBtn = tip.querySelector('.pf-tip-cta');

  function findFirstForm() {
    return document.querySelector('form#guideForm') || document.querySelector('form#contactForm');
  }

  function scrollToForm() {
    const form = findFirstForm();
    if (form) {
      form.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Quick highlight pulse on the form
      const firstInput = form.querySelector('input, select, textarea');
      if (firstInput) setTimeout(() => firstInput.focus({ preventScroll: true }), 700);
    } else {
      window.location.href = './contact.html#inspection-form';
    }
  }

  badge.addEventListener('click', (e) => {
    e.stopPropagation();
    tip.classList.toggle('open');
  });

  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    tip.classList.remove('open');
  });

  ctaBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    tip.classList.remove('open');
    scrollToForm();
  });

  // Click outside closes the tip
  document.addEventListener('click', (e) => {
    if (!tip.contains(e.target) && !badge.contains(e.target)) {
      tip.classList.remove('open');
    }
  });

  // Hide badge when demo modal opens; show again when it closes.
  // Listens to custom events fired by ghl-modal.js — much cheaper than a MutationObserver.
  document.addEventListener('ghlModalOpen', () => {
    badge.style.display = 'none';
    tip.classList.remove('open');
  });
  document.addEventListener('ghlModalClose', () => {
    badge.style.display = 'flex';
  });
})();
