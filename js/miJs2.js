function enviarComentario() {
  const texto = document.getElementById('comentario').value.trim();
  if (texto === '') {
    alert('Por favor, escribe un comentario.');
    return;
  }

  const li = document.createElement('li');
  li.textContent = texto;

  const lista = document.getElementById('lista-comentarios');
  lista.appendChild(li);

  document.getElementById('comentario').value = '';

  lista.parentElement.scrollTop = lista.parentElement.scrollHeight;
}
function enviarComentario() {
  const texto = document.getElementById('comentario').value.trim();
  if (!texto) { alert('Por favor, escribe un comentario.'); return; }

  const li = document.createElement('li');
  li.textContent = texto;
  document.getElementById('lista-comentarios').appendChild(li);
  document.getElementById('comentario').value = '';
}
const flotante = document.getElementById('comentarios-flotante');
const btnToggle = document.getElementById('btn-toggle');

btnToggle.addEventListener('click', () => {
  flotante.classList.toggle('collapsed');
  btnToggle.textContent = flotante.classList.contains('collapsed') ? '▶' : '◀';
});
