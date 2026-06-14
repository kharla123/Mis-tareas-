let tasks = [
  { 
    id: 1, 
    title: 'planificar proyecto',
    desc: 'organizar plantear empezar.',
    status: 'En progreso' 
  },
  { 
    id: 2, 
    title: 'empezar codigo',
    desc: 'diseño estructura y funcion .',
    status: 'Pendiente' 
  },
  { 
    id: 3, 
    title: 'Actualizar sitio web',
    desc: 'errores y que la web este bien .',
    status: 'Hecha' // ← CAMBIADO: Antes decía 'Completada' y rompía el BADGE_CLASS
  },
];

let nextId = 4;
let activeTab = 'Tasks';
let editId = null; // ← CORREGIDO: Sin comillas para que sea un null real
let selectedStatus = 'Pendiente';

const BADGE_CLASS = {
  'Pendiente': 'badge-pendiente', 
  'En progreso': 'badge-progreso',
  'Hecha': 'badge-hecha',
};

const CHECK_ICON = ` 
<svg width="11" height="9" viewBox="0 0 11 9" fill="none">
  <path d="M1 4L4 7.5L10 1" stroke="white" stroke-width="2" 
    stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

function renderTasks() {
  const searchInput = document.getElementById('search');
  if (!searchInput) return;
  const search = searchInput.value.toLowerCase();

  let list = tasks.filter(t =>
    t.title.toLowerCase().includes(search)
  );

  if (activeTab === 'Completed') {
    list = list.filter(t => t.status === 'Hecha');
  }

  const container = document.getElementById('taskList');
  if (!container) return;
  container.innerHTML = '';

  list.forEach(task => {
    const item = document.createElement('div');
    item.className = 'task-item';

    item.innerHTML = `
      <button class="task-check ${task.status === 'Hecha' ? 'done' : ''}" data-id="${task.id}">
        ${task.status === 'Hecha' ? CHECK_ICON : ''}
      </button>
      <div class="task-body">
        <div class="task-title-row">
          <span class="task-name ${task.status === 'Hecha' ? 'striked' : ''}">
            ${task.title}
          </span>
          <span class="badge ${BADGE_CLASS[task.status] || 'badge-pendiente'}">${task.status}</span>
        </div>
        <p class="task-desc">${task.desc}</p>
      </div>
    `;

    item.querySelector('.task-check').addEventListener('click', e => {
      e.stopPropagation();
      task.status = task.status === 'Hecha' ? 'Pendiente' : 'Hecha';
      renderTasks();
    });

    item.querySelector('.task-body').addEventListener('click', () => openEdit(task));

    container.appendChild(item);
  });
}

// ── FORM ─────────────────────────────────────────────────────
function setFormStatus(status) {
  selectedStatus = status;
  document.querySelectorAll('.status-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.status === status);
  });
  updatePreview();
}

function openNew() {
  editId = null;
  document.getElementById('formHeading').textContent = 'NUEVA TAREA';
  document.getElementById('inputTitle').value = '';
  document.getElementById('inputDesc').value  = '';
  setFormStatus('Pendiente');
}

function openEdit(task) {
  editId = task.id;
  document.getElementById('formHeading').textContent = 'EDITAR TAREA';
  document.getElementById('inputTitle').value = task.title;
  document.getElementById('inputDesc').value  = task.desc;
  setFormStatus(task.status);
}

function updatePreview() {
  const title = document.getElementById('inputTitle').value.trim();
  const desc  = document.getElementById('inputDesc').value.trim();
  const card  = document.getElementById('previewCard');

  if (!title) {
    card.classList.remove('visible');
    return;
  }

  card.classList.add('visible');
  document.getElementById('previewName').textContent = title;
  document.getElementById('previewDesc').textContent = desc;

  const badge = document.getElementById('previewBadge');
  badge.textContent = selectedStatus;
  badge.className   = 'badge ' + BADGE_CLASS[selectedStatus];
}

function saveTask() {
  const title = document.getElementById('inputTitle').value.trim();
  const desc  = document.getElementById('inputDesc').value.trim();

  if (!title) {
    document.getElementById('inputTitle').focus();
    return;
  }

  if (editId !== null) {
    const task = tasks.find(t => t.id === editId);
    if (task) {
      task.title  = title;
      task.desc   = desc;
      task.status = selectedStatus;
    }
  } else {
    tasks.push({ id: nextId++, title, desc, status: selectedStatus });
  }

  openNew();
  renderTasks();
}

// ── NAV TABS ─────────────────────────────────────────────────
function setTab(tab) {
  activeTab = tab;

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });

  const wrapTasks = document.getElementById('wrap-Tasks');
  wrapTasks.classList.toggle('active', tab === 'Tasks');
  wrapTasks.querySelector('svg').setAttribute('stroke', tab === 'Tasks' ? 'white' : '#AAA');

  document.getElementById('icon-Calendar').setAttribute('stroke', tab === 'Calendar' ? '#00BCD4' : '#AAA');
  document.getElementById('icon-Completed').setAttribute('stroke', tab === 'Completed' ? '#00BCD4' : '#AAA');

  renderTasks();
}

// ── EVENT LISTENERS ───────────────────────────────────────────
document.getElementById('search').addEventListener('input', renderTasks);
document.getElementById('btnNew').addEventListener('click', () => { openNew(); renderTasks(); });
document.getElementById('btnClose').addEventListener('click', () => { openNew(); renderTasks(); });
document.getElementById('btnSave').addEventListener('click', saveTask);

document.querySelectorAll('.status-btn').forEach(btn => {
  btn.addEventListener('click', () => setFormStatus(btn.dataset.status));
});

document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => setTab(btn.dataset.tab));
});

document.getElementById('inputTitle').addEventListener('input', updatePreview);
document.getElementById('inputDesc').addEventListener('input', updatePreview);

// ── INIT ─────────────────────────────────────────────────────
renderTasks();
