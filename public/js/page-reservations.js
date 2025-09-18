const list = document.getElementById('list');
const token = localStorage.getItem('jwt') || '';

function render(rows){
  const table = document.createElement('table');
  table.innerHTML = `
    <thead><tr><th>ID</th><th>Catway n°</th><th>Client</th><th>Bateau</th><th>Arrivée</th><th>Départ</th></tr></thead>
    <tbody>${rows.map(r=>`
      <tr>
        <td><a href="/reservation.html?id=${r._id}&catwayId=${r.catwayId}">${r._id}</a></td>
        <td>${r.catwayNumber}</td>
        <td>${r.clientName}</td>
        <td>${r.boatName}</td>
        <td>${r.checkIn ? new Date(r.checkIn).toLocaleDateString() : ''}</td>
        <td>${r.checkOut ? new Date(r.checkOut).toLocaleDateString() : ''}</td>
      </tr>`).join('')}
    </tbody>`;
  list.innerHTML = '';
  list.append(table);
}

(async ()=>{
  const res = await fetch('/api/reservations', { headers: { Authorization: 'Bearer '+token } });
  const data = await res.json();
  if(!res.ok){ list.textContent = 'Erreur: '+(data?.message||res.statusText); return; }
  render(data);
})();
