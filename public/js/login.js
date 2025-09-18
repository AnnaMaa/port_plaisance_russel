
const form = document.getElementById('login');
const info = document.getElementById('loginInfo');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  info.style.color = 'gold';
  info.textContent = '⏳ Connexion en cours...';

  try {
    const body = Object.fromEntries(new FormData(form).entries());
    console.log("Payload envoyé:", body);

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    let payload;
    const contentType = res.headers.get('content-type') || '';
    payload = contentType.includes('application/json')
      ? await res.json()
      : { message: await res.text() };

    console.log("Réponse serveur:", res.status, payload);

    if (res.ok) {
      localStorage.setItem('jwt', payload.token);
      info.style.color = 'lightgreen';
      info.textContent = '✅ Connexion réussie. Redirection...';
      setTimeout(() => location.href = '/dashboard.html', 800);
    } else {
      info.style.color = 'crimson';
      info.textContent = `❌ Échec (${res.status}) : ${payload.message || 'Erreur inconnue'}`;
    }
  } catch (err) {
    console.error("Erreur JS/Network:", err);
    info.style.color = 'crimson';
    info.textContent = '⚠️ Erreur réseau ou script. Voir console (F12).';
  }
});
