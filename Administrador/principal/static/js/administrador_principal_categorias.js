/* ===========================
   Config & State
=========================== */
const EP = window.__ADMIN_ENDPOINTS__;
const STATE = {
  page: 1,
  per_page: 20,
  total: 0,
  q: '',
  padre_id: '',  // filtro de raíz o por padre (si lo usas)
  orden: 'nombre',
  editId: null,  // para modal en modo edición
};

/* ===========================
   Utils
=========================== */
function slugify(text) {
  return (text || '')
    .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-');
}

function showNotification(title, message, type = 'info') {
  const n = document.getElementById('notification');
  const icon = document.getElementById('notificationIcon');
  const titleEl = document.getElementById('notificationTitle');
  const messageEl = document.getElementById('notificationMessage');

  const config = {
    success: { icon: 'fas fa-check', color: 'bg-green-500' },
    error: { icon: 'fas fa-times', color: 'bg-red-500' },
    warning: { icon: 'fas fa-exclamation', color: 'bg-yellow-500' },
    info: { icon: 'fas fa-info', color: 'bg-blue-500' }
  };

  const typeCfg = config[type] || config.info;
  icon.className = `w-10 h-10 ${typeCfg.color} rounded-full flex items-center justify-center`;
  icon.innerHTML = `<i class="${typeCfg.icon} text-white"></i>`;

  titleEl.textContent = title;
  messageEl.textContent = message;

  n.classList.remove('translate-x-full');
  setTimeout(() => n.classList.add('translate-x-full'), 3500);
}

/* ===========================
   DOM refs
=========================== */
const txtSearch = document.getElementById('txtSearch');
const selPadreFiltro = document.getElementById('selPadreFiltro');
const selOrden = document.getElementById('selOrden');
const tbody = document.getElementById('tablaCategorias');
const lblResumen = document.getElementById('lblResumen');
const paginacion = document.getElementById('paginacion');

const modal = document.getElementById('modalCategoria');
const modalTitulo = document.getElementById('modalTitulo');
const btnCerrarModal = document.getElementById('btnCerrarModal');
const btnNuevaCategoria = document.getElementById('btnNuevaCategoria');
const btnCancelar = document.getElementById('btnCancelar');
const btnGuardar = document.getElementById('btnGuardar');

const inpNombre = document.getElementById('inpNombre');
const inpSlug = document.getElementById('inpSlug');
const txtDescripcion = document.getElementById('txtDescripcion');
const selPadre = document.getElementById('selPadre');

/* ===========================
   API
=========================== */
async function apiListarCategorias(params = {}) {
  const usp = new URLSearchParams();
  if (STATE.padre_id !== '') usp.set('padre_id', STATE.padre_id);
  usp.set('page', STATE.page);
  usp.set('per_page', STATE.per_page);
  // El endpoint no soporta q por defecto; puedes filtrar client-side
  const url = `${EP.apiListarCategorias}?${usp.toString()}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error('No se pudo listar categorías');
  return r.json();
}

async function apiCrearCategoria(payload) {
  const r = await fetch(EP.apiCrearCategoria, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const dj = await r.json();
  if (!r.ok || !dj.ok) throw new Error(dj.error || 'No fue posible crear');
  return dj;
}

async function apiActualizarCategoria(id, payload) {
  const url = EP.apiActualizarTemplate.replace(/\/0$/, `/${id}`);
  const r = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const dj = await r.json();
  if (!r.ok || !dj.ok) throw new Error(dj.error || 'No fue posible actualizar');
  return dj;
}

async function apiEliminarCategoria(id) {
  const url = EP.apiEliminarTemplate.replace(/\/0$/, `/${id}`);
  const r = await fetch(url, { method: 'DELETE' });
  const dj = await r.json();
  if (!r.ok || !dj.ok) throw new Error(dj.error || 'No fue posible eliminar');
  return dj;
}

/* ===========================
   Render
=========================== */
function renderTable(items) {
  // Filtro q y orden client-side
  let rows = [...items];

  const q = (STATE.q || '').toLowerCase();
  if (q) {
    rows = rows.filter(c =>
      (c.nombre || '').toLowerCase().includes(q) ||
      (c.slug || '').toLowerCase().includes(q)
    );
  }

  if (STATE.orden === 'nombre') {
    rows.sort((a, b) => (a.nombre || '').localeCompare(b.nombre || ''));
  } else if (STATE.orden === 'fecha') {
    // si el API no devuelve fechas, no se ordena realmente; dejamos por defecto
  }

  tbody.innerHTML = rows.map(c => `
    <tr class="table-row">
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${c.id}</td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium text-gray-900">${c.nombre ?? ''}</span>
          ${c.padre_id ? '' : '<span class="badge badge-root">raíz</span>'}
        </div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-800">${c.slug ?? ''}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${c.padre_id ?? '—'}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm">
        <div class="flex items-center gap-2">
          <button class="btn-edit px-3 py-2 text-blue-600 hover:bg-blue-50 rounded" data-id="${c.id}">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn-delete px-3 py-2 text-red-600 hover:bg-red-50 rounded" data-id="${c.id}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');

  bindRowActions();
}

