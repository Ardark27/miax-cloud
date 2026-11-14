/* Motor de la presentación: lee content/*.md y los muestra como diapositivas o guía. */
(() => {
  'use strict';

  // --- Almacenamiento local (puede fallar en ventanas privadas) -------------
  const PREFIX = 'miax-aws:';
  const store = {
    get(key, fallback) {
      try {
        const value = localStorage.getItem(PREFIX + key);
        return value === null ? fallback : value;
      } catch (e) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(PREFIX + key, value); } catch (e) { /* sin persistencia */ }
    },
  };

  // --- Regiones y enlaces a la consola --------------------------------------
  const REGIONS = [
    ['eu-west-3', 'Europa (París)'],
    ['eu-west-1', 'Europa (Irlanda)'],
    ['eu-central-1', 'Europa (Fráncfort)'],
    ['eu-south-2', 'Europa (España)'],
    ['eu-north-1', 'Europa (Stockholm)'],
    ['us-east-1', 'EE. UU. (Virginia)'],

  ];
  const regional = (path) => (r) => `https://${r}.console.aws.amazon.com/${path.replaceAll('{r}', r)}`;
  const global = (path) => () => `https://console.aws.amazon.com/${path}`;

  const AWS_LINKS = {
    home: regional('console/home?region={r}'),
    signup: () => 'https://signin.aws.amazon.com/signup?request_type=register',
    mfa: global('iam/home#/security_credentials'),
    billing: global('billing/home#/'),
    budgets: global('billing/home#/budgets/overview'),
    freetier: global('billing/home#/freetier'),
    iam: global('iam/home#/home'),
    'iam-users': global('iam/home#/users'),
    'iam-groups': global('iam/home#/groups'),
    'iam-roles': global('iam/home#/roles'),
    'iam-policies': global('iam/home#/policies'),
    'iam-idp': global('iam/home#/identity_providers'),
    ec2: regional('ec2/home?region={r}#Home:'),
    'ec2-launch': regional('ec2/home?region={r}#LaunchInstances:'),
    'ec2-instances': regional('ec2/home?region={r}#Instances:'),
    'ec2-keys': regional('ec2/home?region={r}#KeyPairs:'),
    'ec2-sg': regional('ec2/home?region={r}#SecurityGroups:'),
    'ec2-eip': regional('ec2/home?region={r}#Addresses:'),
    'ec2-ami': regional('ec2/home?region={r}#Images:'),
    'ec2-lb': regional('ec2/home?region={r}#LoadBalancers:'),
    'ec2-volumes': regional('ec2/home?region={r}#Volumes:'),
    vpc: regional('vpcconsole/home?region={r}#vpcs:'),
    cloudshell: regional('cloudshell/home?region={r}'),
    'cw-alarms': regional('cloudwatch/home?region={r}#alarmsV2:'),
    'cw-logs': regional('cloudwatch/home?region={r}#logsV2:log-groups'),
    s3: regional('s3/buckets?region={r}'),
    's3-create': regional('s3/bucket/create?region={r}'),
    lambda: regional('lambda/home?region={r}#/functions'),
    'lambda-create': regional('lambda/home?region={r}#/create/function'),
    'lambda-layers': regional('lambda/home?region={r}#/layers'),
    scheduler: regional('scheduler/home?region={r}#schedules'),
    apigw: regional('apigateway/main/apis?region={r}'),
    ecr: regional('ecr/private-registry/repositories?region={r}'),
    ecs: regional('ecs/v2/clusters?region={r}'),
    dynamodb: regional('dynamodbv2/home?region={r}#tables'),
    'dynamodb-create': regional('dynamodbv2/home?region={r}#create-table'),
    athena: regional('athena/home?region={r}#/query-editor'),
    textract: regional('textract/home?region={r}#/demo'),
    rds: regional('rds/home?region={r}#databases:'),
  };

  // --- Estado ---------------------------------------------------------------
  const params = new URLSearchParams(location.search);
  const isFloat = params.has('lateral');
  const isNarrow = () => window.matchMedia('(max-width: 760px)').matches;

  const settings = {
    region: store.get('region', 'eu-west-3'),
    account: store.get('account', ''),
    alias: store.get('alias', ''),
  };
  if (!REGIONS.some(([id]) => id === settings.region)) settings.region = 'eu-west-3';

  const state = {
    course: null,
    lessons: [],
    cache: new Map(),
    lesson: null,
    slides: [],
    index: 0,
    mode: store.get('mode', isNarrow() ? 'guide' : 'slides'),
  };

  const $ = (id) => document.getElementById(id);
  const main = $('main');
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

  // --- Markdown -------------------------------------------------------------
  hljs.registerLanguage('hcl', () => ({
    name: 'HCL',
    aliases: ['terraform', 'tf'],
    contains: [
      hljs.HASH_COMMENT_MODE,
      hljs.C_LINE_COMMENT_MODE,
      hljs.QUOTE_STRING_MODE,
      hljs.NUMBER_MODE,
      { className: 'keyword', begin: /\b(resource|provider|terraform|variable|output|data|locals|module|required_providers|backend)\b/ },
      { className: 'literal', begin: /\b(true|false|null)\b/ },
      { className: 'attr', begin: /\b[a-z_][a-z0-9_]*(?=\s*=)/ },
    ],
  }));

  marked.use({
    gfm: true,
    renderer: {
      link({ href, title, tokens }) {
        const text = this.parser.parseInline(tokens);
        const titleAttr = title ? ` title="${esc(title)}"` : '';
        if (href.startsWith('aws:')) {
          const make = AWS_LINKS[href.slice(4)];
          if (!make) return `<strong class="error-link">[enlace desconocido: ${esc(href)}]</strong>`;
          // Sin noopener: el nombre de ventana compartido hace que AWS se reutilice en una sola pestaña.
          return `<a class="aws" href="${esc(make(settings.region))}" target="aws-console"${titleAttr}>${text}</a>`;
        }
        if (/^https?:/.test(href)) {
          return `<a class="ext" href="${esc(href)}" target="_blank" rel="noopener"${titleAttr}>${text}</a>`;
        }
        return `<a href="${esc(href)}"${titleAttr}>${text}</a>`;
      },
      code({ text, lang }) {
        const language = (lang || '').split(/\s+/)[0];
        const body = language && hljs.getLanguage(language)
          ? hljs.highlight(text, { language, ignoreIllegals: true }).value
          : esc(text);
        return `<div class="code"><button class="copy" type="button">Copiar</button><pre tabindex="0"><code>${body}</code></pre></div>`;
      },
      table(token) {
        // Delegamos en el renderizador por defecto y añadimos scroll horizontal.
        const html = marked.Renderer.prototype.table.call(this, token);
        return `<div class="table-wrap">${html}</div>`;
      },
    },
  });

  const BOX_LABELS = {
    demo: 'Demo en la consola',
    ejercicio: 'Ejercicio',
    aviso: 'Atención',
    novedad: 'Actualizado',
    limpieza: 'Limpieza para no pagar',
    nota: 'Nota',
  };

  function renderFlow(lines) {
    const nodes = lines.join(' ').split('->').map((part) => part.trim()).filter(Boolean).map((part) => {
      const [name, sub] = part.split('::').map((s) => s.trim());
      return `<div class="node">${esc(name)}${sub ? `<small>${esc(sub)}</small>` : ''}</div>`;
    });
    return `<div class="flow">${nodes.join('<span class="arrow" aria-hidden="true">→</span>')}</div>`;
  }

  /** Divide un .md en diapositivas y traduce los bloques `::: tipo Título`. */
  function parseSlides(source) {
    const slides = [];
    let out = [];
    let fence = null;
    let box = null;
    let flow = null;

    const flush = () => {
      const md = out.join('\n').trim();
      if (md) slides.push(md);
      out = [];
    };

    for (const line of source.replace(/\r\n/g, '\n').split('\n')) {
      const marker = line.match(/^\s*(`{3,}|~{3,})/);
      if (fence) {
        if (marker && marker[1].startsWith(fence)) fence = null;
        out.push(line);
        continue;
      }
      if (flow) {
        if (line.trim() === ':::') { out.push('', renderFlow(flow), ''); flow = null; } else flow.push(line);
        continue;
      }
      if (marker) { fence = marker[1]; out.push(line); continue; }

      if (line.trim() === '---') { flush(); continue; }

      const open = line.match(/^:::\s*([a-z]+)\s*(.*)$/);
      if (open && open[1] === 'flow') { flow = []; continue; }
      if (open && BOX_LABELS[open[1]]) {
        box = open[1];
        const title = open[2].trim();
        out.push('', `<section class="box box-${box}" data-box><span class="box-title">${BOX_LABELS[box]}${title ? `<b>${esc(title)}</b>` : ''}</span>`, '');
        continue;
      }
      if (box && line.trim() === ':::') { out.push('', '</section>', ''); box = null; continue; }
      out.push(line);
    }
    flush();
    return slides;
  }

  function substitute(md) {
    return md
      .replaceAll('{{region}}', settings.region)
      .replaceAll('{{account}}', settings.account || '123456789012')
      .replaceAll('{{alias}}', settings.alias || 'tu-alias');
  }

  function slideTitle(md, i) {
    const m = md.match(/^#{1,3}\s+(.+)$/m);
    return m ? m[1].replace(/[`*_]/g, '') : `Diapositiva ${i + 1}`;
  }

  // Convierte las listas de demos y ejercicios en pasos marcables.
  function decorate(root, lessonId, slideIndex) {
    root.querySelectorAll('[data-box]').forEach((box, boxIndex) => {
      const lists = box.querySelectorAll(':scope > ol, :scope > ul');
      if (!/box-(demo|ejercicio|limpieza)/.test(box.className)) return;
      lists.forEach((list, listIndex) => {
        [...list.children].forEach((li, liIndex) => {
          const key = `step:${lessonId}:${slideIndex}:${boxIndex}:${listIndex}:${liIndex}`;
          const body = document.createElement('div');
          body.className = 'step-body';
          while (li.firstChild) body.appendChild(li.firstChild);
          const input = document.createElement('input');
          input.type = 'checkbox';
          input.setAttribute('aria-label', 'Marcar paso como hecho');
          input.checked = store.get(key, '') === '1';
          li.classList.add('step');
          li.classList.toggle('done', input.checked);
          input.addEventListener('change', () => {
            store.set(key, input.checked ? '1' : '');
            li.classList.toggle('done', input.checked);
          });
          li.append(input, body);
        });
      });
    });
  }

  function renderSlideHtml(md) {
    return marked.parse(substitute(md));
  }

  // --- Vistas ---------------------------------------------------------------
  function seen(lessonId) { return Number(store.get(`seen:${lessonId}`, '0')); }

  function renderHome() {
    state.lesson = null;
    document.title = 'Cloud con AWS · MIAX';
    $('crumb').textContent = '';
    $('pager').hidden = true;
    document.body.classList.remove('mode-guide');
    const modules = state.course.modules.map((mod, i) => `
      <section class="module">
        <div class="num">${String(i).padStart(2, '0')}</div>
        <div><h2>${esc(mod.title)}</h2><p>${esc(mod.summary)}</p></div>
        <ul>${mod.lessons.map((l) => {
          const n = seen(l.id);
          const total = store.get(`total:${l.id}`, '');
          const done = total && n >= Number(total);
          const prog = n ? `<span class="prog${done ? ' done' : ''}">${done ? 'visto' : `${n}/${total}`}</span>` : '';
          return `<li><a href="#/${l.id}/1"><span>${esc(l.title)}</span>${prog}</a></li>`;
        }).join('')}</ul>
      </section>`).join('');
    main.innerHTML = `
      <div class="home">
        <h1>Cloud con AWS</h1>
        <p class="lead">${esc(state.course.lead)}</p>
        <div class="how">
          <div><h3>Pulsa los botones <span class="tag">naranjas</span></h3><p>Te llevan a la pantalla exacta de la consola de AWS, siempre en la misma pestaña.</p></div>
          <div><h3>Pon tus datos una vez</h3><p>Con tu región, cuenta y alias, los enlaces y los comandos salen listos para copiar.</p></div>
          <div><h3>Sigue los pasos al lado</h3><p>«Ventana lateral» deja los pasos visibles junto a AWS y sincronizados con la clase.</p></div>
        </div>
        ${modules}
      </div>`;
    window.scrollTo(0, 0);
  }

  async function loadLesson(lesson) {
    if (!state.cache.has(lesson.id)) {
      const res = await fetch(`content/${lesson.id}.md`, { cache: 'no-cache' });
      if (!res.ok) throw new Error(`No se pudo cargar ${lesson.id}.md (${res.status})`);
      state.cache.set(lesson.id, parseSlides(await res.text()));
    }
    return state.cache.get(lesson.id);
  }

  function neighbours() {
    const i = state.lessons.findIndex((l) => l.id === state.lesson.id);
    return { prev: state.lessons[i - 1], next: state.lessons[i + 1] };
  }

  function renderLesson() {
    const { lesson, slides, index } = state;
    const guide = state.mode === 'guide';
    document.body.classList.toggle('mode-guide', guide);
    document.title = `${lesson.title} · Cloud con AWS`;
    $('crumb').textContent = `${lesson.module} / ${lesson.title}`;
    $('btn-mode').textContent = guide ? 'Diapositivas' : 'Guía';

    const article = (md, i) => {
      const cover = i === 0 && md.split('\n').filter((l) => l.trim()).length <= 3 ? ' cover' : '';
      return `<article class="slide${cover}" id="s${i + 1}" data-index="${i}">${renderSlideHtml(md)}</article>`;
    };
    const { next } = neighbours();
    const endLink = next
      ? `<a class="tool primary" href="#/${next.id}/1">Siguiente: ${esc(next.title)} →</a>`
      : '<a class="tool primary" href="#/">Volver al índice</a>';

    main.innerHTML = `<div class="deck">${
      guide
        ? `${slides.map(article).join('')}<div class="lesson-end"><a class="tool" href="#/">Índice</a>${endLink}</div>`
        : `${article(slides[index], index)}${index === slides.length - 1 ? `<div class="lesson-end"><a class="tool" href="#/">Índice</a>${endLink}</div>` : ''}`
    }</div>`;

    main.querySelectorAll('.slide').forEach((el) => decorate(el, lesson.id, Number(el.dataset.index)));

    const pager = $('pager');
    pager.hidden = false;
    const select = $('slide-index');
    select.innerHTML = slides.map((md, i) => `<option value="${i}">${i + 1}/${slides.length} · ${esc(slideTitle(md, i))}</option>`).join('');
    select.value = String(index);
    $('bar-fill').style.width = `${((index + 1) / slides.length) * 100}%`;
    $('btn-prev').disabled = index === 0 && !neighbours().prev;

    store.set(`total:${lesson.id}`, String(slides.length));
    if (index + 1 > seen(lesson.id)) store.set(`seen:${lesson.id}`, String(index + 1));

    if (guide) {
      const target = $(`s${index + 1}`);
      if (target && index > 0) target.scrollIntoView();
      else window.scrollTo(0, 0);
    } else {
      window.scrollTo(0, 0);
    }
  }

  function renderError(message) {
    $('pager').hidden = true;
    main.innerHTML = `<div class="error"><h1>No se ha podido abrir</h1><p>${esc(message)}</p><p><a href="#/">Volver al índice</a></p></div>`;
  }

  // --- Navegación -----------------------------------------------------------
  const channel = 'BroadcastChannel' in window ? new BroadcastChannel('miax-aws-nav') : null;

  async function route() {
    const [, id, n] = location.hash.match(/^#\/([^/]*)\/?(\d*)/) || [];
    if (channel) channel.postMessage({ hash: location.hash });
    if (!id) { renderHome(); return; }
    const lesson = state.lessons.find((l) => l.id === id);
    if (!lesson) { renderError(`No existe la lección «${id}».`); return; }
    try {
      state.slides = await loadLesson(lesson);
      state.lesson = lesson;
      state.index = Math.min(Math.max(Number(n || 1) - 1, 0), state.slides.length - 1);
      renderLesson();
    } catch (err) {
      renderError(err.message);
    }
  }

  function go(lessonId, n) { location.hash = `#/${lessonId}/${n}`; }

  function step(delta) {
    if (!state.lesson) return;
    const target = state.index + delta;
    if (target >= 0 && target < state.slides.length) { go(state.lesson.id, target + 1); return; }
    const { prev, next } = neighbours();
    if (target < 0 && prev) go(prev.id, 1);
    if (target >= state.slides.length && next) go(next.id, 1);
  }

  function toggleMode() {
    state.mode = state.mode === 'guide' ? 'slides' : 'guide';
    store.set('mode', state.mode);
    if (state.lesson) renderLesson();
  }

  function openFloat() {
    const width = 480;
    const height = Math.min(screen.availHeight - 60, 900);
    const url = `${location.pathname}?lateral=1${location.hash}`;
    window.open(url, 'miax-aws-lateral', `popup=yes,width=${width},height=${height},left=0,top=0`);
  }

  function toggleTheme() {
    const root = document.documentElement;
    const dark = root.dataset.theme
      ? root.dataset.theme === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = dark ? 'light' : 'dark';
    store.set('theme', root.dataset.theme);
  }

  function openSettings() {
    $('f-region').value = settings.region;
    $('f-account').value = settings.account;
    $('f-alias').value = settings.alias;
    $('dlg-settings').showModal();
  }

  function applySettings() {
    settings.region = $('f-region').value;
    settings.account = $('f-account').value.trim();
    settings.alias = $('f-alias').value.trim();
    store.set('region', settings.region);
    store.set('account', settings.account);
    store.set('alias', settings.alias);
    $('region-label').textContent = settings.region;
    if (state.lesson) renderLesson();
  }

  function openHelp() {
    const account = /^\d{12}$/.test(settings.account) ? `${settings.account}.` : '';
    $('help-console').href = `https://${account}signin.aws.amazon.com/console`;
    $('dlg-help').showModal();
  }

  function openImage(source) {
    const big = $('dlg-image-img');
    big.src = source.currentSrc || source.src;
    big.alt = source.alt;
    big.style.setProperty('--ratio', source.naturalWidth / source.naturalHeight || 1);
    $('dlg-image').showModal();
  }

  function bindEvents() {
    window.addEventListener('hashchange', route);
    if (channel) {
      channel.onmessage = ({ data }) => {
        if (data.hash !== location.hash) location.hash = data.hash || '#/';
      };
    }

    $('btn-settings').addEventListener('click', openSettings);
    $('btn-mode').addEventListener('click', toggleMode);
    $('btn-float').addEventListener('click', openFloat);
    $('btn-theme').addEventListener('click', toggleTheme);
    $('btn-help').addEventListener('click', openHelp);
    $('btn-prev').addEventListener('click', () => step(-1));
    $('btn-next').addEventListener('click', () => step(1));
    $('slide-index').addEventListener('change', (e) => {
      go(state.lesson.id, Number(e.target.value) + 1);
      e.target.blur();
    });
    $('dlg-settings').addEventListener('close', () => {
      if ($('dlg-settings').returnValue === 'ok') applySettings();
    });

    $('dlg-image').addEventListener('click', () => $('dlg-image').close());

    main.addEventListener('click', async (e) => {
      const image = e.target.closest('.slide img');
      if (image && !image.closest('a')) { openImage(image); return; }
      const button = e.target.closest('.copy');
      if (!button) return;
      const code = button.parentElement.querySelector('code').textContent;
      try {
        await navigator.clipboard.writeText(code);
        button.textContent = 'Copiado';
      } catch (err) {
        button.textContent = 'Selecciona y copia';
      }
      setTimeout(() => { button.textContent = 'Copiar'; }, 1500);
    });

    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.target.matches('input, select, textarea') || document.querySelector('dialog[open]')) return;
      const inGuide = state.mode === 'guide';
      switch (e.key) {
        case 'ArrowRight': case 'PageDown':
          if (!inGuide) { e.preventDefault(); step(1); } break;
        case ' ':
          if (!inGuide && !e.target.matches('a, button, input')) { e.preventDefault(); step(1); } break;
        case 'ArrowLeft': case 'PageUp':
          if (!inGuide) { e.preventDefault(); step(-1); } break;
        case 'g': case 'G': toggleMode(); break;
        case 'p': case 'P': if (!isFloat) openFloat(); break;
        case 'a': case 'A': openSettings(); break;
        case 'f': case 'F':
          if (document.fullscreenElement) document.exitFullscreen();
          else document.documentElement.requestFullscreen();
          break;
        case 'Escape': location.hash = '#/'; break;
        case '?': openHelp(); break;
        default:
      }
    });
  }

  async function init() {
    if (isFloat) {
      document.body.classList.add('float');
      state.mode = 'slides';
    }
    $('f-region').innerHTML = REGIONS.map(([id, name]) => `<option value="${id}">${id} · ${name}</option>`).join('');
    $('region-label').textContent = settings.region;
    bindEvents();
    try {
      const res = await fetch('content/curso.json', { cache: 'no-cache' });
      if (!res.ok) throw new Error(`Índice no disponible (${res.status})`);
      state.course = await res.json();
      state.lessons = state.course.modules.flatMap((m) => m.lessons.map((l) => ({ ...l, module: m.title })));
      await route();
    } catch (err) {
      renderError(`${err.message}. Si abres el archivo directamente, sirve la carpeta con «python -m http.server».`);
    }
  }

  init();
})();
