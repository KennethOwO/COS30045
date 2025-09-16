(function () {
  const mount = document.getElementById('site-footer');
  if (!mount) return;

  fetch('footer.html')
    .then(res => res.text())
    .then(html => {
      mount.innerHTML = html;
    })
    .catch(err => {
      console.error('Failed to load footer:', err);
    });
})();