function renderResumen(total) {
  const start = total === 0 ? 0 : ((STATE.page - 1) * STATE.per_page + 1);
  const end = Math.min(STATE.page * STATE.per_page, total);
  lblResumen.textContent = `Mostrando ${start} a ${end} de ${total} categorías`;
}

function renderPaginacion(total) {
  const totalPages = Math.max(1, Math.ceil(total / STATE.per_page));
  const btn = (label, pageNum, active=false, disabled=false) => `
    <button data-page="${pageNum}"
            class="px-3 py-2 text-sm ${active ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all'}"
            ${disabled ? 'disabled' : ''}>
      ${label}
    </button>`;
  let html = '';
  html += btn('Anterior', Math.max(1, STATE.page - 1), false, STATE.page === 1);
  for (let i = 1; i <= Math.min(totalPages, 3); i++) {
    html += btn(String(i), i, STATE.page === i);
  }
  if (totalPages > 3) {
    html += `<span class="text-gray-400 px-2">...</span>`;
    html += btn(String(totalPages), totalPages, STATE.page === totalPages);
  }
  html += btn('Siguiente', Math.min(totalPages, STATE.page + 1), false, STATE.page === totalPages);

  paginacion.innerHTML = html;
  paginacion.querySelectorAll('button[data-page]').forEach(b => {
    b.addEventListener('click', (e) => {
      const nextPage = parseInt(e.currentTarget.getAttribute('data-page'), 10);
      if (nextPage && nextPage !== STATE.page) {
        STATE.page = nextPage;
        loadCategorias();
      }
    });
  });
}

/* ===========================
   Modal
=========================== */
function openModal(editId = null, cat = null, listaPadres = []) {
  STATE.editId = editId;
  modalTitulo.textContent = editId ? 'Editar categoría' : 'Nueva categoría';
  inpNombre.value = cat?.nombre || '';
  inpSlug.value = cat?.slug || '';
  txtDescripcion.value = cat?.descripcion || '';

  // Rellenar selects de padre (opción raíz + todas raíces disponibles)
  selPadre.innerHTML = `<option value="">(Sin padre) — raíz</option>` +
    listaPadres.map(c => `<option value="${c.id}">${c.nombre}</option>`).join('');
  selPadre.value = cat?.padre_id || '';

  modal.classList.add('modal-open');
}

function closeModal() {
  modal.classList.remove('modal-open');
  STATE.editId = null;
}

/* ===========================
   Bindings
=========================== */
function bindRowActions() {
  document.querySelectorAll('.btn-edit').forEach(b => {
    b.addEventListener('click', async (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      // Volvemos a cargar lista para poblar select padre
      const data = await apiListarCategorias();
      const items = data.items || [];
      const cat = items.find(x => String(x.id) === String(id));
      const padres = items.filter(x => !x.padre_id && String(x.id) !== String(id)); // no permitas padre = sí mismo
      openModal(id, cat, padres);
    });
  });

  document.querySelectorAll('.btn-delete').forEach(b => {
    b.addEventListener('click', async (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      if (!confirm(`¿Eliminar categoría ${id}?`)) return;
      try {
        await apiEliminarCategoria(id);
        showNotification('Eliminada', `Categoría ${id} eliminada`, 'success');
        loadCategorias();
      } catch (err) {
        console.error(err);
        showNotification('Error', err.message, 'error');
      }
    });
  });
}

