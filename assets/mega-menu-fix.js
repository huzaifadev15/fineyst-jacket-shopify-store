// Mega Menu Button Triggers - Add this to global.js initMegaMenu function
document.addEventListener('DOMContentLoaded', function() {
  const megaMenuTriggers = document.querySelectorAll('[data-mega-menu-trigger]');
  let activeMenu = null;

  megaMenuTriggers.forEach(trigger => {
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      const menuType = this.getAttribute('data-mega-menu-trigger');
      const megaMenu = document.querySelector(`[data-mega-menu-panel="${menuType}"]`);
      const navItem = this.closest('[data-mega-menu]');
      
      if (megaMenu) {
        if (activeMenu === megaMenu) {
          closeMenu(megaMenu, navItem);
        } else {
          closeAllMenus();
          openMenu(megaMenu, navItem);
        }
      }
    });
  });

  function closeAllMenus() {
    document.querySelectorAll('[data-mega-menu-panel]').forEach(menu => {
      const navItem = document.querySelector(`[data-mega-menu="${menu.dataset.megaMenuPanel}"]`);
      if (navItem) {
        closeMenu(menu, navItem);
      }
    });
  }

  function openMenu(menu, navItem) {
    menu.classList.add('is-active');
    navItem.classList.add('is-active');
    activeMenu = menu;
    document.body.style.overflow = window.innerWidth < 1025 ? 'hidden' : '';
  }

  function closeMenu(menu, navItem) {
    menu.classList.remove('is-active');
    navItem.classList.remove('is-active');
    if (activeMenu === menu) {
      activeMenu = null;
    }
    document.body.style.overflow = '';
  }
});
