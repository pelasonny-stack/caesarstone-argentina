/* ── Admin core: auth, state, save flow, draft autosave ──────────────────── */
(function () {
  'use strict';
  const U = window.adminUtils;
  const { $, deepClone, deepEqual, getAtPath, setAtPath, debounce, toast, modal, confirmModal } = U;

  const CFG = window.ADMIN_CONFIG || {};
  if (!CFG.SITE || !CFG.WORKER_URL || !CFG.SCHEMA_URL) {
    document.body.innerHTML = '<p style="padding:40px">ADMIN_CONFIG inválido. Cargá la página correcta.</p>';
    return;
  }
  const SITE = CFG.SITE;
  const WORKER_URL = CFG.WORKER_URL.replace(/\/$/, '');
  if (WORKER_URL.includes('<') || !/^https?:\/\//.test(WORKER_URL)) {
    document.body.innerHTML = `
      <div style="font-family:system-ui;max-width:560px;margin:80px auto;padding:32px;border:1px solid #e6e4de;border-radius:8px">
        <h1 style="margin-top:0">Worker no configurado</h1>
        <p>La URL del Cloudflare Worker todavía es un placeholder.</p>
        <p>Editá <code>admin-${SITE}-...html</code> y reemplazá <code>${escapeHtml(WORKER_URL)}</code> por la URL real del worker (ej: <code>https://caesarstone-cms.tu-subdomain.workers.dev</code>).</p>
      </div>`;
    return;
  }
  function escapeHtml(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
  const TOKEN_KEY = `cms-token-${SITE}`;
  const DRAFT_KEY = `cms-draft-${SITE}`;

  /* ── State ── */
  const state = {
    token: sessionStorage.getItem(TOKEN_KEY),
    expiresAt: parseInt(sessionStorage.getItem(`${TOKEN_KEY}-exp`) || '0', 10),
    schema: null,
    originalContent: null,
    currentContent: null,
    sha: null,
    pendingUploads: [],   // [{uploadId, file, path}]
    uploadedHashes: {},
    dirtyPaths: new Set(),
  };

  /* ── Mobile gate ── */
  if (matchMedia('(max-width: 1023px)').matches) {
    document.body.dataset.view = 'mobile-gate';
    return;
  }

  /* ── DOM refs ── */
  const refs = {
    loginForm: $('#login-form'),
    loginErr:  $('.login-error'),
    btnLogout: $('#btn-logout'),
    btnSave:   $('#btn-save'),
    btnReload: $('#btn-reload'),
    pwToggle:  $('.pw-toggle'),
    dirtyCount:$('.dirty-count'),
    dirtyN:    $('.dirty-count b'),
    siteName:  $('.topbar-brand'),
    lastEdit:  $('#last-edit-time'),
  };

  refs.siteName.textContent = `${CFG.SITE_NAME || SITE.toUpperCase()} · CMS`;

  /* ── Init ── */
  if (state.token && state.expiresAt > Date.now()) {
    bootEditor().catch(showLogin);
  } else {
    showLogin();
  }

  /* ── Login ── */
  refs.loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    refs.loginErr.hidden = true;
    const fd = new FormData(refs.loginForm);
    try {
      const res = await fetch(`${WORKER_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: fd.get('user'), pass: fd.get('pass') }),
      });
      if (!res.ok) {
        const j = await safeJson(res);
        throw new Error(j?.error?.message || (res.status === 401 ? 'Credenciales inválidas' : `Error ${res.status}`));
      }
      const { token, expiresAt } = await res.json();
      state.token = token;
      state.expiresAt = expiresAt;
      sessionStorage.setItem(TOKEN_KEY, token);
      sessionStorage.setItem(`${TOKEN_KEY}-exp`, String(expiresAt));
      await bootEditor();
    } catch (err) {
      refs.loginErr.textContent = err.message;
      refs.loginErr.hidden = false;
    }
  });

  refs.pwToggle.addEventListener('click', () => {
    const input = refs.loginForm.querySelector('input[name=pass]');
    input.type = input.type === 'password' ? 'text' : 'password';
    refs.pwToggle.textContent = input.type === 'password' ? 'Ver' : 'Ocultar';
  });

  /* ── Logout ── */
  refs.btnLogout.addEventListener('click', () => {
    if (state.dirtyPaths.size && !confirm('Tenés cambios sin guardar. ¿Salir igual?')) return;
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(`${TOKEN_KEY}-exp`);
    sessionStorage.removeItem(DRAFT_KEY);
    state.token = null;
    showLogin();
  });

  /* ── Save ── */
  refs.btnSave.addEventListener('click', () => save());
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
      e.preventDefault();
      save();
    }
  });
  window.addEventListener('beforeunload', (e) => {
    if (state.dirtyPaths.size === 0) return;
    e.preventDefault();
    e.returnValue = '';
  });

  /* ── Reload ── */
  refs.btnReload.addEventListener('click', async () => {
    if (state.dirtyPaths.size && !await confirmModal('Vas a descartar todos los cambios sin guardar. ¿Continuar?')) return;
    sessionStorage.removeItem(DRAFT_KEY);
    await loadContent();
    renderUI();
    state.dirtyPaths.clear();
    state.pendingUploads = [];
    updateDirtyUI();
    toast('info', 'Contenido recargado');
  });

  /* ── boot ── */
  async function bootEditor() {
    document.body.dataset.view = 'editor';
    if (!state.schema) {
      const r = await fetch(CFG.SCHEMA_URL);
      if (!r.ok) throw new Error('No se pudo cargar el schema');
      state.schema = await r.json();
    }
    await loadContent();
    maybeRestoreDraft();
    renderUI();
    updateDirtyUI();
  }

  async function loadContent() {
    const r = await fetchWithAuth(`/api/content?site=${SITE}`);
    if (r.status === 401) { handleSessionExpired(); throw new Error('TOKEN_EXPIRED'); }
    if (!r.ok) throw new Error(`No se pudo cargar el content (${r.status})`);
    const { content, sha } = await r.json();
    state.sha = sha;
    state.originalContent = deepClone(content || {});
    state.currentContent = deepClone(content || {});
  }

  function maybeRestoreDraft() {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return;
    try {
      const draft = JSON.parse(raw);
      if (draft.sha !== state.sha) {
        sessionStorage.removeItem(DRAFT_KEY);
        return;
      }
      // ofrecer restaurar
      setTimeout(async () => {
        const ok = await confirmModal('Tenés cambios sin guardar de tu sesión anterior. ¿Recuperarlos?');
        if (ok) {
          state.currentContent = draft.currentContent;
          state.dirtyPaths = new Set(draft.dirtyPaths || []);
          state.pendingUploads = []; // archivos no se persisten
          renderUI();
          updateDirtyUI();
          toast('info', 'Cambios recuperados (sin imágenes pendientes)');
        } else {
          sessionStorage.removeItem(DRAFT_KEY);
        }
      }, 200);
    } catch { sessionStorage.removeItem(DRAFT_KEY); }
  }

  function renderUI() {
    window.adminRender.init({
      state,
      onChange: () => {
        updateDirtyUI();
        scheduleAutosave();
      },
    });
    window.adminRender.renderEditor(state.schema, state.currentContent);
  }

  function getDiff() {
    const out = [];
    for (const p of state.dirtyPaths) {
      const before = getAtPath(state.originalContent, p);
      const after  = getAtPath(state.currentContent, p);
      if (!deepEqual(before, after)) out.push({ path: p, before, after });
    }
    return out;
  }

  function updateDirtyUI() {
    const n = getDiff().length;
    refs.btnSave.disabled = n === 0 && state.pendingUploads.length === 0;
    refs.btnSave.textContent = (n + state.pendingUploads.length) ? `Guardar cambios (${n + state.pendingUploads.length})` : 'Guardar cambios';
    refs.dirtyCount.hidden = (n + state.pendingUploads.length) === 0;
    refs.dirtyN.textContent = String(n + state.pendingUploads.length);
  }

  const scheduleAutosave = debounce(() => {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify({
      sha: state.sha,
      currentContent: state.currentContent,
      dirtyPaths: [...state.dirtyPaths],
      ts: Date.now(),
    }));
    refs.lastEdit.textContent = 'ahora';
    setTimeout(() => { refs.lastEdit.textContent = 'hace segundos'; }, 60000);
  }, 1000);

  /* ── Save flow (2 fases) ── */
  async function save() {
    const diff = getDiff();
    if (diff.length === 0 && state.pendingUploads.length === 0) return;

    // Modal diff
    const bodyHtml = diff.map(d => `
      <div class="diff-item">
        <div class="diff-path">${escapeHtml(d.path)}</div>
        <div class="diff-before">${escapeHtml(JSON.stringify(d.before))}</div>
        <div class="diff-after">${escapeHtml(JSON.stringify(d.after))}</div>
      </div>
    `).join('') + (state.pendingUploads.length ? `<p><b>${state.pendingUploads.length} imagen(es) pendiente(s) de subir.</b></p>` : '');
    const ok = await modal({
      title: `Guardar ${diff.length} cambios`,
      bodyHtml: bodyHtml || '<p>Sólo subir imágenes pendientes.</p>',
      buttons: [
        { label: 'Cancelar', value: false },
        { label: 'Confirmar', primary: true, value: true },
      ],
    });
    if (!ok) return;

    refs.btnSave.disabled = true;
    refs.btnSave.textContent = 'Guardando…';

    try {
      // Phase 1: upload images
      for (let i = 0; i < state.pendingUploads.length; i++) {
        const u = state.pendingUploads[i];
        refs.btnSave.textContent = `Subiendo ${i + 1}/${state.pendingUploads.length}…`;
        const result = await window.adminUpload.uploadImage({
          workerUrl: WORKER_URL,
          token: state.token,
          site: SITE,
          file: u.file,
          hashCache: state.uploadedHashes,
        });
        replacePlaceholderInContent(`pending:${u.uploadId}`, result.path);
      }
      state.pendingUploads = [];

      // Phase 2: POST content
      refs.btnSave.textContent = 'Guardando contenido…';
      const r = await fetchWithAuth('/api/content', {
        method: 'POST',
        body: JSON.stringify({
          site: SITE,
          content: state.currentContent,
          sha: state.sha,
        }),
      });
      if (r.status === 409) {
        toast('error', 'Conflicto: el contenido cambió en el servidor. Recargá.');
        return;
      }
      if (r.status === 401) { handleSessionExpired(); return; }
      if (!r.ok) {
        const j = await safeJson(r);
        throw new Error(j?.error?.message || `Save falló (${r.status})`);
      }
      const { newSha } = await r.json();
      state.originalContent = deepClone(state.currentContent);
      state.sha = newSha;
      state.dirtyPaths.clear();
      sessionStorage.removeItem(DRAFT_KEY);
      document.querySelectorAll('.is-dirty').forEach(el => el.classList.remove('is-dirty'));
      updateDirtyUI();
      toast('success', 'Guardado. El sitio se actualizará en ~1 min.');
    } catch (err) {
      console.error('save error', err);
      toast('error', err.message || 'Error al guardar');
    } finally {
      updateDirtyUI();
      if (!refs.btnSave.disabled) refs.btnSave.textContent = 'Guardar cambios';
    }
  }

  function replacePlaceholderInContent(placeholder, realPath) {
    const walk = (node) => {
      if (typeof node === 'string') return node === placeholder ? realPath : node;
      if (Array.isArray(node)) return node.map(walk);
      if (node && typeof node === 'object') {
        const out = {};
        for (const k of Object.keys(node)) out[k] = walk(node[k]);
        return out;
      }
      return node;
    };
    state.currentContent = walk(state.currentContent);
  }

  /* ── Auth helpers ── */
  async function fetchWithAuth(endpoint, init = {}) {
    const headers = new Headers(init.headers);
    headers.set('Authorization', `Bearer ${state.token}`);
    if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
    return fetch(`${WORKER_URL}${endpoint}`, { ...init, headers });
  }

  function handleSessionExpired() {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(`${TOKEN_KEY}-exp`);
    state.token = null;
    state.expiresAt = 0;
    document.body.dataset.view = 'login';
    refs.loginErr.textContent = 'Tu sesión expiró — entrá de nuevo. Tus cambios siguen guardados.';
    refs.loginErr.hidden = false;
  }

  function showLogin() {
    document.body.dataset.view = 'login';
  }

  /* ── helpers ── */
  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  async function safeJson(r) { try { return await r.json(); } catch { return null; } }
})();