function initHandlers() {
  // Buscar (client-side)
  let t;
  txtSearch.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => {
      STATE.q = txtSearch.value.trim();
      loadCategorias();
    }, 250);
  });

  // Orden
  selOrden.addEventListener('change', () => {
    STATE.orden = selOrden.value;
    loadCategorias();
  });

  // Filtro de padre (opcional: si de verdad quieres paginar por padre)
  selPadreFiltro.addEventListener('change', () => {
    STATE.padre_id = selPadreFiltro.value;
    STATE.page = 1;
    loadCategorias();
  });

  // Abrir modal crear
  btnNuevaCategoria.addEventListener('click', async () => {
    // padres disponibles: raíces
    const data = await apiListarCategorias();
    const items = data.items || [];
    const padres = items.filter(x => !x.padre_id);
    openModal(null, null, padres);
  });

  // cerrar modal
  [btnCerrarModal, btnCancelar].forEach(btn => btn.addEventListener('click', closeModal));

  // autogenerar slug
  inpNombre.addEventListener('input', () => {
    if (!inpSlug.value || inpSlug.dataset.touched !== 'true') {
      inpSlug.value = slugify(inpNombre.value || '');
    }
  });
  inpSlug.addEventListener('input', () => { inpSlug.dataset.touched = 'true'; });

  // Guardar
  btnGuardar.addEventListener('click', async () => {
    const nombre = (inpNombre.value || '').trim();
    if (!nombre) {
      showNotification('Faltan datos', 'El nombre es obligatorio', 'warning');
      return;
    }
    const payload = {
      nombre,
      slug: (inpSlug.value || slugify(nombre)).trim(),
      descripcion: (txtDescripcion.value || '').trim(),
      padre_id: selPadre.value ? Number(selPadre.value) : null
    };

    try {
      if (STATE.editId) {
        await apiActualizarCategoria(STATE.editId, payload);
        showNotification('Actualizada', 'Categoría actualizada', 'success');
      } else {
        await apiCrearCategoria(payload);
        showNotification('Creada', 'Categoría creada', 'success');
      }
      closeModal();
      loadCategorias();
    } catch (err) {
      console.error(err);
      showNotification('Error', err.message, 'error');
    }
  });
}

/* ===========================
   Load
=========================== */
async function loadCategorias() {
  try {
    const data = await apiListarCategorias();
    const items = data.items || [];
    STATE.total = data.total || items.length;

    // Poblar filtro de padre si está vacío
    if (!selPadreFiltro.dataset.init) {
      const roots = items.filter(x => !x.padre_id);
      selPadreFiltro.innerHTML = `<option value="">(Todas) Solo raíces</option>` +
        roots.map(r => `<option value="${r.id}">${r.nombre}</option>`).join('');
      selPadreFiltro.dataset.init = '1';
    }

    // Si hay filtro de padre, muestra solo hijas de ese padre
    let visibles = items;
    if (STATE.padre_id) {
      visibles = items.filter(x => String(x.padre_id || '') === String(STATE.padre_id));
      // Ajusta total para la vista filtrada
      STATE.total = visibles.length;
    }

    renderTable(visibles);
    renderResumen(STATE.total);
    renderPaginacion(STATE.total);
  } catch (e) {
    console.error(e);
    showNotification('Error', 'No se pudo cargar categorías', 'error');
  }
}

/* ===========================
   Boot
=========================== */
document.addEventListener('DOMContentLoaded', () => {
  initHandlers();
  loadCategorias();
  showNotification('Listo', 'Gestión de categorías lista para usar', 'success');
});
