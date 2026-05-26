    // Bishop Roofing - Inspection Request webhook (GHL Workflow 1)
    const GHL_WEBHOOK_INSPECTION = "https://services.leadconnectorhq.com/hooks/kbdCOzP4FlSTaIm6p6zs/webhook-trigger/625aa52b-4086-4719-a02d-f8d232c4b245";

    function fmtTime() {
      const opts = { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true };
      return new Date().toLocaleString('en-US', opts);
    }

    function escapeHtml(s) {
      if (s == null) return '';
      return String(s).replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
      }[c]));
    }

    // Workflow variants control source tag, intro copy, webhook, and which workflow shown in tour
    const WORKFLOW_VARIANTS = {
      'inspection': {
        source: 'Website — Inspection Form',
        tag: 'inspection-request',
        webhook: 'https://services.leadconnectorhq.com/hooks/kbdCOzP4FlSTaIm6p6zs/webhook-trigger/625aa52b-4086-4719-a02d-f8d232c4b245',
        introTitle: 'Got your inspection request',
        introBody: 'Before we close this — let me walk you through exactly what just happened on our end. When you hit submit, your details didn\'t sit in someone\'s inbox. They flowed through our system in real-time. Click below to see it.',
        introSteps: ['Lands in our CRM', 'Added to our pipeline', 'Team gets pinged'],
        workflowName: 'WF1 · Inspection Request',
      },
      'storm-guide': {
        source: 'Website — Storm Guide Download',
        tag: 'storm-guide-download',
        webhook: 'https://services.leadconnectorhq.com/hooks/kbdCOzP4FlSTaIm6p6zs/webhook-trigger/26da71eb-c814-4b08-86d5-bcafa7c4b5a3',
        introTitle: 'Guide on its way',
        introBody: 'While you wait, here\'s something neat — your download didn\'t just send one email. It kicked off a 3-email nurture sequence we built in GHL. Click below to see exactly what we just queued up for you.',
        introSteps: ['Guide sent immediately', 'Educational email on day 3', 'Soft inspection offer on day 7'],
        workflowName: 'WF3 · Storm Guide Download + 3-Email Nurture',
      },
    };
    let currentVariant = 'inspection';

    async function handleSubmit(e, statusId, successMsg, variant) {
      e.preventDefault();
      const form = e.target;
      const status = document.getElementById(statusId);
      const data = Object.fromEntries(new FormData(form));

      const fullName = (data.name || "").trim();
      const nameParts = fullName.split(/\s+/);
      data.first_name = nameParts[0] || "";
      data.last_name = nameParts.slice(1).join(" ") || "";

      // Use the requested variant or default to inspection
      currentVariant = (variant && WORKFLOW_VARIANTS[variant]) ? variant : 'inspection';
      const cfg = WORKFLOW_VARIANTS[currentVariant];
      data.source = cfg.source;
      data.variant = currentVariant;
      data.tag = cfg.tag;

      // Persist this submission locally so the demo accumulates real data
      saveSubmission(data);

      status.className = 'form-status';
      status.textContent = 'Sending...';
      status.style.display = 'block';

      // Open modal immediately + fire webhook in parallel (if a webhook is configured)
      openDemoModal(data);

      if (!cfg.webhook) {
        // No webhook yet for this variant — show success message anyway (demo mode)
        status.className = 'form-status success';
        status.textContent = '✓ ' + successMsg;
        form.reset();
        return false;
      }

      try {
        const response = await fetch(cfg.webhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error(`Webhook returned status ${response.status}`);
        status.className = 'form-status success';
        status.textContent = '✓ ' + successMsg;
        form.reset();
      } catch (err) {
        console.error('Webhook submission error:', err);
        status.className = 'form-status error';
        status.textContent = 'Something went wrong. Please call us at (512) 487-3204.';
      }
      return false;
    }

    function resetDemoModal() {
      // Reset view state to Contacts
      document.querySelectorAll('.ghl-view').forEach(el => el.style.display = 'none');
      const contactsView = document.querySelector('[data-view-content="contacts"]');
      if (contactsView) contactsView.style.display = 'block';
      document.querySelectorAll('.ghl-menu-item').forEach(el => el.classList.remove('active'));
      document.querySelector('.ghl-menu-item[data-view="contacts"]').classList.add('active');
      // Re-render contacts/opps from localStorage
      renderStoredSubmissions();
      // Reset count pill bumps
      document.getElementById('contactsCount').classList.remove('bumped');
      document.getElementById('oppsCount').classList.remove('bumped');
      // Reset event log
      ['ev1','ev2','ev3','ev4','ev5'].forEach(id => document.getElementById(id).classList.remove('shown'));
      document.getElementById('eventLog').classList.remove('open');
      const ms = document.getElementById('modalStatus');
      ms.classList.remove('complete');
      ms.innerHTML = '<span class="dot"></span> Tour ready';
      // Reset intro
      const intro = document.getElementById('introOverlay');
      intro.classList.remove('fade-out');
      intro.style.display = 'flex';
      // Reset tutorial
      const tour = document.getElementById('tutorialOverlay');
      tour.classList.remove('active');
    }

    // Holds the submitted data for the tutorial
    let tourData = null;
    let currentStep = 0;

    let _pendingOpen = null;
    let _savedScrollY = 0;
    function openDemoModal(data) {
      const modal = document.getElementById('demoModal');
      if (!modal) {
        // Modal HTML not loaded yet — queue for after init
        _pendingOpen = data;
        return;
      }
      resetDemoModal();
      tourData = data;
      currentStep = 0;
      modal.classList.add('open');
      // Lock body scroll while modal is open (preserve scroll position)
      _savedScrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = '-' + _savedScrollY + 'px';
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
      document.dispatchEvent(new CustomEvent('ghlModalOpen'));

      // Personalize intro greeting
      const firstName = (data.first_name || '').trim() || 'friend';
      document.getElementById('introName').textContent = firstName;

      // Apply variant-specific intro copy
      const cfg = WORKFLOW_VARIANTS[currentVariant] || WORKFLOW_VARIANTS.inspection;
      const titleEl = document.querySelector('#introOverlay h2');
      const bodyEl = document.querySelector('#introOverlay p');
      const stepsEl = document.querySelector('#introOverlay .intro-steps');
      if (titleEl) titleEl.innerHTML = cfg.introTitle + ', <span class="accent" id="introName">' + escapeHtml(firstName) + '</span>.';
      if (bodyEl) bodyEl.textContent = cfg.introBody;
      if (stepsEl) {
        stepsEl.innerHTML = cfg.introSteps.map((s, i) =>
          `<span class="intro-step"><span class="intro-step-num">${i+1}</span> ${escapeHtml(s)}</span>` +
          (i < cfg.introSteps.length - 1 ? '<span class="intro-arrow">→</span>' : '')
        ).join('');
      }

      // Switch Automation view to the right workflow for this variant
      switchWorkflow(currentVariant);
    }

    function closeDemoModal() {
      document.getElementById('demoModal').classList.remove('open');
      // Unlock body scroll and restore previous scroll position
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      window.scrollTo(0, _savedScrollY || 0);
      document.dispatchEvent(new CustomEvent('ghlModalClose'));
    }

    function switchWorkflow(wfKey) {
      document.querySelectorAll('.wf-tab').forEach(t => t.classList.toggle('active', t.getAttribute('data-wf') === wfKey));
      document.querySelectorAll('[data-wf-canvas]').forEach(c => {
        c.style.display = (c.getAttribute('data-wf-canvas') === wfKey) ? 'flex' : 'none';
      });
    }

    // ===== Sidebar navigation: switch views =====
    function switchView(viewKey) {
      // Hide all views
      document.querySelectorAll('.ghl-view').forEach(el => el.style.display = 'none');
      // Show the target view
      const target = document.querySelector(`[data-view-content="${viewKey}"]`);
      if (target) target.style.display = 'block';
      // Update sidebar active state
      document.querySelectorAll('.ghl-menu-item').forEach(el => el.classList.remove('active'));
      const menuItem = document.querySelector(`.ghl-menu-item[data-view="${viewKey}"]`);
      if (menuItem) menuItem.classList.add('active');
      // Scroll content to top
      const content = document.querySelector('.ghl-content');
      if (content) content.scrollTop = 0;
    }

    // ============== LOCALSTORAGE PERSISTENCE ==============
    const STORAGE_KEY = 'bishop_demo_submissions';
    const MAX_STORED = 20;

    function loadSubmissions() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch (e) { return []; }
    }

    function saveSubmission(data) {
      const all = loadSubmissions();
      all.push({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || data.zip || '',
        service: data.service || data.storm || 'Inspection request',
        variant: data.variant || 'inspection',
        tag: data.tag || 'inspection-request',
        zip: data.zip || '',
        storm: data.storm || '',
        timestamp: Date.now(),
      });
      // Keep last MAX_STORED
      if (all.length > MAX_STORED) all.splice(0, all.length - MAX_STORED);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(all)); } catch (e) {}
      return all;
    }

    function fmtStored(ts) {
      return new Date(ts).toLocaleString('en-US', {
        month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true
      });
    }

    // ============== RENDER FROM STORAGE ==============
    function renderStoredSubmissions(latestData) {
      const submissions = loadSubmissions();
      const contactsBody = document.getElementById('contactsBody');
      const oppsBody = document.getElementById('col-body-newlead');
      contactsBody.innerHTML = '';
      oppsBody.innerHTML = '';

      if (submissions.length === 0) {
        document.getElementById('contactsEmpty').classList.remove('hidden');
        document.getElementById('oppsEmpty').classList.remove('hidden');
        document.getElementById('contactsCount').textContent = '0 Contacts';
        document.getElementById('oppsCount').textContent = '0 opportunities';
        document.getElementById('col-count-newlead').textContent = '0 Opportunities';
        document.getElementById('col-value-newlead').textContent = '$0.00';
        return;
      }

      document.getElementById('contactsEmpty').classList.add('hidden');
      document.getElementById('oppsEmpty').classList.add('hidden');

      // Newest first
      const sorted = [...submissions].sort((a, b) => b.timestamp - a.timestamp);
      const totalValue = submissions.length * 15000;

      sorted.forEach((sub, i) => {
        const time = fmtStored(sub.timestamp);
        const isLatest = i === 0;

        // Contact row
        const row = document.createElement('tr');
        row.className = 'ghl-row revealed';
        if (isLatest) row.id = 'injectedContactRow';
        row.innerHTML = `
          <td><span class="ghl-table-checkbox"></span></td>
          <td style="font-weight: 600; color: #2563eb;">${escapeHtml(sub.name)}</td>
          <td>${escapeHtml(sub.phone)}</td>
          <td>${escapeHtml(sub.email)}</td>
          <td style="color: #6B7280;">${escapeHtml(sub.address)}</td>
          <td style="color: #6B7280;">${time}</td>
          <td style="color: #6B7280;">${time}</td>
          <td><span class="ghl-tag"${isLatest ? ' id="injectedTag"' : ''}>${escapeHtml(sub.tag || 'inspection-request')}</span></td>
        `;
        contactsBody.appendChild(row);

        // Opp card — matches real GHL layout
        const card = document.createElement('div');
        card.className = 'ghl-opp-card revealed';
        if (isLatest) card.id = 'injectedOppCard';
        const titleText = `${sub.name} - ${sub.service || 'Inspection'}`;
        const displayTitle = titleText.length > 32 ? titleText.substring(0, 32) + '...' : titleText;
        card.innerHTML = `
          <div class="ghl-opp-top">
            <div class="ghl-opp-name" title="${escapeHtml(titleText)}">${escapeHtml(displayTitle)}</div>
            <div class="ghl-opp-avatar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
          </div>
          <div class="ghl-opp-field">
            <span class="ghl-opp-field-label">Source:</span>
            <span class="ghl-opp-field-value">Website &mdash; Inspection Form</span>
          </div>
          <div class="ghl-opp-field">
            <span class="ghl-opp-field-label">Value:</span>
            <span class="ghl-opp-field-value">$15,000.00</span>
          </div>
          <div class="ghl-opp-footer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.33 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <span class="ghl-opp-footer-badge">1</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/></svg>
          </div>
        `;
        oppsBody.appendChild(card);
      });

      // Update counts
      const n = submissions.length;
      document.getElementById('contactsCount').textContent = `${n} Contact${n !== 1 ? 's' : ''}`;
      document.getElementById('oppsCount').textContent = `${n} opportunit${n !== 1 ? 'ies' : 'y'}`;
      document.getElementById('col-count-newlead').textContent = `${n} Opportunit${n !== 1 ? 'ies' : 'y'}`;
      document.getElementById('col-value-newlead').textContent = `$${totalValue.toLocaleString()}.00`;

      // Update Conversations + Dashboard with the same real data
      renderConversations(sorted);
      renderDashboard(sorted);
    }

    // ============== CONVERSATIONS RENDER ==============
    function avatarColor(name) {
      const colors = ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#ec4899','#14b8a6'];
      let hash = 0;
      for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
      return colors[Math.abs(hash) % colors.length];
    }
    function initials(name) {
      const parts = (name || '').trim().split(/\s+/);
      return ((parts[0]?.[0] || '?') + (parts[1]?.[0] || '')).toUpperCase();
    }

    function renderConversations(sortedSubs) {
      const listEl = document.getElementById('convList');
      const msgsEl = document.getElementById('convThreadMessages');
      const headerNameEl = document.getElementById('convThreadName');
      const headerAvatarEl = document.getElementById('convThreadAvatar');
      const detailsEl = document.getElementById('convDetailsBody');
      if (!listEl) return;

      if (!sortedSubs || sortedSubs.length === 0) {
        listEl.innerHTML = '<div style="padding: 40px 20px; text-align: center; color: #9CA3AF; font-size: 12.5px;">No conversations yet</div>';
        msgsEl.innerHTML = '';
        headerNameEl.textContent = 'No conversation selected';
        headerAvatarEl.textContent = '??';
        detailsEl.innerHTML = '<div style="color:#9CA3AF;font-size:12px;text-align:center;padding:20px 0;">Select a conversation to see contact details</div>';
        return;
      }

      // Build the left list — one entry per submission
      listEl.innerHTML = sortedSubs.map((sub, i) => {
        const time = new Date(sub.timestamp);
        const timeStr = time.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        const color = avatarColor(sub.name);
        const isFirst = i === 0;
        return `
          <div class="conv-item${isFirst ? ' active' : ''}" data-conv-idx="${i}">
            <span class="ghl-table-checkbox" style="margin-top: 8px;"></span>
            <div class="conv-avatar" style="background:${color};">
              ${initials(sub.name)}
              <span class="conv-avatar-channel">
                <svg viewBox="0 0 24 24" fill="none" stroke="#3730A3" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="m22 7-10 7L2 7"/></svg>
              </span>
            </div>
            <div>
              <div class="conv-name-row">
                <span class="conv-name">${escapeHtml(sub.email || sub.name)}</span>
              </div>
              <div class="conv-preview">Travis and Cole got your inspection request...</div>
            </div>
            <div class="conv-time">${timeStr}</div>
          </div>
        `;
      }).join('');

      // Wire conv-item clicks
      listEl.querySelectorAll('.conv-item').forEach(el => {
        el.addEventListener('click', () => {
          listEl.querySelectorAll('.conv-item').forEach(x => x.classList.remove('active'));
          el.classList.add('active');
          const idx = parseInt(el.getAttribute('data-conv-idx'));
          renderConversationThread(sortedSubs, idx);
        });
      });

      // Default: open the first/most-recent conversation
      renderConversationThread(sortedSubs, 0);
    }

    function renderConversationThread(sortedSubs, idx) {
      const sub = sortedSubs[idx];
      if (!sub) return;
      const msgsEl = document.getElementById('convThreadMessages');
      const headerNameEl = document.getElementById('convThreadName');
      const headerAvatarEl = document.getElementById('convThreadAvatar');
      const detailsEl = document.getElementById('convDetailsBody');

      headerNameEl.textContent = sub.email || sub.name;
      headerAvatarEl.textContent = initials(sub.name);
      headerAvatarEl.style.background = avatarColor(sub.name);

      const time = new Date(sub.timestamp);
      const timeStr = time.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

      // Build "Lead Alert" messages — one for each contact
      msgsEl.innerHTML = `
        <div class="conv-alert-card">
          <div class="conv-alert-header">
            <span>New Bishop Roofing lead</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
          <div class="conv-alert-body">
            <div class="conv-alert-icon">BP</div>
            <div>
              <div style="font-size: 12.5px; color: #111827; font-weight: 600; margin-bottom: 2px;">Bishop Roofing &mdash; Lead Alert</div>
              <div class="conv-alert-body-text">${escapeHtml(sub.name)} just submitted an inspection request. Respond within 1 hour. <span style="color:#F59E0B;">🚨</span> New ${escapeHtml(sub.service || 'inspection')} from ${escapeHtml(sub.address || 'unknown')}</div>
            </div>
            <div class="conv-alert-meta">
              <span>${timeStr}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13" style="color:#3b82f6;"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13" style="color:#9CA3AF;"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
            </div>
          </div>
        </div>
      `;

      // Contact Details panel
      detailsEl.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 14px;">
          <div class="conv-avatar" style="background:${avatarColor(sub.name)}; width: 32px; height: 32px; font-size: 11px;">${initials(sub.name)}</div>
          <span style="font-size: 12.5px; color: #111827; font-weight: 600; word-break: break-all;">${escapeHtml(sub.email || sub.name)}</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12" style="color:#6B7280;flex-shrink:0;"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;">
          <div>
            <div class="conv-detail-label">Owner</div>
            <div class="conv-detail-value" style="font-size: 11.5px; color: #6B7280;">Unassigned</div>
          </div>
          <div>
            <div class="conv-detail-label">Followers</div>
            <div class="conv-detail-value" style="font-size: 11.5px; color: #6B7280;">&mdash;</div>
          </div>
        </div>

        <div class="conv-detail-field">
          <div class="conv-detail-label">Tags</div>
          <div style="padding: 5px 0;">
            <span class="ghl-tag">inspection-request</span>
          </div>
        </div>

        <div style="display: flex; gap: 4px; padding: 6px 0; border-top: 1px solid #F3F4F6; border-bottom: 1px solid #F3F4F6; margin: 10px 0;">
          <span style="font-size: 11.5px; font-weight: 600; color: #2563eb; padding: 4px 8px; border-bottom: 2px solid #2563eb;">All fields</span>
          <span style="font-size: 11.5px; color: #6B7280; padding: 4px 8px;">DND</span>
          <span style="font-size: 11.5px; color: #6B7280; padding: 4px 8px;">Actions</span>
        </div>

        <div class="conv-detail-section-title" style="margin-top: 8px;">Contact</div>

        <div class="conv-detail-field">
          <div class="conv-detail-label">First name</div>
          <div class="conv-detail-value">${escapeHtml((sub.name || '').split(/\s+/)[0] || '—')}</div>
        </div>
        <div class="conv-detail-field">
          <div class="conv-detail-label">Last name</div>
          <div class="conv-detail-value">${escapeHtml((sub.name || '').split(/\s+/).slice(1).join(' ') || '—')}</div>
        </div>
        <div class="conv-detail-field">
          <div class="conv-detail-label">Email</div>
          <div class="conv-detail-value" style="font-size: 12px;">${escapeHtml(sub.email || '—')}</div>
        </div>
        <div class="conv-detail-field">
          <div class="conv-detail-label">Phone</div>
          <div class="conv-detail-value">${escapeHtml(sub.phone || '—')}</div>
        </div>
        <div class="conv-detail-field">
          <div class="conv-detail-label">Address</div>
          <div class="conv-detail-value" style="font-size: 12px;">${escapeHtml(sub.address || '—')}</div>
        </div>
        <div class="conv-detail-field">
          <div class="conv-detail-label">Service</div>
          <div class="conv-detail-value">${escapeHtml(sub.service || '—')}</div>
        </div>
        <div class="conv-detail-field">
          <div class="conv-detail-label">Contact type</div>
          <div class="conv-detail-value" style="color:#3b82f6;font-weight:600;">Lead</div>
        </div>
      `;
    }

    // ============== DASHBOARD RENDER ==============
    function renderDashboard(sortedSubs) {
      if (!document.getElementById('dashStatusCount')) return;
      const n = sortedSubs ? sortedSubs.length : 0;
      const totalValue = n * 15000;

      // Status donut: count of open (== all submissions, since none won)
      document.getElementById('dashStatusCount').textContent = n;
      document.getElementById('dashOpenCount').textContent = n;

      // Value bar: scale to max $60K
      const pct = Math.min(100, (totalValue / 60000) * 100);
      document.getElementById('dashValueFill').style.width = pct + '%';
      document.getElementById('dashTotalRevenue').textContent = '$' + totalValue.toLocaleString();

      // Funnel
      const stages = [
        { name: 'New Lead', count: n, value: totalValue, active: true },
        { name: 'Inspection Scheduled', count: 0, value: 0 },
        { name: 'Inspection Done', count: 0, value: 0 },
        { name: 'Quote Sent', count: 0, value: 0 },
        { name: 'Job Won', count: 0, value: 0 },
      ];
      const maxN = Math.max(1, ...stages.map(s => s.count));
      document.getElementById('dashFunnel').innerHTML = stages.map((s, i) => {
        const w = s.count > 0 ? Math.max(20, (s.count / maxN) * 100) : 6;
        const pct2 = i === 0 ? '100.00%' : (n > 0 ? (s.count/n*100).toFixed(2) + '%' : '0.00%');
        return `
          <div class="dash-funnel-row">
            <span class="dash-funnel-label">${s.name}<br><span style="font-size:11px;color:#6B7280;font-weight:400;">$${s.value.toLocaleString()}</span></span>
            <div class="dash-funnel-bar ${s.count === 0 ? 'empty' : (s.active ? 'active' : '')}" style="width: ${w}%;">${s.count}</div>
            <span class="dash-funnel-pct">${pct2}<br><span style="font-size:10px;">Cumulative</span></span>
          </div>
        `;
      }).join('');

      // Stage distribution
      const colors = ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#06b6d4'];
      document.getElementById('dashStageDist').innerHTML = stages.map((s, i) => {
        const dollar = '$' + s.value.toLocaleString();
        const pct3 = n > 0 ? (s.count / n * 100).toFixed(2) : '0.00';
        return `
          <div class="dash-stage-row">
            <span class="dash-stage-dot" style="background:${colors[i]};"></span>
            <span class="dash-stage-name"><strong>${s.name}</strong> &middot; ${dollar} (${pct3}%) &mdash; ${s.count}</span>
          </div>
        `;
      }).join('');
    }

    // ============== TUTORIAL DATA HELPERS ==============
    function injectContactRow(data) {
      // No-op now — already rendered from storage on modal open
      // (kept for tutorial step API compatibility)
    }
    function injectOppCard(data) {
      // No-op now — already rendered from storage on modal open
    }

    // ============== TUTORIAL STEPS ==============
    const TUTORIAL_STEPS = [
      {
        view: 'contacts',
        target: '.ghl-menu-item[data-view="contacts"]',
        arrow: 'left',
        title: 'You\'re now inside our CRM',
        body: 'This is GoHighLevel &mdash; the system that runs our entire customer pipeline. When you submitted the form, your data flowed through here in real-time. Let\'s walk through what happened.',
        preAction: () => { /* contacts view, empty */ }
      },
      {
        view: 'contacts',
        target: '#injectedContactRow',
        arrow: 'up',
        title: 'Contact created automatically',
        body: 'Your name, email, phone, and property address are now stored. We can pull this up the second you call back &mdash; no asking you to repeat yourself.',
        preAction: (data) => injectContactRow(data)
      },
      {
        view: 'contacts',
        target: '#injectedTag',
        arrow: 'up',
        title: 'Tagged for routing',
        body: 'Tagged as "inspection-request" so it routes to the right person on our team automatically. We use different tags for storm jobs, repairs, insurance claims, etc.',
      },
      {
        view: 'opportunities',
        target: '#injectedOppCard',
        arrow: 'up',
        title: 'Added to the sales pipeline',
        body: 'Your inspection just dropped into the "New Lead" stage with a $15,000 estimated value. Travis &amp; Cole see this on their dashboard and pick it up.',
        preAction: (data) => injectOppCard(data)
      },
      {
        view: 'conversations',
        target: '#convList .conv-item.active',
        arrow: 'right',
        title: 'Lead alert routed to the team inbox',
        body: 'Your inspection request landed in the Team Inbox as a "Lead Alert" thread. Travis and Cole see it the moment it fires &mdash; with all your details attached on the right.',
      },
      {
        view: 'automation',
        // Function target — resolved at render time so it follows currentVariant
        target: () => `.wf-canvas[data-wf-canvas="${currentVariant}"]`,
        arrow: 'left',
        title: 'This is the workflow that fired',
        body: 'No human had to do anything &mdash; that\'s the point. Submit form &rarr; workflow runs &rarr; you get a response. Both workflows below are live.',
        preAction: () => {
          // Switch to the active variant's workflow
          switchWorkflow(currentVariant);
        }
      },
      {
        view: 'dashboard',
        target: '.dash-row-top',
        arrow: 'up',
        title: 'That\'s the system in action',
        body: 'Your submission shows up live on the dashboard &mdash; Opportunity Status, Total Revenue, Funnel breakdown, all updated in real-time. Every lead goes through this same flow. Want to explore? Click any sidebar item &mdash; the whole CRM is yours to browse.',
      },
    ];

    function positionTooltip(targetEl, arrow) {
      const spotlight = document.getElementById('tutorialSpotlight');
      const tooltip = document.getElementById('tutorialTooltip');
      const modalBody = document.querySelector('.demo-modal-body');

      // Scroll target into view first
      try { targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch(e) {}

      // Wait briefly for scroll, then measure
      setTimeout(() => {
        const tRect = targetEl.getBoundingClientRect();
        const mRect = modalBody.getBoundingClientRect();

        // Position relative to modal-body (absolute)
        const top = tRect.top - mRect.top - 6;
        const left = tRect.left - mRect.left - 6;
        const width = tRect.width + 12;
        const height = tRect.height + 12;

        spotlight.style.top = top + 'px';
        spotlight.style.left = left + 'px';
        spotlight.style.width = width + 'px';
        spotlight.style.height = height + 'px';

        // Position tooltip near the spotlight
        const ttW = 380;
        const ttH = tooltip.offsetHeight || 200;
        let ttTop, ttLeft;

        if (arrow === 'up') {
          ttTop = top + height + 16;
          ttLeft = Math.min(Math.max(left, 20), mRect.width - ttW - 20);
        } else if (arrow === 'down') {
          ttTop = top - ttH - 16;
          ttLeft = Math.min(Math.max(left, 20), mRect.width - ttW - 20);
        } else if (arrow === 'left') {
          ttTop = Math.min(Math.max(top, 20), mRect.height - ttH - 20);
          ttLeft = left + width + 16;
        } else if (arrow === 'right') {
          ttTop = Math.min(Math.max(top, 20), mRect.height - ttH - 20);
          ttLeft = left - ttW - 16;
        }

        // Keep tooltip inside modal-body
        if (ttLeft + ttW > mRect.width - 20) ttLeft = mRect.width - ttW - 20;
        if (ttLeft < 20) ttLeft = 20;
        if (ttTop + ttH > mRect.height - 20) ttTop = mRect.height - ttH - 20;
        if (ttTop < 20) ttTop = 20;

        tooltip.style.top = ttTop + 'px';
        tooltip.style.left = ttLeft + 'px';
        tooltip.setAttribute('data-arrow', arrow);
      }, 250);
    }

    function renderStep(idx) {
      const step = TUTORIAL_STEPS[idx];
      if (!step) return;

      // Run preAction (e.g. inject contact row)
      if (step.preAction) step.preAction(tourData);

      // Switch view if needed
      switchView(step.view);

      // Update tooltip content
      document.getElementById('ttStepLabel').textContent = `Step ${idx + 1} of ${TUTORIAL_STEPS.length}`;
      document.getElementById('ttTitle').textContent = step.title;
      document.getElementById('ttBody').innerHTML = step.body;
      document.getElementById('ttPrev').style.visibility = idx === 0 ? 'hidden' : 'visible';
      document.getElementById('ttNext').innerHTML = (idx === TUTORIAL_STEPS.length - 1) ? 'Done' : 'Next &rarr;';

      // Update progress dots
      const prog = document.getElementById('ttProgress');
      prog.innerHTML = '';
      for (let i = 0; i < TUTORIAL_STEPS.length; i++) {
        const dot = document.createElement('span');
        dot.className = 'tutorial-progress-dot' + (i < idx ? ' done' : (i === idx ? ' active' : ''));
        prog.appendChild(dot);
      }

      // Find the target element and position the spotlight + tooltip
      setTimeout(() => {
        const selector = (typeof step.target === 'function') ? step.target() : step.target;
        const targetEl = document.querySelector(selector);
        if (targetEl) {
          positionTooltip(targetEl, step.arrow);
        }
      }, 100); // small delay to let view switch render
    }

    function startTutorial() {
      currentStep = 0;
      document.getElementById('tutorialOverlay').classList.add('active');
      renderStep(0);
    }

    function endTutorial() {
      document.getElementById('tutorialOverlay').classList.remove('active');
    }

    // ===== EVENT WIRING — called by bootstrap after modal HTML is injected =====
    function initGhlModal() {
      // Intro buttons
      document.getElementById('startTourBtn').addEventListener('click', () => {
        const intro = document.getElementById('introOverlay');
        intro.classList.add('fade-out');
        setTimeout(() => {
          intro.style.display = 'none';
          startTutorial();
        }, 500);
      });
      document.getElementById('skipIntroBtn').addEventListener('click', closeDemoModal);

      // Close handlers
      document.getElementById('modalClose').addEventListener('click', closeDemoModal);
      document.getElementById('demoModal').addEventListener('click', (e) => {
        if (e.target.id === 'demoModal') closeDemoModal();
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeDemoModal();
      });

      // Prevent wheel events outside the GHL content from scrolling the modal.
      // Only allow wheel scrolling when the cursor is over an explicitly scrollable region.
      const SCROLLABLE_SELECTORS = '.ghl-content, .ghl-sidebar, .conv-items, .conv-thread-messages, .conv-details, .ghl-kanban';
      document.getElementById('demoModal').addEventListener('wheel', (e) => {
        const inScrollable = e.target.closest(SCROLLABLE_SELECTORS);
        if (!inScrollable) {
          e.preventDefault();
        }
      }, { passive: false });

      // Same for touch (mobile/trackpad)
      document.getElementById('demoModal').addEventListener('touchmove', (e) => {
        const inScrollable = e.target.closest(SCROLLABLE_SELECTORS);
        if (!inScrollable) {
          e.preventDefault();
        }
      }, { passive: false });

      // Sidebar nav
      document.querySelectorAll('.ghl-menu-item[data-view]').forEach(el => {
        el.addEventListener('click', () => switchView(el.getAttribute('data-view')));
      });

      // Workflow tabs (Automation view)
      document.querySelectorAll('.wf-tab').forEach(tab => {
        tab.addEventListener('click', () => {
          const target = tab.getAttribute('data-wf');
          switchWorkflow(target);
        });
      });

      // Tutorial nav
      document.getElementById('ttNext').addEventListener('click', () => {
        if (currentStep >= TUTORIAL_STEPS.length - 1) {
          endTutorial();
        } else {
          currentStep++;
          renderStep(currentStep);
        }
      });
      document.getElementById('ttPrev').addEventListener('click', () => {
        if (currentStep > 0) {
          currentStep--;
          renderStep(currentStep);
        }
      });
      document.getElementById('ttSkip').addEventListener('click', endTutorial);

      // If a submission happened before modal HTML loaded, open it now
      if (_pendingOpen) {
        const queued = _pendingOpen;
        _pendingOpen = null;
        openDemoModal(queued);
      }
    }

    // Reposition spotlight on window resize (safe to attach at module load)
    window.addEventListener('resize', () => {
      const overlay = document.getElementById('tutorialOverlay');
      if (overlay && overlay.classList.contains('active')) {
        const step = TUTORIAL_STEPS[currentStep];
        const selector = (typeof step.target === 'function') ? step.target() : step.target;
        const targetEl = document.querySelector(selector);
        if (targetEl) positionTooltip(targetEl, step.arrow);
      }
    });