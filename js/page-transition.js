// js/page-transition.js (robust)
(function () {
  // 你的网站页面顺序（文件名要与实际一致）
  const order = ['index.html', 'television.html', 'aboutus.html'];

  // 取得当前文件名（默认 index.html）
  const currentFile = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const currentIndex = order.indexOf(currentFile);

  const page = document.querySelector('.page');
  if (!page) return;

  // 进入动画：根据上一页写入的方向播放
  const entry = sessionStorage.getItem('pt_entry'); // 'from-right' | 'from-left'
  if (entry === 'from-right') page.classList.add('enter-from-right');
  else if (entry === 'from-left') page.classList.add('enter-from-left');
  sessionStorage.removeItem('pt_entry');

  // 归一化 href（去掉开头的 ./ ）
  function normalizeHref(href) {
    if (!href) return href;
    const h = href.trim().toLowerCase();
    if (h === '/' || h === '') return 'index.html';
    return h.startsWith('./') ? h.slice(2) : h;
  }

  // 绑定导航点击拦截（注：nav 是异步注入）
  function bindNavHandlers() {
    const navLinks = document.querySelectorAll('.nav__links a, .nav__logo'); // .nav__logo 是 <a>
    if (!navLinks.length) return false;

    navLinks.forEach(a => {
      // 避免重复绑定
      if (a.__pt_bound) return;
      a.__pt_bound = true;

      a.addEventListener('click', (e) => {
        const raw = a.getAttribute('href');
        if (!raw || raw.startsWith('#') || raw.startsWith('http')) return;

        const target = normalizeHref(raw);
        const current = normalizeHref(currentFile);
        if (target === current) return; // 同页不处理

        const targetIndex = order.indexOf(target);
        if (targetIndex === -1 || currentIndex === -1) return; // 不在顺序表，直接让默认跳转

        e.preventDefault(); // 拦截默认跳转，先播放退出动画

        const forward = targetIndex > currentIndex; // 决定方向
        page.classList.remove('enter-from-right', 'enter-from-left');
        page.classList.add(forward ? 'exit-to-left' : 'exit-to-right');

        // 提示下一页用什么入场方向
        sessionStorage.setItem('pt_entry', forward ? 'from-right' : 'from-left');

        // 与 CSS 动画时长匹配
        const EXIT_DURATION = 280;
        setTimeout(() => { location.href = target; }, EXIT_DURATION);
      });
    });

    return true;
  }

  // 方式 A：尝试立即绑定（如果 nav 已经注入）
  if (bindNavHandlers()) return;

  // 方式 B：监听 #site-header 的 DOM 变化，等 nav 注入后再绑定
  const header = document.getElementById('site-header');
  if (!header) return;

  const obs = new MutationObserver(() => {
    if (bindNavHandlers()) {
      obs.disconnect();
    }
  });
  obs.observe(header, { childList: true, subtree: true });

})();
