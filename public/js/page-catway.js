const params = new URLSearchParams(location.search);
const id = params.get('id');
const token = localStorage.getItem('jwt') || '';
const detail = document.getElementById('detail');
const title = document.getElementById('title');

(async ()=>{
  const res = await fetch(`/api/catways/${id}`, { headers: { Authorization: 'Bearer '+token } });
  const data = await res.json();
  if(!res.ok){ detail.textContent = 'Erreur: '+(data?.message||res.statusText); return; }
  title.textContent = `Catway #${data.catwayNumber}`;
  detail.innerHTML = `
    <p><b>ID:</b> ${data._id}</p>
    <p><b>Type:</b> ${data.type}</p>
    <p><b>État:</b> ${data.catwayState}</p>
    <p><a href="/reservations.html">Voir les réservations</a></p>
  `;
})();
