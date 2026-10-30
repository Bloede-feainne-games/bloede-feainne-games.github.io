/* Progressive enhancement: navigation stays visible when JavaScript is unavailable. */
(() => {
  'use strict';

  const toggle = document.querySelector('[data-menu-toggle]');
  const navigation = document.querySelector('[data-navigation]');
  if (!toggle || !navigation) return;

  const mobile = window.matchMedia('(max-width: 720px)');
  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    navigation.dataset.open = String(open);
  };
  const reset = () => setOpen(!mobile.matches);

  document.documentElement.classList.add('has-js');
  toggle.hidden = false;
  reset();

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mobile.matches && navigation.dataset.open === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (mobile.matches && !navigation.contains(event.target) && !toggle.contains(event.target)) {
      setOpen(false);
    }
  });
  navigation.addEventListener('click', (event) => {
    if (mobile.matches && event.target.closest('a')) setOpen(false);
  });
  mobile.addEventListener('change', reset);
})();
