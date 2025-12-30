/* ============================================
   FINEYST JACKETS - GLOBAL JAVASCRIPT
   ============================================ */

   document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initHeader();
    initMobileMenu();
    initMegaMenu();
    initProductGallery();
    initQuantityButtons();
    initAddToCart();
    initCartSidebar();
    initWishlist();
    initWelcomeCarousel();
    initHandPickedCarousel();
    initColorCollectionCarousel();
    initFAQ();
    initSectionCarousel();
  });
  
  /* Header Scroll Behavior */
  function initHeader() {
    const header = document.querySelector('[data-header]');
    if (!header) return;
  
    let lastScroll = 0;
    const headerHeight = header.offsetHeight;
  
    window.addEventListener('scroll', function() {
      const currentScroll = window.pageYOffset;
  
      if (currentScroll <= 0) {
        header.classList.remove('is-hidden');
        return;
      }
  
      if (currentScroll > lastScroll && currentScroll > headerHeight) {
        // Scrolling down
        header.classList.add('is-hidden');
      } else {
        // Scrolling up
        header.classList.remove('is-hidden');
      }
  
      lastScroll = currentScroll;
    }, { passive: true });
  }
  
  /* Mobile Menu Toggle */
  function initMobileMenu() {
    const menuToggle = document.querySelector('[data-menu-toggle]');
    const mobileMenu = document.querySelector('[data-mobile-menu]');
    const menuClose = document.querySelector('[data-menu-close]');
  
    if (!menuToggle || !mobileMenu) return;
  
    menuToggle.addEventListener('click', function() {
      const isActive = mobileMenu.classList.toggle('is-active');
      menuToggle.setAttribute('aria-expanded', isActive);
      document.body.style.overflow = isActive ? 'hidden' : '';
    });
  
    // Close menu on close button click
    if (menuClose) {
      menuClose.addEventListener('click', function() {
        mobileMenu.classList.remove('is-active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    }
  
    // Close menu on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function() {
        mobileMenu.classList.remove('is-active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* Mega Menu */
  function initMegaMenu() {
    const navItems = document.querySelectorAll('[data-mega-menu]');
    const megaMenus = document.querySelectorAll('[data-mega-menu-panel]');
    const closeButtons = document.querySelectorAll('[data-mega-menu-close]');
    let activeMenu = null;
    let hoverTimeout = null;

    if (!navItems.length || !megaMenus.length) return;

    // Handle hover on desktop
    navItems.forEach(item => {
      const menuType = item.dataset.megaMenu;
      const megaMenu = document.querySelector(`[data-mega-menu-panel="${menuType}"]`);
      const navLink = item.querySelector('.site-header__nav-link');

      if (!megaMenu) return;

      // Mouse enter
      item.addEventListener('mouseenter', function() {
        if (window.innerWidth >= 1025) {
          clearTimeout(hoverTimeout);
          closeAllMenus();
          openMenu(megaMenu, item);
        }
      });

      // Mouse leave
      item.addEventListener('mouseleave', function() {
        if (window.innerWidth >= 1025) {
          hoverTimeout = setTimeout(() => {
            closeMenu(megaMenu, item);
          }, 200);
        }
      });

      // Keep menu open when hovering over it
      megaMenu.addEventListener('mouseenter', function() {
        if (window.innerWidth >= 1025) {
          clearTimeout(hoverTimeout);
        }
      });

      megaMenu.addEventListener('mouseleave', function() {
        if (window.innerWidth >= 1025) {
          hoverTimeout = setTimeout(() => {
            closeMenu(megaMenu, item);
          }, 200);
        }
      });

      // Click on mobile/tablet
      navLink.addEventListener('click', function(e) {
        if (window.innerWidth < 1025) {
          e.preventDefault();
          if (activeMenu === megaMenu) {
            closeMenu(megaMenu, item);
          } else {
            closeAllMenus();
            openMenu(megaMenu, item);
          }
        }
      });
    });

    // Close buttons
    closeButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        const megaMenu = this.closest('.mega-menu');
        const navItem = document.querySelector(`[data-mega-menu="${megaMenu.dataset.megaMenuPanel}"]`);
        if (megaMenu && navItem) {
          closeMenu(megaMenu, navItem);
        }
      });
    });

    // Close on outside click
    document.addEventListener('click', function(e) {
      if (window.innerWidth < 1025) {
        const clickedInside = e.target.closest('.site-header__nav-item--has-mega-menu') || 
                             e.target.closest('.mega-menu');
        if (!clickedInside && activeMenu) {
          const navItem = document.querySelector(`[data-mega-menu="${activeMenu.dataset.megaMenuPanel}"]`);
          if (navItem) {
            closeMenu(activeMenu, navItem);
          }
        }
      }
    });

    // Close on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && activeMenu) {
        const navItem = document.querySelector(`[data-mega-menu="${activeMenu.dataset.megaMenuPanel}"]`);
        if (navItem) {
          closeMenu(activeMenu, navItem);
        }
      }
    });

    // Close all menus function
    function closeAllMenus() {
      megaMenus.forEach(menu => {
        const navItem = document.querySelector(`[data-mega-menu="${menu.dataset.megaMenuPanel}"]`);
        if (navItem) {
          closeMenu(menu, navItem);
        }
      });
    }

    // Open menu function
    function openMenu(menu, navItem) {
      menu.classList.add('is-active');
      navItem.classList.add('is-active');
      activeMenu = menu;
      document.body.style.overflow = window.innerWidth < 1025 ? 'hidden' : '';
    }

    // Close menu function
    function closeMenu(menu, navItem) {
      menu.classList.remove('is-active');
      navItem.classList.remove('is-active');
      if (activeMenu === menu) {
        activeMenu = null;
      }
      document.body.style.overflow = '';
    }

    // Handle window resize
    window.addEventListener('resize', function() {
      if (window.innerWidth >= 1025) {
        closeAllMenus();
      }
    });
  }
  
  /* Product Gallery */
  function initProductGallery() {
    const thumbs = document.querySelectorAll('[data-thumb]');
    const mainImage = document.getElementById('ProductMainImage');
  
    if (!thumbs.length || !mainImage) return;
  
    thumbs.forEach(thumb => {
      thumb.addEventListener('click', function() {
        // Update main image
        mainImage.src = this.dataset.imageUrl;
        mainImage.alt = this.dataset.imageAlt;
  
        // Update active state
        thumbs.forEach(t => t.classList.remove('is-active'));
        this.classList.add('is-active');
      });
    });
  }
  
  /* Quantity Buttons */
  function initQuantityButtons() {
    document.addEventListener('click', function(e) {
      const minusBtn = e.target.closest('[data-quantity-minus]');
      const plusBtn = e.target.closest('[data-quantity-plus]');
  
      if (minusBtn) {
        const input = minusBtn.parentElement.querySelector('[data-quantity-input], input[type="number"]');
        if (input) {
          const currentValue = parseInt(input.value) || 1;
          const minValue = parseInt(input.min) || 1;
          if (currentValue > minValue) {
            input.value = currentValue - 1;
            input.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }
      }
  
      if (plusBtn) {
        const input = plusBtn.parentElement.querySelector('[data-quantity-input], input[type="number"]');
        if (input) {
          const currentValue = parseInt(input.value) || 1;
          const maxValue = parseInt(input.max) || Infinity;
          if (currentValue < maxValue) {
            input.value = currentValue + 1;
            input.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }
      }
    });
  }
  
  /* Add to Cart */
  function initAddToCart() {
    // Quick add to cart from product cards
    document.addEventListener('click', function(e) {
      const addBtn = e.target.closest('[data-add-to-cart]');
      if (!addBtn) return;
      
      // Check if button is disabled
      if (addBtn.disabled) {
        return;
      }
  
      e.preventDefault();
      const variantId = addBtn.dataset.addToCart;
      
      // Validate variant ID before proceeding
      if (!variantId || variantId === 'undefined' || variantId === 'null' || variantId === '') {
        console.error('Invalid variant ID from button:', variantId);
        alert('Unable to add this item to cart. Please refresh the page and try again.');
        return;
      }
  
      addToCart(variantId, 1);
    });
  
    // Product form submission
    const productForm = document.querySelector('[data-product-form]');
    if (productForm) {
      productForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const variantId = formData.get('id');
        const quantity = formData.get('quantity') || 1;
  
        addToCart(variantId, quantity);
      });
    }
  }
  
  function addToCart(variantId, quantity = 1) {
    // Validate variant ID
    if (!variantId || variantId === 'undefined' || variantId === 'null') {
      console.error('Invalid variant ID:', variantId);
      alert('Please select a product variant before adding to cart.');
      return;
    }
    
    // Convert variant ID to number if it's a string
    const numericVariantId = typeof variantId === 'string' ? parseInt(variantId, 10) : variantId;
    
    if (isNaN(numericVariantId)) {
      console.error('Variant ID is not a valid number:', variantId);
      alert('Invalid product variant. Please try again.');
      return;
    }
    
    const data = {
      items: [{
        id: numericVariantId,
        quantity: parseInt(quantity) || 1
      }]
    };
    
    if (!window.routes || !window.routes.cart_add_url) {
      console.error('Cart routes not defined');
      alert('Cart system not initialized. Please refresh the page.');
      return;
    }
  
    fetch(window.routes.cart_add_url + '.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      // Check if response is ok
      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 422) {
          // Item already in cart or max quantity reached
          return response.json().then(errorData => {
            const errorMessage = errorData.description || errorData.message || 'This item is already in your cart at maximum quantity.';
            
            // Open cart sidebar and load current cart
            openCartSidebar();
            loadCartSidebar();
            
            // Show friendly message
            alert(errorMessage);
            
            // Return null to skip the success handler
            return null;
          }).catch(() => {
            // If JSON parse fails, still open cart
            openCartSidebar();
            loadCartSidebar();
            alert('This item is already in your cart at maximum quantity.');
            return null;
          });
        }
        
        // Try to get error message from response
        return response.text().then(text => {
          let errorMessage = 'Failed to add item to cart';
          try {
            const errorData = JSON.parse(text);
            errorMessage = errorData.description || errorData.message || errorMessage;
          } catch (e) {
            // If response isn't JSON, use status text
            errorMessage = `Failed to add item to cart (${response.status})`;
          }
          throw new Error(errorMessage);
        });
      }
      return response.json();
    })
    .then(cartData => {
      // If we got a 422 error, cartData will be null - already handled
      if (cartData === null) {
        return; // Error already handled, cart sidebar opened
      }
      
      // Validate cart data
      if (!cartData) {
        throw new Error('Invalid response from server');
      }
      
      // Update cart count
      updateCartCount();
      
      // Always use the cart data from the add response
      // Shopify's cart add API returns the full cart object
      if (cartData && cartData.items && Array.isArray(cartData.items)) {
        // Use the response data directly
        console.log('Using cart data from add response:', cartData);
        renderCartItems(cartData);
        updateCartSubtotal(cartData);
        openCartSidebar();
        showCartSidebarBanner();
      } else {
        // Fallback: try to load cart
        console.log('No cart data in response, fetching cart...');
        openCartSidebar();
        setTimeout(() => {
          loadCartSidebar();
        }, 500);
      }
    })
    .catch(error => {
      console.error('Error adding to cart:', error);
      
      // Don't show alert if we already showed one for 422 error
      if (error.message && error.message.includes('already in cart')) {
        // Already handled above
        return;
      }
      
      // For other errors, try to load cart anyway to show current state
      loadCartSidebar();
      openCartSidebar();
      
      const errorMessage = error.message || 'Failed to add item to cart. Please try again.';
      alert(errorMessage);
    });
  }
  
  function updateCartCount() {
    if (!window.routes || !window.routes.cart_url) {
      return;
    }
    
    fetch(window.routes.cart_url + '.js')
      .then(response => {
        if (!response.ok) {
          // Don't update count if cart fetch fails
          return null;
        }
        return response.json();
      })
      .then(cart => {
        if (cart && cart.item_count !== undefined) {
          const countElements = document.querySelectorAll('[data-cart-count]');
          countElements.forEach(el => {
            el.textContent = cart.item_count || 0;
          });
        }
      })
      .catch(error => {
        // Silently fail - don't show errors for cart count updates
        console.error('Error updating cart count:', error);
      });
  }
  
  /* Cart Sidebar */
  function initCartSidebar() {
    const sidebar = document.querySelector('[data-cart-sidebar]');
    if (!sidebar) return;

    // Toggle sidebar from header cart button
    const cartToggle = document.querySelector('[data-cart-toggle]');
    if (cartToggle) {
      cartToggle.addEventListener('click', function(e) {
        e.preventDefault();
        // Don't open sidebar on cart page - redirect to cart instead
        const isCartPage = window.location.pathname.includes('/cart') || window.location.pathname === '/cart';
        if (isCartPage) {
          window.location.href = window.routes.cart_url;
          return;
        }
        openCartSidebar();
      });
    }

    // Close sidebar handlers
    const closeBtn = sidebar.querySelector('[data-cart-sidebar-close]');
    const overlay = sidebar.querySelector('[data-cart-sidebar-overlay]');
    
    if (closeBtn) {
      closeBtn.addEventListener('click', closeCartSidebar);
    }
    
    if (overlay) {
      overlay.addEventListener('click', closeCartSidebar);
    }

    // Close on ESC key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && sidebar.classList.contains('is-open')) {
        closeCartSidebar();
      }
    });

    // Quantity update handlers
    sidebar.addEventListener('click', function(e) {
      const minusBtn = e.target.closest('[data-cart-quantity-minus]');
      const plusBtn = e.target.closest('[data-cart-quantity-plus]');
      const removeBtn = e.target.closest('[data-cart-remove]');

      if (minusBtn) {
        e.preventDefault();
        const key = minusBtn.dataset.cartQuantityMinus;
        const input = minusBtn.parentElement.querySelector('[data-cart-quantity-input]');
        if (input) {
          const currentQty = parseInt(input.value) || 1;
          if (currentQty > 1) {
            updateCartItem(key, currentQty - 1);
          }
        }
      }

      if (plusBtn) {
        e.preventDefault();
        const key = plusBtn.dataset.cartQuantityPlus;
        const input = plusBtn.parentElement.querySelector('[data-cart-quantity-input]');
        if (input) {
          const currentQty = parseInt(input.value) || 1;
          updateCartItem(key, currentQty + 1);
        }
      }

      if (removeBtn) {
        e.preventDefault();
        const key = removeBtn.dataset.cartRemove;
        removeCartItem(key);
      }
    });

    // Load initial cart (but don't show sidebar)
    // Cart will be loaded when sidebar opens
  }

  function openCartSidebar() {
    const sidebar = document.querySelector('[data-cart-sidebar]');
    if (sidebar) {
      sidebar.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      // Cart items should already be loaded before opening (from addToCart response)
      // Only load if sidebar items container is empty
      const itemsContainer = sidebar.querySelector('[data-cart-sidebar-items]');
      if (!itemsContainer || itemsContainer.children.length === 0) {
        setTimeout(() => {
          loadCartSidebar();
        }, 100);
      }
    }
  }

  function closeCartSidebar() {
    const sidebar = document.querySelector('[data-cart-sidebar]');
    if (sidebar) {
      sidebar.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  }

  function showCartSidebarBanner() {
    const banner = document.querySelector('[data-cart-sidebar-banner]');
    if (banner) {
      banner.style.display = 'flex';
      setTimeout(() => {
        banner.style.display = 'none';
      }, 3000);
    }
  }

  function formatMoney(cents) {
    if (typeof Shopify !== 'undefined' && Shopify.formatMoney) {
      return Shopify.formatMoney(cents);
    }
    // Fallback formatting
    return 'Rs ' + (cents / 100).toLocaleString('en-IN');
  }

  // Utility function to escape HTML to prevent XSS
  function escapeHtml(text) {
    if (text == null) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function loadCartSidebar() {
    // Don't load cart sidebar if we're on the cart page itself
    const isCartPage = window.location.pathname.includes('/cart') || 
                       window.location.pathname === '/cart' ||
                       (window.routes && window.location.pathname === window.routes.cart_url.replace(window.shopUrl || '', ''));
    
    if (isCartPage) {
      return;
    }
    
    if (!window.routes || !window.routes.cart_url) {
      console.error('Cart routes not defined');
      return;
    }
    
    // Check if cart sidebar exists before trying to load
    const sidebar = document.querySelector('[data-cart-sidebar]');
    if (!sidebar) {
      return; // Cart sidebar doesn't exist on this page
    }
    
    // Show loading state
    const itemsContainer = sidebar.querySelector('[data-cart-sidebar-items]');
    if (itemsContainer) {
      itemsContainer.innerHTML = '<p style="padding: 2rem; text-align: center; color: #999;">Loading cart...</p>';
    }
    
    const cartUrl = window.routes.cart_url + '.js';
    console.log('Loading cart from:', cartUrl);
    
    // Simple fetch without complex error handling
    fetch(cartUrl)
      .then(response => {
        if (!response.ok && response.status !== 404) {
          throw new Error('Cart API returned: ' + response.status);
        }
        return response.json().catch(() => {
          // If JSON parse fails, return empty cart
          return { items: [], item_count: 0, total_price: 0 };
        });
      })
      .then(cart => {
        // Ensure cart has required properties
        if (!cart) cart = { items: [], item_count: 0, total_price: 0 };
        if (!cart.items) cart.items = [];
        if (cart.item_count === undefined) cart.item_count = cart.items.length;
        if (cart.total_price === undefined) cart.total_price = 0;
        
        updateCartCount();
        renderCartItems(cart);
        updateCartSubtotal(cart);
      })
      .catch(error => {
        console.error('Error loading cart:', error);
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          cartUrl: cartUrl
        });
        
        // Only show error if sidebar is actually open
        const sidebar = document.querySelector('[data-cart-sidebar]');
        if (sidebar && sidebar.classList.contains('is-open')) {
          const itemsContainer = sidebar.querySelector('[data-cart-sidebar-items]');
          const emptyContainer = sidebar.querySelector('[data-cart-sidebar-empty]');
          
          if (itemsContainer) {
            itemsContainer.innerHTML = '<p style="padding: 2rem; text-align: center; color: #999;">Unable to load cart items. Please try again.</p>';
          }
          if (emptyContainer) {
            emptyContainer.style.display = 'none';
          }
          
          // Hide subtotal on error since it might be stale
          const subtotalEl = sidebar.querySelector('[data-cart-sidebar-subtotal]');
          if (subtotalEl) {
            subtotalEl.textContent = 'Rs 0';
          }
        }
      });
  }

  function renderCartItems(cart) {
    const sidebar = document.querySelector('[data-cart-sidebar]');
    if (!sidebar) {
      return; // Sidebar doesn't exist
    }
    
    const itemsContainer = sidebar.querySelector('[data-cart-sidebar-items]');
    const emptyContainer = sidebar.querySelector('[data-cart-sidebar-empty]');
    
    if (!itemsContainer || !emptyContainer) {
      console.error('Cart sidebar containers not found');
      return;
    }

    // Handle empty cart
    if (!cart || cart.item_count === 0 || !cart.items || cart.items.length === 0) {
      itemsContainer.innerHTML = '';
      emptyContainer.style.display = 'flex';
      return;
    }

    emptyContainer.style.display = 'none';
    
    // Log items for debugging
    console.log('Rendering', cart.items.length, 'cart items');
    
    try {
      itemsContainer.innerHTML = cart.items.map(item => {
      const hasComparePrice = item.variant && item.variant.compare_at_price && item.variant.compare_at_price > item.price;
      const unitPrice = formatMoney(item.price);
      const comparePrice = hasComparePrice ? formatMoney(item.variant.compare_at_price) : '';
      const totalPrice = formatMoney(item.line_price);
      
      // Extract color and size from variant options
      let color = '';
      let size = '';
      
      // Shopify cart API provides variant options in item.variant.options array
      if (item.variant && item.variant.options) {
        // Typically: options[0] = option1 (often color), options[1] = option2 (often size), etc.
        if (item.variant.options.length > 0) {
          color = item.variant.options[0] || '';
        }
        if (item.variant.options.length > 1) {
          size = item.variant.options[1] || '';
        }
      }
      
      // Fallback to variant title if options not available
      if (!color && !size && item.variant && item.variant.title && item.variant.title !== 'Default Title') {
        const variantParts = item.variant.title.split(' / ');
        if (variantParts.length >= 2) {
          color = variantParts[0].trim();
          size = variantParts[1].trim();
        } else if (variantParts.length === 1) {
          const value = variantParts[0].trim();
          const colorKeywords = ['black', 'white', 'grey', 'gray', 'navy', 'blue', 'red', 'green', 'brown', 'beige', 'tan', 'grey', 'leather'];
          if (colorKeywords.some(keyword => value.toLowerCase().includes(keyword))) {
            color = value;
          } else {
            size = value;
          }
        }
      }
      
      // Check properties for color/size
      if (item.properties && Object.keys(item.properties).length > 0) {
        Object.keys(item.properties).forEach(key => {
          const lowerKey = key.toLowerCase();
          const value = item.properties[key];
          if (lowerKey.includes('color') && !color && value) {
            color = value;
          }
          if (lowerKey.includes('size') && !size && value) {
            size = value;
          }
        });
      }

      // Handle image URL - Shopify cart API returns image as a URL string
      // The image might be a full URL or a relative path
      let imageUrl = '';
      if (item.image) {
        if (typeof item.image === 'string') {
          // Handle protocol-relative URLs (//cdn.shopify.com/...)
          if (item.image.startsWith('//')) {
            imageUrl = `https:${item.image}`;
          } 
          // Handle absolute URLs
          else if (item.image.startsWith('http://') || item.image.startsWith('https://')) {
            imageUrl = item.image;
          }
          // Handle relative URLs - prepend shop domain
          else if (item.image.startsWith('/')) {
            imageUrl = window.shopUrl + item.image;
          }
          // Otherwise use as-is
          else {
            imageUrl = item.image;
          }
        } 
        // If image is an object with url property
        else if (item.image.url) {
          const url = item.image.url;
          if (url.startsWith('//')) {
            imageUrl = `https:${url}`;
          } else if (url.startsWith('http://') || url.startsWith('https://')) {
            imageUrl = url;
          } else if (url.startsWith('/')) {
            imageUrl = window.shopUrl + url;
          } else {
            imageUrl = url;
          }
        }
      }
      
      // Fallback: try featured_image or product image
      if (!imageUrl) {
        const fallbackImage = item.featured_image || (item.product && item.product.featured_image);
        if (fallbackImage) {
          if (typeof fallbackImage === 'string') {
            imageUrl = fallbackImage.startsWith('//') ? `https:${fallbackImage}` : 
                      fallbackImage.startsWith('/') ? (window.shopUrl + fallbackImage) : fallbackImage;
          }
        }
      }
      
      // Use the global escapeHtml function (defined above)
      const productTitle = escapeHtml(item.product ? item.product.title : item.title);
      const itemUrl = item.url || (item.product ? `/products/${item.product.handle}` : '#');
      const colorText = color ? escapeHtml(color) : '';
      const sizeText = size ? escapeHtml(size) : '';
      
      return `
        <div class="cart-sidebar-item" data-cart-item-key="${item.key}">
          <div class="cart-sidebar-item__image-wrapper">
            ${imageUrl ? `<img 
              src="${escapeHtml(imageUrl)}" 
              alt="${escapeHtml(item.title || productTitle)}" 
              class="cart-sidebar-item__image"
              onerror="this.onerror=null; this.style.display='none'; this.parentElement.innerHTML='<div class=\\'cart-sidebar-item__image\\' style=\\'background: #f5f5f5;\\'></div>';"
            >` : '<div class="cart-sidebar-item__image" style="background: #f5f5f5;"></div>'}
            <button type="button" class="cart-sidebar-item__wishlist" aria-label="Add to wishlist">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
          </div>
          <div class="cart-sidebar-item__content">
            <div class="cart-sidebar-item__header">
              <h3 class="cart-sidebar-item__title">
                <a href="${escapeHtml(itemUrl)}">${productTitle}</a>
              </h3>
              <button type="button" class="cart-sidebar-item__remove" data-cart-remove="${item.key}" aria-label="Remove item">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
            ${colorText ? `<p class="cart-sidebar-item__variant">Color: ${colorText}</p>` : ''}
            ${sizeText ? `<p class="cart-sidebar-item__variant">Size: ${sizeText}</p>` : ''}
            <div class="cart-sidebar-item__quantity">
              <button type="button" class="cart-sidebar-item__quantity-btn" data-cart-quantity-minus="${item.key}">−</button>
              <input 
                type="number" 
                class="cart-sidebar-item__quantity-input" 
                value="${item.quantity}" 
                min="1"
                data-cart-quantity-input
                readonly
              >
              <button type="button" class="cart-sidebar-item__quantity-btn" data-cart-quantity-plus="${item.key}">+</button>
            </div>
            <div class="cart-sidebar-item__pricing">
              <div class="cart-sidebar-item__unit-price">
                ${hasComparePrice ? `<span class="cart-sidebar-item__unit-price--compare">${comparePrice}</span>` : ''}
                <span class="cart-sidebar-item__unit-price--sale">${unitPrice}</span>
              </div>
              <div class="cart-sidebar-item__total-price">Total Price: ${totalPrice}</div>
            </div>
          </div>
        </div>
      `;
      }).join('');
      
      console.log('Cart items rendered successfully');
    } catch (renderError) {
      console.error('Error rendering cart items:', renderError);
      itemsContainer.innerHTML = '<p style="padding: 2rem; text-align: center; color: #999;">Error displaying cart items. Please refresh the page.</p>';
    }
  }

  function updateCartSubtotal(cart) {
    const subtotalEl = document.querySelector('[data-cart-sidebar-subtotal]');
    if (subtotalEl) {
      subtotalEl.textContent = formatMoney(cart.total_price);
    }
    
    const totalEl = document.querySelector('[data-cart-sidebar-total]');
    if (totalEl) {
      totalEl.textContent = formatMoney(cart.total_price);
    }
    
    // Update dynamic checkout buttons
    updateDynamicCheckoutButtons(cart);
  }

  function updateDynamicCheckoutButtons(cart) {
    const dynamicCheckoutContainer = document.querySelector('[data-cart-sidebar-dynamic-checkout]');
    if (!dynamicCheckoutContainer) return;
    
    if (cart.item_count === 0) {
      dynamicCheckoutContainer.innerHTML = '';
      return;
    }

    // Create form structure for Shopify dynamic checkout
    // Shopify's dynamic checkout buttons require a form with cart items
    let formHTML = '<form action="' + window.routes.cart_url + '" method="post" class="cart-sidebar__dynamic-form">';
    
    // Add hidden inputs for each cart item (required for dynamic checkout)
    cart.items.forEach(item => {
      formHTML += '<input type="hidden" name="updates[' + escapeHtml(item.key) + ']" value="' + item.quantity + '">';
    });
    
    formHTML += '<div class="dynamic-checkout__content"></div></form>';
    
    dynamicCheckoutContainer.innerHTML = formHTML;
    
    // Initialize Shopify dynamic checkout buttons
    // This will automatically detect and render available express checkout options
    if (typeof Shopify !== 'undefined') {
      // Wait a bit for DOM to update, then initialize
      setTimeout(() => {
        const form = dynamicCheckoutContainer.querySelector('form');
        const container = dynamicCheckoutContainer.querySelector('.dynamic-checkout__content');
        
        if (form && container) {
          // Use Shopify's dynamic checkout button API
          if (Shopify.dynamicPaymentButtons) {
            Shopify.dynamicPaymentButtons.init();
          }
          
          // Alternative: Create dynamic checkout button manually
          // Fetch checkout button HTML from cart page
          fetch(window.routes.cart_url)
            .then(response => response.text())
            .then(html => {
              const parser = new DOMParser();
              const doc = parser.parseFromString(html, 'text/html');
              
              // Look for dynamic checkout button container
              const checkoutButtons = doc.querySelector('[data-shopify="dynamic-checkout"], .dynamic-checkout__content, .shopify-payment-button');
              
              if (checkoutButtons) {
                container.innerHTML = checkoutButtons.innerHTML;
                
                // Re-execute any scripts in the loaded HTML
                const scripts = container.querySelectorAll('script');
                scripts.forEach(oldScript => {
                  const newScript = document.createElement('script');
                  Array.from(oldScript.attributes).forEach(attr => {
                    newScript.setAttribute(attr.name, attr.value);
                  });
                  newScript.textContent = oldScript.textContent;
                  oldScript.parentNode.replaceChild(newScript, oldScript);
                });
                
                // Reinitialize payment buttons
                if (typeof Shopify !== 'undefined' && Shopify.dynamicPaymentButtons) {
                  Shopify.dynamicPaymentButtons.init();
                }
              }
            })
            .catch(error => {
              console.error('Error loading dynamic checkout buttons:', error);
            });
        }
      }, 100);
    }
  }

  function updateCartItem(key, quantity) {
    if (quantity <= 0) {
      // Remove item
      fetch(window.routes.cart_change_url + '.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: key,
          quantity: 0
        })
      })
      .then(response => response.json())
      .then(cart => {
        loadCartSidebar();
      })
      .catch(error => {
        console.error('Error removing cart item:', error);
        loadCartSidebar(); // Reload anyway to sync
      });
    } else {
      // Update quantity
      fetch(window.routes.cart_change_url + '.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: key,
          quantity: quantity
        })
      })
      .then(response => response.json())
      .then(cart => {
        loadCartSidebar();
      })
      .catch(error => {
        console.error('Error updating cart:', error);
        loadCartSidebar(); // Reload anyway to sync
      });
    }
  }

  function removeCartItem(key) {
    updateCartItem(key, 0);
  }
  
  /* Utility: Slide out animation */
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes slideOutRight {
      from {
        opacity: 1;
        transform: translateX(0);
      }
      to {
        opacity: 0;
        transform: translateX(100%);
      }
    }
  `;
  document.head.appendChild(styleSheet);
  
  /* Product Variant Selection */
  document.addEventListener('change', function(e) {
    if (!e.target.matches('[data-option-select]')) return;
  
    const productJson = document.getElementById('ProductJson');
    if (!productJson) return;
  
    const product = JSON.parse(productJson.textContent);
    const form = e.target.closest('form');
    const selects = form.querySelectorAll('[data-option-select]');
    
    // Get selected options
    const selectedOptions = Array.from(selects).map(select => select.value);
    
    // Find matching variant
    const variant = product.variants.find(v => {
      return v.options.every((option, index) => option === selectedOptions[index]);
    });
  
    if (variant) {
      // Update variant ID
      const variantInput = form.querySelector('[data-variant-id]');
      if (variantInput) variantInput.value = variant.id;
  
      // Update price
      const priceEl = document.querySelector('[data-product-price]');
      if (priceEl) {
        const formattedPrice = Shopify.formatMoney ? 
          Shopify.formatMoney(variant.price) : 
          '$' + (variant.price / 100).toFixed(2);
        
        if (variant.compare_at_price > variant.price) {
          const formattedCompare = Shopify.formatMoney ? 
            Shopify.formatMoney(variant.compare_at_price) : 
            '$' + (variant.compare_at_price / 100).toFixed(2);
          priceEl.innerHTML = `
            <span class="product-info__price--compare">${formattedCompare}</span>
            <span class="product-info__price--sale">${formattedPrice}</span>
          `;
        } else {
          priceEl.innerHTML = `<span>${formattedPrice}</span>`;
        }
      }
  
      // Update button state
      const submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = !variant.available;
        submitBtn.textContent = variant.available ? 'Add to Cart' : 'Sold Out';
      }
  
      // Update URL
      const url = new URL(window.location.href);
      url.searchParams.set('variant', variant.id);
      window.history.replaceState({}, '', url);
    }
  });
  
  /* Welcome Section Carousel */
  function initWelcomeCarousel() {
    const carousel = document.querySelector('[data-carousel]');
    if (!carousel) return;
  
    // Find the wrapper that contains both carousel and navigation buttons
    const wrapper = carousel.closest('.welcome-section__carousel-wrapper');
    if (!wrapper) return;
  
    const track = carousel.querySelector('[data-carousel-track]');
    const prevBtn = wrapper.querySelector('[data-carousel-prev]');
    const nextBtn = wrapper.querySelector('[data-carousel-next]');
    const genderFilters = document.querySelectorAll('[data-gender-filter]');
    
    if (!track || !prevBtn || !nextBtn) return;
  
    let currentIndex = 0;
    let currentGender = 'men';
    let visibleCards = [];
  
    function getCardWidth() {
      const visibleCard = visibleCards.length > 0 ? visibleCards[0] : track.querySelector('.welcome-section__category-card:not([style*="display: none"])');
      if (!visibleCard) return 0;
      const style = window.getComputedStyle(visibleCard);
      const width = visibleCard.offsetWidth;
      const gap = parseInt(style.marginRight) || parseInt(style.marginLeft) || 16;
      return width + gap;
    }
    
    function getMaxVisible() {
      // On mobile, typically 1-2 cards are visible, on desktop 3-5
      const isMobile = window.innerWidth < 768;
      return isMobile ? 1 : 5;
    }
  
    function filterByGender(gender) {
      currentGender = gender;
      const allCards = Array.from(track.querySelectorAll('.welcome-section__category-card'));
      visibleCards = [];
      
      // Normalize gender value (lowercase, trimmed)
      const normalizedGender = (gender || 'men').toLowerCase().trim();
      
      // Add fade out effect
      allCards.forEach(card => {
        card.style.transition = 'opacity 0.3s ease';
        card.style.opacity = '0';
      });
      
      setTimeout(() => {
        allCards.forEach(card => {
          // Normalize card gender value (lowercase, trimmed)
          const cardGender = (card.getAttribute('data-gender') || 'men').toLowerCase().trim();
          
          // Show card if it matches the selected gender or is set to 'both'
          if (cardGender === normalizedGender || cardGender === 'both') {
            card.style.display = '';
            visibleCards.push(card);
            // Fade in with delay
            setTimeout(() => {
              card.style.opacity = '1';
            }, 50);
          } else {
            card.style.display = 'none';
            card.style.opacity = '0';
          }
        });

        // Reset carousel position
        currentIndex = 0;
        updateCarousel();
      }, 150);
    }
  
    function updateCarousel() {
      const cardWidth = getCardWidth();
      if (cardWidth === 0) return; // Don't update if card width is 0
      
      const translateX = -currentIndex * cardWidth;
      track.style.transform = `translateX(${translateX}px)`;
      
      const visibleCount = visibleCards.length;
      const maxVisible = Math.min(getMaxVisible(), visibleCount);
      
      // Update button states
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex >= Math.max(0, visibleCount - maxVisible);
    }
  
    // Gender filter buttons
    genderFilters.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const gender = (this.getAttribute('data-gender-filter') || 'men').toLowerCase().trim();
        
        // Update active state
        genderFilters.forEach(b => b.classList.remove('is-active'));
        this.classList.add('is-active');
        
        // Filter categories
        filterByGender(gender);
      });
    });
  
    // Carousel navigation
    prevBtn.addEventListener('click', function() {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    });
  
    nextBtn.addEventListener('click', function() {
      const visibleCount = visibleCards.length;
      const maxVisible = Math.min(getMaxVisible(), visibleCount);
      const maxIndex = Math.max(0, visibleCount - maxVisible);
      
      if (currentIndex < maxIndex) {
        currentIndex++;
        updateCarousel();
      }
    });
  
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        // Recalculate card width and reset if needed
        const newCardWidth = getCardWidth();
        if (newCardWidth > 0) {
          // Ensure currentIndex is still valid
          const visibleCount = visibleCards.length;
          const maxVisible = Math.min(getMaxVisible(), visibleCount);
          const maxIndex = Math.max(0, visibleCount - maxVisible);
          currentIndex = Math.min(currentIndex, maxIndex);
        }
        updateCarousel();
      }, 250);
    });
  
    // Initialize with men's categories
    filterByGender('men');
  }
  
  /* Hand-Picked Section Carousel */
  function initHandPickedCarousel() {
    const carousel = document.querySelector('[data-handpicked-carousel]');
    if (!carousel) return;
  
    // Find the wrapper that contains both carousel and navigation buttons
    const wrapper = carousel.closest('.hand-picked-section__carousel-wrapper');
    if (!wrapper) return;
  
    const tracks = carousel.querySelectorAll('[data-handpicked-track]');
    const prevBtn = wrapper.querySelector('[data-handpicked-prev]');
    const nextBtn = wrapper.querySelector('[data-handpicked-next]');
    const genderFilters = document.querySelectorAll('[data-handpicked-gender]');
    
    if (!tracks.length || !prevBtn || !nextBtn) return;
  
    let currentIndex = 0;
    let currentGender = 'men';
    let currentTrack = null;
    let visibleProducts = [];
  
    function getProductWidth() {
      if (!currentTrack) return 0;
      // Use the base width (non-center product) for calculations
      const firstProduct = currentTrack.querySelector('.hand-picked-section__product:not(.is-center)');
      if (!firstProduct) {
        const anyProduct = currentTrack.querySelector('.hand-picked-section__product');
        if (!anyProduct) return 0;
        // If all are center, use center width
        const style = window.getComputedStyle(anyProduct);
        const width = anyProduct.offsetWidth;
        const gap = parseInt(style.marginRight) || 32;
        return width + gap;
      }
      const style = window.getComputedStyle(firstProduct);
      const width = firstProduct.offsetWidth;
      const gap = parseInt(style.marginRight) || 32;
      return width + gap;
    }
  
    function filterByGender(gender) {
      currentGender = gender;
      
      // Find and show the appropriate track
      tracks.forEach(track => {
        const trackGender = track.getAttribute('data-gender');
        if (trackGender === gender) {
          track.style.display = '';
          currentTrack = track;
        } else {
          track.style.display = 'none';
        }
      });
      
      if (!currentTrack) return;
      
      // Get all products from the visible track
      visibleProducts = Array.from(currentTrack.querySelectorAll('.hand-picked-section__product'));
      
      currentIndex = 0;
      setTimeout(() => {
        updateCarousel();
      }, 50);
    }
  
    function updateCarousel() {
      if (!currentTrack) return;
      
      // Remove center class from all products
      visibleProducts.forEach(product => {
        product.classList.remove('is-center');
      });
      
      // Add center class to the middle product (index 2 in a 5-product view)
      // When showing 5 products, the center is always at index 2
      const centerIndex = 2;
      if (visibleProducts[centerIndex] && visibleProducts.length >= 5) {
        visibleProducts[centerIndex].classList.add('is-center');
      } else if (visibleProducts.length < 5 && visibleProducts.length > 0) {
        // If less than 5 products, center the middle one
        const midIndex = Math.floor(visibleProducts.length / 2);
        if (visibleProducts[midIndex]) {
          visibleProducts[midIndex].classList.add('is-center');
        }
      }
      
      const productWidth = getProductWidth();
      const translateX = -currentIndex * productWidth;
      currentTrack.style.transform = `translateX(${translateX}px)`;
      
      const visibleCount = visibleProducts.length;
      const maxVisible = Math.min(5, visibleCount);
      
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex >= Math.max(0, visibleCount - maxVisible);
    }
  
    // Gender filter buttons
    genderFilters.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const gender = this.getAttribute('data-handpicked-gender');
        
        genderFilters.forEach(b => b.classList.remove('is-active'));
        this.classList.add('is-active');
        
        filterByGender(gender);
      });
    });
  
    // Carousel navigation
    prevBtn.addEventListener('click', function() {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    });
  
    nextBtn.addEventListener('click', function() {
      const visibleCount = visibleProducts.length;
      const maxVisible = Math.min(5, visibleCount);
      const maxIndex = Math.max(0, visibleCount - maxVisible);
      
      if (currentIndex < maxIndex) {
        currentIndex++;
        updateCarousel();
      }
    });
  
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        updateCarousel();
      }, 250);
    });
  
    // Initialize with men's products
    filterByGender('men');
    
    // Set initial center product
    setTimeout(() => {
      updateCarousel();
    }, 100);
  }
  
  /* Color Collection Carousel */
  function initColorCollectionCarousel() {
    const carousel = document.querySelector('[data-color-carousel]');
    if (!carousel) return;
  
    // Find the section that contains both carousel and navigation buttons
    const section = carousel.closest('.color-collection-section');
    if (!section) return;
  
    const track = carousel.querySelector('[data-color-track]');
    const prevBtn = section.querySelector('[data-color-prev]');
    const nextBtn = section.querySelector('[data-color-next]');
    
    if (!track || !prevBtn || !nextBtn) return;
  
    let currentIndex = 0;
    const cards = Array.from(track.querySelectorAll('.color-collection-section__card'));
    const totalCards = cards.length;

    function getVisibleCards() {
      // On mobile, typically 1 card is visible, on desktop 3-5 cards
      const isMobile = window.innerWidth < 768;
      return isMobile ? 1 : 5;
    }

    function getCardWidth() {
      const firstCard = cards[0];
      if (!firstCard) return 0;
      const style = window.getComputedStyle(firstCard);
      const width = firstCard.offsetWidth;
      const gap = parseInt(style.marginRight) || parseInt(style.marginLeft) || 16;
      return width + gap;
    }

    function updateCarousel() {
      const cardWidth = getCardWidth();
      if (cardWidth === 0) return; // Don't update if card width is 0
      
      const translateX = -currentIndex * cardWidth;
      track.style.transform = `translateX(${translateX}px)`;
      
      const visibleCards = getVisibleCards();
      // On mobile, allow scrolling to the last card (totalCards - 1)
      // On desktop, stop when last visibleCards are shown
      const isMobile = window.innerWidth < 768;
      const maxIndex = isMobile ? Math.max(0, totalCards - 1) : Math.max(0, totalCards - visibleCards);
      
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex >= maxIndex;
    }

    prevBtn.addEventListener('click', function() {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    });

    nextBtn.addEventListener('click', function() {
      const visibleCards = getVisibleCards();
      const isMobile = window.innerWidth < 768;
      const maxIndex = isMobile ? Math.max(0, totalCards - 1) : Math.max(0, totalCards - visibleCards);
      
      if (currentIndex < maxIndex) {
        currentIndex++;
        updateCarousel();
      }
    });
  
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        // Recalculate card width
        const newCardWidth = getCardWidth();
        if (newCardWidth > 0) {
          // Ensure currentIndex is still valid after resize
          const visibleCards = getVisibleCards();
          const isMobile = window.innerWidth < 768;
          const maxIndex = isMobile ? Math.max(0, totalCards - 1) : Math.max(0, totalCards - visibleCards);
          currentIndex = Math.min(currentIndex, maxIndex);
        }
        updateCarousel();
      }, 250);
    });
  
    // Initialize
    updateCarousel();
  }
  
  /* Wishlist Functionality */
  function initWishlist() {
    // Get wishlist from localStorage (new format with full product data)
    function getWishlist() {
      try {
        const wishlist = localStorage.getItem('wishlist-storage');
        if (wishlist) {
          const parsed = JSON.parse(wishlist);
          return parsed.state?.items || [];
        }
        // Fallback to old format (just IDs)
        const oldWishlist = localStorage.getItem('wishlist');
        if (oldWishlist) {
          const ids = JSON.parse(oldWishlist);
          return ids.map(id => ({ id: String(id) }));
        }
        return [];
      } catch (e) {
        return [];
      }
    }

    // Save wishlist to localStorage
    function saveWishlist(items) {
      try {
        const wishlistData = {
          state: { items: items },
          version: 0
        };
        localStorage.setItem('wishlist-storage', JSON.stringify(wishlistData));
        // Also keep old format for backward compatibility
        const ids = items.map(item => String(item.id));
        localStorage.setItem('wishlist', JSON.stringify(ids));
      } catch (e) {
        console.error('Error saving wishlist:', e);
      }
    }

    // Fetch product data by handle
    async function fetchProductDataByHandle(handle) {
      try {
        const response = await fetch(`/products/${handle}.json`);
        if (!response.ok) return null;
        const data = await response.json();
        const product = data.product;
        
        // Ensure we have options_with_values structure
        if (product && !product.options_with_values && product.options) {
          product.options_with_values = product.options.map((opt, idx) => ({
            name: typeof opt === 'string' ? opt : (opt.name || `Option ${idx + 1}`),
            values: typeof opt === 'string' ? [] : (opt.values || [])
          }));
        }
        
        return product;
      } catch (e) {
        console.error('Error fetching product:', e);
        return null;
      }
    }

    // Fetch product data by ID (searches all products)
    async function fetchProductData(productId) {
      try {
        // Try to get handle from data attribute or page
        const productElement = document.querySelector(`[data-product-id="${productId}"]`);
        const handle = productElement?.getAttribute('data-product-handle') || 
                      productElement?.closest('[data-product-handle]')?.getAttribute('data-product-handle');
        
        if (handle) {
          return await fetchProductDataByHandle(handle);
        }

        // Fallback: try to find in products.json
        const response = await fetch('/products.json?limit=250');
        if (response.ok) {
          const data = await response.json();
          const product = data.products.find(p => String(p.id) === String(productId));
          if (product) {
            // Ensure options_with_values structure
            if (!product.options_with_values && product.options) {
              product.options_with_values = product.options.map((opt, idx) => ({
                name: typeof opt === 'string' ? opt : (opt.name || `Option ${idx + 1}`),
                values: typeof opt === 'string' ? [] : (opt.values || [])
              }));
            }
            // Normalize images
            if (product.images && product.images.length > 0) {
              product.images = product.images.map(img => {
                if (typeof img === 'string') {
                  return { src: img, url: img };
                }
                return {
                  src: img.src || img.url || '',
                  url: img.url || img.src || '',
                  alt: img.alt || product.title || ''
                };
              });
            }
          }
          return product || null;
        }
        return null;
      } catch (e) {
        console.error('Error fetching product:', e);
        return null;
      }
    }

    // Get product data from page (if on product page)
    function getProductDataFromPage() {
      const productJson = document.getElementById('ProductJson');
      if (productJson) {
        try {
          return JSON.parse(productJson.textContent);
        } catch (e) {
          console.error('Error parsing product JSON:', e);
        }
      }
      return null;
    }

    // Check if product is in wishlist
    function isInWishlist(productId) {
      const wishlist = getWishlist();
      return wishlist.some(item => String(item.id) === String(productId));
    }

    // Add product to wishlist
    async function addToWishlist(productId, productData = null) {
      const wishlist = getWishlist();
      
      // Check if already in wishlist
      if (isInWishlist(productId)) {
        return;
      }

      // Try to get product data
      let product = productData;
      if (!product) {
        // Check cache first
        if (window.productDataCache && window.productDataCache[productId]) {
          product = window.productDataCache[productId];
        }
      }
      if (!product) {
        product = getProductDataFromPage();
      }
      if (!product) {
        product = await fetchProductData(productId);
      }

      // Extract size options from variants
      let sizeOptions = [];
      let colorOptions = [];
      
      if (product?.variants && product.variants.length > 0) {
        // Get options from product (Shopify structure)
        let options = product.options_with_values || product.options || [];
        
        // Normalize options structure
        if (options.length > 0 && typeof options[0] === 'string') {
          // If options is just an array of strings, convert to objects
          options = options.map((opt, idx) => {
            // Try to get values from variants
            const values = new Set();
            product.variants.forEach(v => {
              const val = v.options && v.options[idx] 
                ? v.options[idx] 
                : (idx === 0 ? v.option1 : (idx === 1 ? v.option2 : v.option3));
              if (val) values.add(val);
            });
            return {
              name: opt,
              values: Array.from(values)
            };
          });
        }
        
        // Find which option is Size
        let sizeOptionIndex = -1;
        let colorOptionIndex = -1;
        
        options.forEach((opt, idx) => {
          const optName = (typeof opt === 'string' ? opt : (opt.name || '')).toLowerCase();
          if (optName === 'size' || optName.includes('size')) {
            sizeOptionIndex = idx;
          }
          if (optName === 'color' || optName === 'colour') {
            colorOptionIndex = idx;
          }
        });
        
        // Extract unique sizes from variants
        if (sizeOptionIndex >= 0) {
          const sizeSet = new Set();
          product.variants.forEach(variant => {
            let sizeValue = null;
            if (variant.options && variant.options[sizeOptionIndex]) {
              sizeValue = variant.options[sizeOptionIndex];
            } else if (sizeOptionIndex === 0) {
              sizeValue = variant.option1;
            } else if (sizeOptionIndex === 1) {
              sizeValue = variant.option2;
            } else if (sizeOptionIndex === 2) {
              sizeValue = variant.option3;
            }
            if (sizeValue && sizeValue.toLowerCase() !== 'default title') {
              sizeSet.add(sizeValue);
            }
          });
          sizeOptions = Array.from(sizeSet).sort();
        } else {
          // Fallback: if no size option found, try to extract from option1, option2, option3
          // This handles cases where size might be in any option position
          const allOptions = new Set();
          product.variants.forEach(variant => {
            [variant.option1, variant.option2, variant.option3].forEach(opt => {
              if (opt && opt.toLowerCase() !== 'default title') {
                allOptions.add(opt);
              }
            });
          });
          // If we have a reasonable number of options (likely sizes), use them
          if (allOptions.size > 0 && allOptions.size <= 10) {
            sizeOptions = Array.from(allOptions).sort();
          }
        }
        
        // Extract unique colors from variants
        if (colorOptionIndex >= 0) {
          const colorSet = new Set();
          product.variants.forEach(variant => {
            const colorValue = variant.options && variant.options[colorOptionIndex] 
              ? variant.options[colorOptionIndex] 
              : (colorOptionIndex === 0 ? variant.option1 : (colorOptionIndex === 1 ? variant.option2 : variant.option3));
            if (colorValue && colorValue.toLowerCase() !== 'default title') {
              colorSet.add(colorValue);
            }
          });
          colorOptions = Array.from(colorSet).map(color => ({
            name: color,
            value: color
          }));
        }
      }

      // Normalize images - ensure full URLs
      let normalizedImages = [];
      
      // Helper to convert relative URLs to absolute
      function normalizeImageUrl(url) {
        if (!url) return '';
        if (url.startsWith('http://') || url.startsWith('https://')) {
          return url;
        }
        if (url.startsWith('//')) {
          return 'https:' + url;
        }
        if (url.startsWith('/')) {
          return window.location.origin + url;
        }
        return url;
      }
      
      if (product?.images && product.images.length > 0) {
        normalizedImages = product.images.map(img => {
          let imgUrl = '';
          if (typeof img === 'string') {
            imgUrl = img;
          } else {
            imgUrl = img.src || img.url || '';
          }
          const normalizedUrl = normalizeImageUrl(imgUrl);
          return {
            src: normalizedUrl,
            url: normalizedUrl,
            alt: (typeof img === 'object' ? img.alt : '') || product?.title || ''
          };
        });
      } else if (product?.featured_image) {
        const featuredImg = product.featured_image;
        let imgUrl = typeof featuredImg === 'string' ? featuredImg : (featuredImg.src || featuredImg.url || '');
        const normalizedUrl = normalizeImageUrl(imgUrl);
        normalizedImages = [{
          src: normalizedUrl,
          url: normalizedUrl,
          alt: product?.title || ''
        }];
      }

      // Extract price correctly - ensure it's in cents
      let price = 0;
      let salePrice = null;
      
      if (product?.variants && product.variants.length > 0) {
        const firstVariant = product.variants[0];
        // Shopify prices are always in cents in JSON API
        // Ensure we're getting the raw price value, not a formatted string
        if (firstVariant.price !== undefined && firstVariant.price !== null) {
          price = typeof firstVariant.price === 'number' ? firstVariant.price : parseInt(String(firstVariant.price), 10) || 0;
        }
        if (firstVariant.compare_at_price !== undefined && firstVariant.compare_at_price !== null) {
          salePrice = typeof firstVariant.compare_at_price === 'number' ? firstVariant.compare_at_price : parseInt(String(firstVariant.compare_at_price), 10) || null;
        }
      } else if (product?.price !== undefined && product?.price !== null) {
        // Fallback: if no variants, try product.price
        // Shopify JSON API always uses cents
        price = typeof product.price === 'number' ? product.price : parseInt(String(product.price), 10) || 0;
        if (product.compare_at_price !== undefined && product.compare_at_price !== null) {
          salePrice = typeof product.compare_at_price === 'number' ? product.compare_at_price : parseInt(String(product.compare_at_price), 10) || null;
        }
      }
      
      // Debug logging (can be removed in production)
      if (price > 0 && price < 1000) {
        console.warn('Wishlist: Price seems low:', price, 'cents for product:', product?.title, '- Expected price in cents (e.g., 50000 for $500)');
      }

      // Create wishlist item
      const wishlistItem = {
        id: String(productId),
        name: product?.title || 'Product',
        handle: product?.handle || '',
        url: product ? `/products/${product.handle}` : '',
        price: price, // Price in cents (Shopify format)
        salePrice: salePrice, // Compare price in cents
        images: normalizedImages,
        variants: product?.variants || [],
        options: product?.options || product?.options_with_values || [],
        colorDetails: colorOptions.length > 0 ? colorOptions : [],
        sizeDetails: sizeOptions,
        size: ''
      };

      wishlist.push(wishlistItem);
      saveWishlist(wishlist);
      updateWishlistCount();
    }

    // Remove product from wishlist
    function removeFromWishlist(productId) {
      const wishlist = getWishlist();
      const filtered = wishlist.filter(item => String(item.id) !== String(productId));
      saveWishlist(filtered);
      updateWishlistCount();
    }

    // Update wishlist count in header
    function updateWishlistCount() {
      const wishlist = getWishlist();
      const count = wishlist.length;
      const countElements = document.querySelectorAll('[data-wishlist-count]');
      countElements.forEach(el => {
        el.textContent = count;
        el.setAttribute('data-count', count);
        if (count === 0) {
          el.style.display = 'none';
        } else {
          el.style.display = 'flex';
        }
      });
    }
    
    // Make updateWishlistCount available globally
    window.updateWishlistCount = updateWishlistCount;

    // Update wishlist button state
    function updateWishlistButton(button, productId) {
      const isInList = isInWishlist(productId);
      if (isInList) {
        button.classList.add('is-active');
        const svg = button.querySelector('svg');
        if (svg) {
          svg.setAttribute('fill', '#ff0000');
          svg.setAttribute('stroke', '#ff0000');
        }
      } else {
        button.classList.remove('is-active');
        const svg = button.querySelector('svg');
        if (svg) {
          svg.setAttribute('fill', 'none');
          svg.setAttribute('stroke', 'currentColor');
        }
      }
    }

    // Initialize all wishlist buttons on page
    function initWishlistButtons() {
      const wishlistButtons = document.querySelectorAll('[data-wishlist-add], [data-wishlist-action], [data-wishlist-toggle]');
      wishlistButtons.forEach(button => {
        const productId = button.getAttribute('data-wishlist-add') || 
                         button.getAttribute('data-product-id') || 
                         button.closest('[data-product-id]')?.getAttribute('data-product-id');
        
        if (productId) {
          updateWishlistButton(button, productId);
        }
      });
    }

    // Handle wishlist button clicks
    document.addEventListener('click', async function(e) {
      const wishlistBtn = e.target.closest('[data-wishlist-add], [data-wishlist-action], [data-wishlist-toggle]');
      if (!wishlistBtn) return;

      e.preventDefault();
      e.stopPropagation();

      const productId = wishlistBtn.getAttribute('data-wishlist-add') || 
                       wishlistBtn.getAttribute('data-product-id') || 
                       wishlistBtn.closest('[data-product-id]')?.getAttribute('data-product-id');

      if (!productId) {
        console.warn('Product ID not found for wishlist button');
        return;
      }

      if (isInWishlist(productId)) {
        removeFromWishlist(productId);
        console.log('Removed from wishlist:', productId);
      } else {
        await addToWishlist(productId);
        console.log('Added to wishlist:', productId);
      }

      // Update wishlist count in header
      updateWishlistCount();

      // Update all wishlist buttons for this product
      const allButtons = document.querySelectorAll(`[data-wishlist-add="${productId}"], [data-product-id="${productId}"][data-wishlist-action], [data-product-id="${productId}"][data-wishlist-toggle]`);
      allButtons.forEach(btn => updateWishlistButton(btn, productId));
    });

    // Initialize buttons on page load
    initWishlistButtons();
    updateWishlistCount();

    // Listen for storage changes (for cross-tab updates)
    window.addEventListener('storage', function(e) {
      if (e.key === 'wishlist-storage') {
        updateWishlistCount();
        initWishlistButtons();
      }
    });

    // Re-initialize when new content is loaded (for dynamic content)
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length) {
          initWishlistButtons();
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /* FAQ Accordion */
  function initFAQ() {
    const faqSection = document.querySelector('.faq-section');
    if (!faqSection) return;
    
    const faqQuestions = faqSection.querySelectorAll('[data-faq-toggle]');
    
    if (!faqQuestions.length) return;
    
    // Add click handler to each question
    faqQuestions.forEach((question) => {
      question.addEventListener('click', function(e) {
        e.preventDefault();
        
        const clickedItem = this.closest('.faq-section__item');
        if (!clickedItem) return;
        
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        
        // Close all other FAQs (accordion behavior - only one open at a time)
        faqQuestions.forEach(otherQuestion => {
          if (otherQuestion !== this) {
            const otherItem = otherQuestion.closest('.faq-section__item');
            if (otherItem) {
              otherQuestion.setAttribute('aria-expanded', 'false');
              otherItem.classList.remove('faq-section__item--active');
            }
          }
        });
        
        // Toggle current FAQ
        if (isExpanded) {
          this.setAttribute('aria-expanded', 'false');
          clickedItem.classList.remove('faq-section__item--active');
        } else {
          this.setAttribute('aria-expanded', 'true');
          clickedItem.classList.add('faq-section__item--active');
        }
      });
    });
  }

  /* Section Carousel (Premium Materials, Tailored Fit, USA Fulfillment) */
  function initSectionCarousel() {
    // Slide data from the provided code
    const slides = [
      {
        id: 1,
        title: "UNMATCHED CRAFTSMANSHIP",
        description: "Hours of artisan detail go into every jacket. From reinforced stitching to premium hardware, we build jackets that stand the test of time.",
        features: [
          "Reinforced stitching techniques",
          "Premium YKK zippers",
          "Quality lining materials",
          "Artisan-level attention to detail"
        ],
        imageUrl: "https://www.fineystjackets.com/uploads/2025/product/craftmanship_banner_2.webp"
      },
      {
        id: 3,
        title: "PREMIUM MATERIALS",
        description: "We don't mass-produce. We craft. Every FINEYST jacket starts with ethically sourced full-grain leather, precision cuts, and hours of artisan detail.",
        features: [
          "Ethically sourced full-grain leather",
          "Premium lambskin and suede options",
          "Distressed finishes for authentic look",
          "Quality tested for durability"
        ],
        imageUrl: window.Shopify?.routes?.root_url ? window.Shopify.routes.root_url + "assets/option_1.webp" : "/assets/option_1.webp"
      },
      {
        id: 2,
        title: "TAILORED FIT",
        description: "Whether you're buying a ready-to-wear bomber or designing a custom jacket from scratch, you're investing in precision-crafted fit.",
        features: [
          "Standard sizes available",
          "Made-to-measure options",
          "Perfect fit guarantee",
          "Custom sizing consultations"
        ],
        imageUrl: "https://www.fineystjackets.com/uploads/2025/product/Tailored_fit_section_1.webp"
      },
      {
        id: 4,
        title: "USA FULFILLMENT",
        description: "Fast, reliable shipping with hassle-free returns. We stand behind every jacket we make with comprehensive customer support.",
        features: [
          "Free shipping",
          "24-48 hour processing",
          "14-day easy returns",
          "Dedicated customer support"
        ],
        imageUrl: window.Shopify?.routes?.root_url ? window.Shopify.routes.root_url + "assets/usa_fulfillment_banner.webp" : "/assets/usa_fulfillment_banner.webp"
      }
    ];

    let currentIndex = 0;

    // Update all sections with slide content
    function updateAllSections(slide) {
      // Update titles
      const titles = document.querySelectorAll('.slider-content-title');
      titles.forEach(title => {
        title.textContent = slide.title;
      });

      // Update descriptions
      const descriptions = document.querySelectorAll('.slider-content-description');
      descriptions.forEach(desc => {
        desc.textContent = slide.description;
      });

      // Update features
      const featuresLists = document.querySelectorAll('.slider-content-features');
      featuresLists.forEach(list => {
        const existingItems = list.querySelectorAll('li');
        const firstItem = existingItems[0];
        const baseClassName = firstItem ? firstItem.className : '';
        
        list.innerHTML = '';
        slide.features.forEach(feature => {
          const listItem = document.createElement('li');
          listItem.className = baseClassName;
          listItem.textContent = feature;
          list.appendChild(listItem);
        });
      });

      // Update images
      const images = document.querySelectorAll('.slider-content-image');
      images.forEach(img => {
        if (img.tagName === 'IMG') {
          img.src = slide.imageUrl;
          img.alt = slide.title;
        }
      });
    }

    // Update pagination dots
    function updatePagination(index) {
      const allDots = document.querySelectorAll('.section-carousel-dot');
      allDots.forEach((dot) => {
        const dotIndex = parseInt(dot.getAttribute('data-index') || '0', 10);
        if (dotIndex === index) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }

    // Navigation handlers
    function handlePrev() {
      currentIndex = currentIndex > 0 ? currentIndex - 1 : slides.length - 1;
      updateAllSections(slides[currentIndex]);
      updatePagination(currentIndex);
    }

    function handleNext() {
      currentIndex = currentIndex < slides.length - 1 ? currentIndex + 1 : 0;
      updateAllSections(slides[currentIndex]);
      updatePagination(currentIndex);
    }

    function goToSlide(index) {
      if (index >= 0 && index < slides.length) {
        currentIndex = index;
        updateAllSections(slides[currentIndex]);
        updatePagination(currentIndex);
      }
    }

    // Attach event listeners using event delegation
    document.addEventListener('click', function(e) {
      const prevBtn = e.target.closest('.section-carousel-prev');
      const nextBtn = e.target.closest('.section-carousel-next');
      const dot = e.target.closest('.section-carousel-dot');

      if (prevBtn) {
        e.preventDefault();
        e.stopPropagation();
        handlePrev();
      } else if (nextBtn) {
        e.preventDefault();
        e.stopPropagation();
        handleNext();
      } else if (dot) {
        e.preventDefault();
        e.stopPropagation();
        const dotIndex = parseInt(dot.getAttribute('data-index') || '0', 10);
        goToSlide(dotIndex);
      }
    });

    // Initialize with first slide
    updateAllSections(slides[currentIndex]);
    updatePagination(currentIndex);
  }
  
  