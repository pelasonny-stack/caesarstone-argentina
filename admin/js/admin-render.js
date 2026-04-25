/* ── Admin schema-driven form renderer ────────────────────────────────────── */
(function () {
  'use strict';
  const U = window.adminUtils;
  const { $, $$, getAtPath, setAtPath, deepClone, fmtSize } = U;

  /* state ref del core (set por admin-core.js) */
  let stateRef = null;
  let onChangeCb = null;

  function init({ state, onChange }) {
    stateRef = state;
    onChangeCb = onChange;
  }

  function markDirty(path, el) {
    stateRef.dirtyPaths.add(path);
    if (el) {
      const wrap = el.closest('.field') || el.closest('.array-item') || el;
      wrap.classList.add('is-dirty');
    }
    onChangeCb?.();
  }

  function emptyItemFromSchema(itemSchema) {
    if (!itemSchema) return '';
    if (!Array.isArray(itemSchema) && typeof itemSchema === 'object') {
      // primitivo
      if (itemSchema.type === 'number') return 0;
      if (itemSchema.type === 'boolean') return false;
      return '';
    }
    const out = {};
    itemSchema.forEach(f => {
      if (f.type === 'array') out[f.path] = [];
      else if (f.type === 'number') out[f.path] = 0;
      else if (f.type === 'boolean') out[f.path] = false;
      else out[f.path] = '';
    });
    return out;
  }

  /* ── Renderers por tipo ── */

  function renderText(schema, value, fullPath) {
    const f = document.createElement('label');
    f.className = 'field field-text';
    f.dataset.path = fullPath;
    f.innerHTML = `
      <span class="field-label"></span>
      <input type="text">
      <span class="field-meta"><span class="char-count"></span></span>
    `;
    f.querySelector('.field-label').textContent = schema.label;
    const input = f.querySelector('input');
    input.value = value ?? '';
    if (schema.maxLength) input.maxLength = schema.maxLength;
    if (schema.placeholder) input.placeholder = schema.placeholder;
    const charCount = f.querySelector('.char-count');
    const updateCount = () => {
      if (!schema.maxLength) { charCount.textContent = ''; return; }
      const n = input.value.length;
      charCount.textContent = `${n} / ${schema.maxLength}`;
      charCount.classList.toggle('is-near-limit', n > schema.maxLength * 0.9);
      charCount.classList.toggle('is-over-limit', n > schema.maxLength);
    };
    input.addEventListener('input', () => {
      setAtPath(stateRef.currentContent, fullPath, input.value);
      markDirty(fullPath, f);
      updateCount();
    });
    updateCount();
    return f;
  }

  function renderTextarea(schema, value, fullPath) {
    const f = document.createElement('label');
    f.className = 'field field-textarea';
    f.dataset.path = fullPath;
    f.innerHTML = `
      <span class="field-label"></span>
      <textarea rows="3"></textarea>
      <span class="field-meta"><span class="char-count"></span></span>
    `;
    f.querySelector('.field-label').textContent = schema.label;
    const ta = f.querySelector('textarea');
    ta.value = value ?? '';
    if (schema.maxLength) ta.maxLength = schema.maxLength;
    const charCount = f.querySelector('.char-count');
    const updateCount = () => {
      if (!schema.maxLength) { charCount.textContent = ''; return; }
      const n = ta.value.length;
      charCount.textContent = `${n} / ${schema.maxLength}`;
    };
    const autoResize = () => {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 400) + 'px';
    };
    ta.addEventListener('input', () => {
      setAtPath(stateRef.currentContent, fullPath, ta.value);
      markDirty(fullPath, f);
      updateCount();
      autoResize();
    });
    updateCount();
    setTimeout(autoResize, 0);
    return f;
  }

  /* HTML whitelist: <br>, <strong>, <em> */
  function sanitizeHtml(str) {
    if (typeof str !== 'string') return '';
    const tmp = document.createElement('div');
    tmp.innerHTML = str;
    const allowed = new Set(['BR', 'STRONG', 'EM']);
    const walk = (n) => {
      Array.from(n.childNodes).forEach(c => {
        if (c.nodeType === 1) {
          if (!allowed.has(c.tagName)) {
            const txt = document.createTextNode(c.textContent || '');
            c.replaceWith(txt);
          } else {
            // strip atributos
            Array.from(c.attributes).forEach(a => c.removeAttribute(a.name));
            walk(c);
          }
        }
      });
    };
    walk(tmp);
    return tmp.innerHTML;
  }

  function renderTextHtml(schema, value, fullPath) {
    const f = document.createElement('div');
    f.className = 'field field-text-html';
    f.dataset.path = fullPath;
    f.innerHTML = `
      <span class="field-label"></span>
      <div class="field-html-grid">
        <textarea rows="3"></textarea>
        <div class="preview"></div>
      </div>
      <span class="field-warn" hidden>Tags filtrados — solo &lt;br&gt;, &lt;strong&gt;, &lt;em&gt;.</span>
    `;
    f.querySelector('.field-label').textContent = schema.label;
    const ta = f.querySelector('textarea');
    const prev = f.querySelector('.preview');
    const warn = f.querySelector('.field-warn');
    ta.value = value ?? '';
    const update = () => {
      const sanitized = sanitizeHtml(ta.value);
      warn.hidden = (sanitized === ta.value);
      prev.innerHTML = sanitized;
      setAtPath(stateRef.currentContent, fullPath, sanitized);
    };
    ta.addEventListener('input', () => {
      update();
      markDirty(fullPath, f);
    });
    update();
    return f;
  }

  function renderNumber(schema, value, fullPath) {
    const f = document.createElement('label');
    f.className = 'field field-number';
    f.dataset.path = fullPath;
    f.innerHTML = `
      <span class="field-label"></span>
      <input type="number">
    `;
    f.querySelector('.field-label').textContent = schema.label;
    const input = f.querySelector('input');
    input.value = value ?? '';
    if (schema.min != null) input.min = schema.min;
    if (schema.max != null) input.max = schema.max;
    input.addEventListener('input', () => {
      const v = input.value === '' ? null : Number(input.value);
      setAtPath(stateRef.currentContent, fullPath, v);
      markDirty(fullPath, f);
    });
    return f;
  }

  function renderHref(schema, value, fullPath) {
    const f = document.createElement('label');
    f.className = 'field field-href';
    f.dataset.path = fullPath;
    f.innerHTML = `
      <span class="field-label"></span>
      <input type="text" placeholder="/ruta o https://..." />
      <span class="field-error" hidden></span>
    `;
    f.querySelector('.field-label').textContent = schema.label;
    const input = f.querySelector('input');
    const err = f.querySelector('.field-error');
    input.value = value ?? '';
    const validate = () => {
      const v = input.value.trim();
      if (!v) { err.hidden = true; return true; }
      if (/^(https?:\/\/|mailto:|tel:|\/|#)/.test(v)) { err.hidden = true; return true; }
      err.textContent = 'URL inválida — debe empezar con http(s)://, mailto:, tel:, / o #';
      err.hidden = false;
      return false;
    };
    input.addEventListener('input', () => {
      setAtPath(stateRef.currentContent, fullPath, input.value);
      markDirty(fullPath, f);
      validate();
    });
    return f;
  }

  function renderImage(schema, value, fullPath) {
    const f = document.createElement('div');
    f.className = 'field field-image';
    f.dataset.path = fullPath;
    f.innerHTML = `
      <span class="field-label"></span>
      <div class="image-row">
        <div class="thumb"><img alt="" /></div>
        <div class="image-controls">
          <span class="path-label"></span>
          <div>
            <button type="button" class="btn-secondary btn-change">Cambiar imagen</button>
            <input type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml">
          </div>
          <div class="new-preview" hidden>
            <img alt="" />
            <div class="new-info"></div>
            <div class="new-actions">
              <button type="button" class="btn-ghost btn-cancel">Cancelar</button>
              <button type="button" class="btn-primary btn-apply">Aplicar</button>
            </div>
          </div>
        </div>
      </div>
    `;
    f.querySelector('.field-label').textContent = schema.label;
    const thumb = f.querySelector('.thumb img');
    const pathLabel = f.querySelector('.path-label');
    const fileInput = f.querySelector('input[type=file]');
    const changeBtn = f.querySelector('.btn-change');
    const newPrev = f.querySelector('.new-preview');
    const newImg = newPrev.querySelector('img');
    const newInfo = newPrev.querySelector('.new-info');
    const cancelBtn = newPrev.querySelector('.btn-cancel');
    const applyBtn = newPrev.querySelector('.btn-apply');

    const renderThumb = (src, label) => {
      thumb.src = src || '';
      thumb.alt = label || '';
      pathLabel.textContent = label || '(sin imagen)';
    };
    renderThumb(value || '', value || '');

    changeBtn.addEventListener('click', () => fileInput.click());
    cancelBtn.addEventListener('click', () => {
      fileInput.value = '';
      newPrev.hidden = true;
      if (newImg.src) URL.revokeObjectURL(newImg.src);
    });

    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      if (!file) return;
      const err = window.adminUpload.validateImage(file);
      if (err) { U.toast('error', err); fileInput.value = ''; return; }
      newImg.src = URL.createObjectURL(file);
      newInfo.textContent = `${file.name} · ${fmtSize(file.size)}`;
      newPrev.hidden = false;
    });

    applyBtn.addEventListener('click', () => {
      const file = fileInput.files[0];
      if (!file) return;
      const uploadId = crypto.randomUUID();
      // Marcar valor en content como placeholder pending — se resuelve a path real al guardar
      setAtPath(stateRef.currentContent, fullPath, `pending:${uploadId}`);
      stateRef.pendingUploads.push({ uploadId, file, path: fullPath });
      renderThumb(URL.createObjectURL(file), `(pendiente) ${file.name}`);
      newPrev.hidden = true;
      markDirty(fullPath, f);
    });

    return f;
  }

  function renderArray(schema, value, fullPath) {
    const arr = Array.isArray(value) ? value : [];
    if (!Array.isArray(getAtPath(stateRef.currentContent, fullPath))) {
      setAtPath(stateRef.currentContent, fullPath, arr);
    }

    const f = document.createElement('div');
    f.className = 'field field-array';
    f.dataset.path = fullPath;
    f.innerHTML = `
      <div class="array-head">
        <span class="array-label"></span>
        <span class="array-count"></span>
      </div>
      <div class="array-list"></div>
      <button type="button" class="btn-add-item">+ Agregar</button>
    `;
    const labelEl = f.querySelector('.array-label');
    const countEl = f.querySelector('.array-count');
    const list = f.querySelector('.array-list');
    const addBtn = f.querySelector('.btn-add-item');

    const rebuild = () => {
      list.innerHTML = '';
      const cur = getAtPath(stateRef.currentContent, fullPath) || [];
      labelEl.textContent = schema.label;
      countEl.textContent = `(${cur.length})`;
      cur.forEach((item, i) => {
        list.appendChild(renderArrayItem(schema, item, `${fullPath}[${i}]`, i, cur.length, rebuild));
      });
    };

    addBtn.addEventListener('click', () => {
      const cur = getAtPath(stateRef.currentContent, fullPath) || [];
      if (schema.maxItems && cur.length >= schema.maxItems) {
        U.toast('warn', `Máximo ${schema.maxItems} items`);
        return;
      }
      cur.push(emptyItemFromSchema(schema.itemSchema || []));
      setAtPath(stateRef.currentContent, fullPath, cur);
      markDirty(fullPath, f);
      rebuild();
    });

    rebuild();
    return f;
  }

  function renderArrayItem(parentSchema, item, itemPath, idx, total, rebuild) {
    const el = document.createElement('div');
    el.className = 'array-item';
    el.innerHTML = `
      <div class="array-item-head">
        <span class="array-item-summary"></span>
        <div class="array-item-actions">
          <button type="button" class="btn-up" title="Subir">↑</button>
          <button type="button" class="btn-down" title="Bajar">↓</button>
          <button type="button" class="btn-delete" title="Borrar">🗑</button>
        </div>
      </div>
      <div class="array-item-body"></div>
    `;
    const summaryEl = el.querySelector('.array-item-summary');
    const summaryKey = parentSchema.summary || (parentSchema.itemSchema?.[0]?.path);
    const summary = summaryKey ? (item[summaryKey] || '(sin título)') : `Item ${idx + 1}`;
    summaryEl.textContent = `${parentSchema.itemLabel || 'Item'} ${idx + 1} — ${String(summary).slice(0, 60)}`;

    const head = el.querySelector('.array-item-head');
    head.addEventListener('click', (e) => {
      if (e.target.closest('.array-item-actions')) return;
      el.classList.toggle('is-expanded');
    });

    const body = el.querySelector('.array-item-body');
    if (Array.isArray(parentSchema.itemSchema)) {
      // Item es un objeto con sub-fields
      parentSchema.itemSchema.forEach(f => {
        const subPath = `${itemPath}.${f.path}`;
        body.appendChild(renderField(f, getAtPath(stateRef.currentContent, subPath), subPath));
      });
    } else if (parentSchema.itemSchema && typeof parentSchema.itemSchema === 'object') {
      // Item es un primitivo (string/number) — el path del field ES el itemPath
      body.appendChild(renderField(parentSchema.itemSchema, getAtPath(stateRef.currentContent, itemPath), itemPath));
    }

    const upBtn = el.querySelector('.btn-up');
    const downBtn = el.querySelector('.btn-down');
    const delBtn = el.querySelector('.btn-delete');
    upBtn.disabled = idx === 0;
    downBtn.disabled = idx === total - 1;

    const parentPath = itemPath.replace(/\[\d+\]$/, '');
    const arr = getAtPath(stateRef.currentContent, parentPath);

    upBtn.addEventListener('click', () => {
      [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
      markDirty(parentPath, el);
      rebuild();
    });
    downBtn.addEventListener('click', () => {
      [arr[idx + 1], arr[idx]] = [arr[idx], arr[idx + 1]];
      markDirty(parentPath, el);
      rebuild();
    });
    delBtn.addEventListener('click', async () => {
      if (parentSchema.minItems && arr.length <= parentSchema.minItems) {
        U.toast('warn', `Mínimo ${parentSchema.minItems} items`);
        return;
      }
      const msg = parentSchema.warnOnDelete || `¿Borrar item ${idx + 1}?`;
      const ok = await U.confirmModal(msg);
      if (!ok) return;
      arr.splice(idx, 1);
      markDirty(parentPath, el);
      rebuild();
    });

    return el;
  }

  /* ── Dispatcher ── */
  const RENDERERS = {
    'text':           renderText,
    'text-multiline': renderTextarea,
    'text-html':      renderTextHtml,
    'number':         renderNumber,
    'imageSrc':       renderImage,
    'href':           renderHref,
    'array':          renderArray,
  };

  function renderField(fieldSchema, value, fullPath) {
    const fn = RENDERERS[fieldSchema.type];
    if (!fn) {
      const div = document.createElement('div');
      div.className = 'field';
      div.textContent = `[unsupported type: ${fieldSchema.type}]`;
      return div;
    }
    return fn(fieldSchema, value, fullPath);
  }

  function renderSection(sectionSchema, content) {
    const sec = document.createElement('section');
    sec.id = `sec-${sectionSchema.id}`;
    sec.className = 'editor-section';
    sec.innerHTML = `
      <header class="editor-section-head">
        <h2></h2>
        <button class="collapse-toggle" aria-expanded="true">−</button>
      </header>
      <div class="editor-section-body"></div>
    `;
    sec.querySelector('h2').textContent = sectionSchema.label;
    const head = sec.querySelector('.editor-section-head');
    const toggle = sec.querySelector('.collapse-toggle');
    head.addEventListener('click', () => {
      sec.classList.toggle('is-collapsed');
      toggle.textContent = sec.classList.contains('is-collapsed') ? '+' : '−';
      toggle.setAttribute('aria-expanded', String(!sec.classList.contains('is-collapsed')));
    });
    const body = sec.querySelector('.editor-section-body');
    (sectionSchema.fields || []).forEach(f => {
      body.appendChild(renderField(f, getAtPath(content, f.path), f.path));
    });
    return sec;
  }

  function renderEditor(schema, content) {
    const main = document.getElementById('editor-main');
    const nav = document.getElementById('section-nav');
    main.innerHTML = '';
    nav.innerHTML = '';
    (schema.sections || []).forEach((s, i) => {
      const sec = renderSection(s, content);
      main.appendChild(sec);
      const a = document.createElement('a');
      a.href = `#sec-${s.id}`;
      a.className = 'sidebar-link' + (i === 0 ? ' is-active' : '');
      a.textContent = s.label;
      nav.appendChild(a);
    });
    initScrollSpy();
  }

  function initScrollSpy() {
    const main = document.getElementById('editor-main');
    const links = $$('.sidebar-link');
    if (!links.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        links.forEach(l => l.classList.remove('is-active'));
        const id = e.target.id;
        const a = document.querySelector(`.sidebar-link[href="#${id}"]`);
        a?.classList.add('is-active');
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    $$('.editor-section', main).forEach(s => io.observe(s));
  }

  window.adminRender = { init, renderEditor, sanitizeHtml };
})();
