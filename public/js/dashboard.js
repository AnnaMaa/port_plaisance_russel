
// ---- Helpers DOM ----
const $ = (sel) => document.querySelector(sel);
const create = (tag, props = {}, ...children) => {
  const el = document.createElement(tag);
  Object.assign(el, props);
  children.forEach(c => el.append(c));
  return el;
};

function renderTable(container, rows, columns) {
  const table = create('table');
  table.style.borderCollapse = 'collapse';
  table.style.width = '100%';
  const ths = 'border-bottom:1px solid #ccc;padding:6px;text-align:left';
  const tds = 'border-bottom:1px solid #eee;padding:6px;text-align:left';

  const thead = create('thead');
  const trh = create('tr');
  columns.forEach(col => {
    const th = create('th');
    th.style = ths;
    th.textContent = col.label;
    trh.append(th);
  });
  thead.append(trh);

  const tbody = create('tbody');
  rows.forEach(row => {
    const tr = create('tr');
    columns.forEach(col => {
      const td = create('td');
      td.style = tds;
      const v = col.render ? col.render(row[col.key], row) : row[col.key];
      td.append(v ?? '');
      tr.append(td);
    });
    tbody.append(tr);
  });

  table.append(thead, tbody);
  container.innerHTML = '';
  container.append(table);
}

function showMsg(container, text, color = 'teal') {
  container.innerHTML = '';
  const p = create('p', { textContent: text });
  p.style.color = color;
  container.append(p);
}

// ---- Auth / Token ----
const statusEl = $('#status') ?? create('p');
const logoutBtn = $('#logout') ?? create('button', { textContent: 'Se déconnecter' });

let token = localStorage.getItem('jwt');
if (!token) {
  alert("Pas de token — veuillez vous connecter.");
  location.href = '/';
}

logoutBtn.addEventListener('click', async () => {
  try { await fetch('/api/auth/logout', { method: 'POST', headers: { Authorization: 'Bearer ' + token } }); }
  catch {}
  localStorage.removeItem('jwt');
  location.href = '/';
});

if (statusEl) statusEl.textContent = 'Connecté ✅';

// ---- API helpers ----
async function apiGet(path) {
  const res = await fetch(path, { headers: { Authorization: 'Bearer ' + token } });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.message || `${res.status} ${res.statusText}`);
  return json;
}
async function apiPost(path, body) {
  const res = await fetch(path, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.message || `${res.status} ${res.statusText}`);
  return json;
}
async function apiDelete(path) {
  const res = await fetch(path, {
    method: 'DELETE',
    headers: { Authorization: 'Bearer ' + token }
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json?.message || `${res.status} ${res.statusText}`);
  }
  return true;
}

async function apiPut(path, body){
  const res = await fetch(path, {
    method: 'PUT',
    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(()=>({}));
  if(!res.ok) throw new Error(json?.message || `${res.status} ${res.statusText}`);
  return json;
}

// ---- Users ----
const usersMsg = $('#usersMsg');
const createUserForm = $('#createUser');
const userIdInput = $('#userIdInput');
const btnUpdateUser = $('#btnUpdateUser');
const btnDeleteUser = $('#btnDeleteUser');

createUserForm?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const body = Object.fromEntries(new FormData(createUserForm).entries());
  try{
    const r = await apiPost('/api/users', body);
    usersMsg.innerHTML = `<p style="color:teal">Créé ✅ : ${r._id}</p>`;
    userIdInput.value = r._id;
  }catch(err){
    usersMsg.innerHTML = `<p style="color:crimson">Erreur création : ${err.message}</p>`;
  }
});

btnUpdateUser?.addEventListener('click', async ()=>{
  const id = userIdInput.value.trim();
  if(!id) return alert('Saisir userId');
  const form = new FormData(createUserForm);
  const body = {
    name: form.get('name'),
    email: form.get('email'),
    password: form.get('password'),
  };
  try{
    await apiPut(`/api/users/${id}`, body);
    usersMsg.innerHTML = `<p style="color:teal">Mis à jour ✅</p>`;
  }catch(err){
    usersMsg.innerHTML = `<p style="color:crimson">Erreur MAJ : ${err.message}</p>`;
  }
});

btnDeleteUser?.addEventListener('click', async ()=>{
  const id = userIdInput.value.trim();
  if(!id) return alert('Saisir userId');
  if(!confirm('Supprimer cet utilisateur ?')) return;
  try{
    await apiDelete(`/api/users/${id}`);
    usersMsg.innerHTML = `<p style="color:teal">Supprimé ✅</p>`;
  }catch(err){
    usersMsg.innerHTML = `<p style="color:crimson">Erreur suppression : ${err.message}</p>`;
  }
});


