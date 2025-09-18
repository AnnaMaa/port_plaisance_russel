const params = new URLSearchParams(location.search);
const id = params.get('id');
const catwayId = params.get('catwayId'); 
const token = localStorage.getItem('jwt') || '';
const detail = document.getElementById('detail');
const title = document.getElementById('title');

(async ()=>{
  
  const res = await fetch(`/api/catways/${catwayId}/reservations/${id}`, {
    headers: { Authorization: 'Bearer '+token }
  });
  const data = await res.json();
  if(!res.ok){ detail.textContent = 'Erreur: '+(data?.message||res.statusText); return; }
  title.textContent = `Réservation de ${data.clientName}`;
  detail.innerHTML = `
    <p><b>ID:</b> ${data._id}</p>
    <p><b>Catway n°:</b> ${data.catwayNumber}</p>
    <p><b>Client:</b> ${data.clientName}</p>
    <p><b>Bateau:</b> ${data.boatName}</p>
    <p><b>Arrivée:</b> ${data.checkIn ? new Date(data.checkIn).toLocaleDateString() : ''}</p>
    <p><b>Départ:</b> ${data.checkOut ? new Date(data.checkOut).toLocaleDateString() : ''}</p>
  `;
})();
