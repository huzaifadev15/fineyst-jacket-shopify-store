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
  
    if (!menuToggle || !mobileMenu) return;
  
    menuToggle.addEventListener('click', function() {
      const isActive = mobileMenu.classList.toggle('is-active');
      menuToggle.setAttribute('aria-expanded', isActive);
      document.body.style.overflow = isActive ? 'hidden' : '';
    });
  
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
    // Get wishlist from localStorage
    function getWishlist() {
      try {
        const wishlist = localStorage.getItem('wishlist');
        return wishlist ? JSON.parse(wishlist) : [];
      } catch (e) {
        return [];
      }
    }

    // Save wishlist to localStorage
    function saveWishlist(wishlist) {
      try {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
      } catch (e) {
        console.error('Error saving wishlist:', e);
      }
    }

    // Check if product is in wishlist
    function isInWishlist(productId) {
      const wishlist = getWishlist();
      return wishlist.includes(String(productId));
    }

    // Add product to wishlist
    function addToWishlist(productId) {
      const wishlist = getWishlist();
      if (!wishlist.includes(String(productId))) {
        wishlist.push(String(productId));
        saveWishlist(wishlist);
      }
    }

    // Remove product from wishlist
    function removeFromWishlist(productId) {
      const wishlist = getWishlist();
      const index = wishlist.indexOf(String(productId));
      if (index > -1) {
        wishlist.splice(index, 1);
        saveWishlist(wishlist);
      }
    }

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
    document.addEventListener('click', function(e) {
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
        addToWishlist(productId);
        console.log('Added to wishlist:', productId);
      }

      // Update all wishlist buttons for this product
      const allButtons = document.querySelectorAll(`[data-wishlist-add="${productId}"], [data-product-id="${productId}"][data-wishlist-action], [data-product-id="${productId}"][data-wishlist-toggle]`);
      allButtons.forEach(btn => updateWishlistButton(btn, productId));
    });

    // Initialize buttons on page load
    initWishlistButtons();

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
  
  