// ---- Catways ----
const catwaysList = $('#catwaysList');
const createCatwayForm = $('#createCatway');
const btnListCatways = $('#btnListCatways');
const catwayIdInput = $('#catwayIdInput');

btnListCatways?.addEventListener('click', listCatways);

async function listCatways() {
  try {
    showMsg(catwaysList, 'Chargement des catways…');
    const data = await apiGet('/api/catways');

    renderTable(catwaysList, data, [
      {
        key: '_id', label: '_id',
        render: (v, row) => {
          const wrap = create('div');
          const link = create('a', { href: '#', textContent: v });
          link.addEventListener('click', (e) => {
            e.preventDefault();
            if (catwayIdInput) {
              catwayIdInput.value = row._id;
              catwayIdInput.focus();
            }
          });
          const del = create('button', { textContent: 'Supprimer', style: 'margin-left:8px' });
          del.addEventListener('click', async () => {
            if (!confirm(`Supprimer le catway #${row.catwayNumber} ?`)) return;
            try {
              await apiDelete(`/api/catways/${row._id}`);
              showMsg(catwaysList, 'Catway supprimé ✅ — rafraîchissement…');
              await listCatways();
            } catch (e) {
              showMsg(catwaysList, `Erreur suppression catway : ${e.message}`, 'crimson');
            }
          });
          wrap.append(link, del);
          return wrap;
        }
      },
      { key: 'catwayNumber', label: 'Numéro' },
      { key: 'type', label: 'Type' },
      { key: 'catwayState', label: 'État' },
      { key: 'updatedAt', label: 'MAJ', render: (v) => (v ? new Date(v).toLocaleString() : '') },
    ]);
  } catch (e) {
    showMsg(catwaysList, `Erreur liste catways : ${e.message}`, 'crimson');
  }
}

createCatwayForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const body = Object.fromEntries(new FormData(createCatwayForm).entries());
  body.catwayNumber = Number(body.catwayNumber);
  try {
    await apiPost('/api/catways', body);
    showMsg(catwaysList, 'Catway créé ✅ — rafraîchissement…');
    await listCatways();
  } catch (e2) {
    showMsg(catwaysList, `Erreur création catway : ${e2.message}`, 'crimson');
  }
});

// ---- Réservations ----
const reservationsList = $('#reservationsList');
const createResForm = $('#createReservation');
const btnListReservations = $('#btnListReservations');

btnListReservations?.addEventListener('click', listReservations);

async function listReservations() {
  try {
    showMsg(reservationsList, 'Chargement des réservations…');
    const data = await apiGet('/api/reservations'); // suppose que chaque doc a catwayId & _id

    renderTable(reservationsList, data, [
      { key: '_id', label: '_id' },
      { key: 'catwayId', label: 'catwayId' },
      { key: 'catwayNumber', label: 'Catway n°' },
      { key: 'clientName', label: 'Client' },
      { key: 'boatName', label: 'Bateau' },
      { key: 'checkIn', label: 'Arrivée', render: (v) => (v ? new Date(v).toLocaleDateString() : '') },
      { key: 'checkOut', label: 'Départ', render: (v) => (v ? new Date(v).toLocaleDateString() : '') },
      {
        key: '_actions', label: 'Actions', render: (_, row) => {
          const btn = create('button', { textContent: 'Supprimer' });
          btn.addEventListener('click', async () => {
            if (!confirm(`Supprimer la réservation de "${row.clientName}" (catway ${row.catwayNumber}) ?`)) return;
            try {
              await apiDelete(`/api/catways/${row.catwayId}/reservations/${row._id}`);
              showMsg(reservationsList, 'Réservation supprimée ✅ — rafraîchissement…');
              await listReservations();
            } catch (e) {
              showMsg(reservationsList, `Erreur suppression réservation : ${e.message}`, 'crimson');
            }
          });
          return btn;
        }
      }
    ]);
  } catch (e) {
    showMsg(reservationsList, `Erreur liste réservations : ${e.message}`, 'crimson');
  }
}

createResForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const body = Object.fromEntries(new FormData(createResForm).entries());
  const payload = {
    clientName: body.clientName,
    boatName: body.boatName,
    checkIn: body.checkIn,
    checkOut: body.checkOut,
  };
  try {
    await apiPost(`/api/catways/${body.catwayId}/reservations`, payload);
    showMsg(reservationsList, 'Réservation créée ✅ — rafraîchissement…');
    await listReservations();
  } catch (e2) {
    showMsg(reservationsList, `Erreur création réservation : ${e2.message}`, 'crimson');
  }
});

// ---- Auto-chargement utile ----
window.addEventListener('DOMContentLoaded', () => {
  listCatways().catch(() => {});
  listReservations().catch(() => {});
});
