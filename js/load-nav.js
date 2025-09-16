(function () {
  const mount = document.getElementById('site-header');
  if (!mount) return;

  fetch('nav.html')
    .then(res => res.text())
    .then(html => {
      mount.innerHTML = html;

      // 高亮当前页
      const path = location.pathname.split('/').pop() || 'index.html';
      const route =
        path.includes('television') ? 'television' :
        path.includes('aboutus')    ? 'aboutus' :
        'index';

      const links = mount.querySelectorAll('.nav__links a');
      links.forEach(a => {
        if (a.dataset.route === route) a.classList.add('is-active');
        // 轻微的“动态切换”动画：点击时给个波纹/按压感（纯 CSS 配合）
        a.addEventListener('click', () => a.classList.add('is-pressed'));
      });

      // 点击左上角图标回到首页（已是 <a href="index.html">，这里可选增强）
      const logo = mount.querySelector('.nav__logo');
      if (logo) logo.addEventListener('click', () => { /* 可加埋点等 */ });
    })
    .catch(err => {
      console.error('Failed to load nav:', err);
    });
})();
