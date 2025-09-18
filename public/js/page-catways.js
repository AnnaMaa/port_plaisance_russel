const list = document.getElementById('list');
const token = localStorage.getItem('jwt') || '';

function render(rows){
  const table = document.createElement('table');
  table.innerHTML = `
    <thead><tr><th>ID</th><th>Numéro</th><th>Type</th><th>État</th></tr></thead>
    <tbody>${rows.map(r=>`
      <tr>
        <td><a href="/catway.html?id=${r._id}">${r._id}</a></td>
        <td>${r.catwayNumber}</td>
        <td>${r.type}</td>
        <td>${r.catwayState}</td>
      </tr>`).join('')}
    </tbody>`;
  list.innerHTML = '';
  list.append(table);
}

(async ()=>{
  const res = await fetch('/api/catways', { headers: { Authorization: 'Bearer '+token } });
  const data = await res.json();
  if(!res.ok){ list.textContent = 'Erreur: '+(data?.message||res.statusText); return; }
  render(data);
})();
