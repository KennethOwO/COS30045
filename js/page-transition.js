// js/page-transition.js
(function () {
  // 定义页面顺序（文件名需与你的实际命名一致）
  const order = ['index.html', 'television.html', 'aboutus.html'];

  // 取得当前文件名，默认当作 index.html
  const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const currentIndex = order.indexOf(current);

  const page = document.querySelector('.page');
  if (!page) return;

  // 页面加载时，根据上一次跳转方向，播放“进入动画”
  const entry = sessionStorage.getItem('pt_entry'); // 'from-right' | 'from-left' | null
  if (entry === 'from-right') {
    page.classList.add('enter-from-right');
  } else if (entry === 'from-left') {
    page.classList.add('enter-from-left');
  }
  // 播放后清理，避免刷新时重复动画
  sessionStorage.removeItem('pt_entry');

  // 等待 nav.html 注入完成后再挂载事件（load-nav.js 会先 fetch nav）
  window.addEventListener('load', () => {
    const navLinks = document.querySelectorAll('.nav__links a, .nav__logo');
    navLinks.forEach(a => {
      a.addEventListener('click', (e) => {
        // 外链、锚点或无 href 的情况直接放行
        const href = a.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('http')) return;

        // 同页不处理
        const target = href.toLowerCase();
        if (target === current) return;

        const targetIndex = order.indexOf(target);
        if (targetIndex === -1 || currentIndex === -1) return; // 未在顺序表中，直接跳转（不动画）

        e.preventDefault(); // 拦截默认跳转，用动画过渡

        // 方向：前进 → 新页从右进；后退 → 新页从左进
        const forward = targetIndex > currentIndex;

        // 先给当前页加退出动画
        page.classList.remove('enter-from-right', 'enter-from-left');
        page.classList.add(forward ? 'exit-to-left' : 'exit-to-right');

        // 告诉下一页入场方向
        sessionStorage.setItem('pt_entry', forward ? 'from-right' : 'from-left');

        // 动画结束后再跳转（时间与 CSS 对应）
        const EXIT_DURATION = 280; // 与 slideOut 动画一致
        setTimeout(() => { location.href = href; }, EXIT_DURATION);
      });
    });
  });
})();
