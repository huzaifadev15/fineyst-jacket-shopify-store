/* ============================================
   FINEYST JACKETS - GLOBAL JAVASCRIPT
   ============================================ */

   document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initHeader();
    initMobileMenu();
    initMegaMenu();
    initSearch();
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
    initNavigationOverlay();
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

  /* Search Modal */
  function initSearch() {
    const searchToggle = document.querySelector('[data-search-toggle]');
    if (!searchToggle) return;

    let searchModal = createSearchModal();
    document.body.appendChild(searchModal);

    const searchOverlay = searchModal.querySelector('[data-search-overlay]');
    const searchInput = searchModal.querySelector('[data-search-input]');
    const searchResults = searchModal.querySelector('[data-search-results]');
    const searchClear = searchModal.querySelector('[data-search-clear]');
    const suggestionsContainer = searchModal.querySelector('[data-search-suggestions]');
    const searchClose = searchModal.querySelector('[data-search-close]');
    const trendingTags = searchModal.querySelectorAll('[data-trending-tag]');
    const trendingSection = searchModal.querySelector('.search-modal__trending');
    const resultsSection = searchModal.querySelector('.search-modal__results');

    searchToggle.addEventListener('click', function(e) {
      e.preventDefault();
      searchModal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      setTimeout(() => searchInput.focus(), 100);
    });

    function closeSearch() {
      searchModal.classList.remove('is-open');
      document.body.style.overflow = '';
      searchInput.value = '';
      searchResults.innerHTML = '';
      if (suggestionsContainer) suggestionsContainer.innerHTML = '';
      searchClear.style.display = 'none';
      if (trendingSection) trendingSection.style.display = 'block';
      if (resultsSection) resultsSection.style.display = 'none';
    }

    searchOverlay.addEventListener('click', closeSearch);
    if (searchClose) {
      searchClose.addEventListener('click', closeSearch);
    }

    // Trending tags functionality
    trendingTags.forEach(tag => {
      tag.addEventListener('click', function() {
        const tagText = this.getAttribute('data-trending-tag');
        searchInput.value = tagText;
        searchInput.dispatchEvent(new Event('input'));
        this.classList.add('is-active');
        trendingTags.forEach(t => {
          if (t !== this) t.classList.remove('is-active');
        });
      });
    });

    // Clear button functionality
    searchClear.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      searchInput.value = '';
      searchInput.focus();
      searchResults.innerHTML = '';
      suggestionsContainer.innerHTML = '';
      searchClear.style.display = 'none';
    });

    // Show/hide clear button based on input
    searchInput.addEventListener('input', function() {
      if (this.value.trim().length > 0) {
        searchClear.style.display = 'flex';
      } else {
        searchClear.style.display = 'none';
      }
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && searchModal.classList.contains('is-open')) {
        closeSearch();
      }
    });

    let searchTimeout;
    searchInput.addEventListener('input', function() {
      clearTimeout(searchTimeout);
      const query = this.value.trim();
      
      if (query.length > 2) {
        if (trendingSection) trendingSection.style.display = 'none';
        if (resultsSection) resultsSection.style.display = 'flex';
        searchTimeout = setTimeout(() => performSearch(query, searchResults, suggestionsContainer, searchInput), 300);
      } else {
        searchResults.innerHTML = '';
        if (suggestionsContainer) suggestionsContainer.innerHTML = '';
        if (trendingSection) trendingSection.style.display = 'block';
        if (resultsSection) resultsSection.style.display = 'none';
      }
    });
  }

  function createSearchModal() {
    const modal = document.createElement('div');
    modal.className = 'search-modal';
    modal.innerHTML = `
      <div class="search-modal__overlay" data-search-overlay></div>
      <div class="search-modal__content">
        <div class="search-modal__header">
          <div class="search-modal__input-wrapper">
            <svg class="search-modal__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input type="search" class="search-modal__input" placeholder="What are you looking for today?" data-search-input>
            <button class="search-modal__clear" data-search-clear style="display: none;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <button class="search-modal__close" data-search-close>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="search-modal__body">
          <div class="search-modal__trending">
            <div class="search-modal__trending-header">
              <svg class="search-modal__trending-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                <polyline points="17 6 23 6 23 12"></polyline>
              </svg>
              <h3>TRENDING SEARCHES</h3>
            </div>
            <div class="search-modal__trending-tags" data-trending-tags>
              <button class="trending-tag" data-trending-tag="running">RUNNING</button>
              <button class="trending-tag" data-trending-tag="lifting straps">LIFTING STRAPS</button>
              <button class="trending-tag" data-trending-tag="hoodie">HOODIE</button>
              <button class="trending-tag" data-trending-tag="leggings">LEGGINGS</button>
            </div>
          </div>
          <div class="search-modal__results" style="display: none;">
            <div class="search-modal__suggestions">
              <h3>SUGGESTIONS</h3>
              <div class="search-suggestions" data-search-suggestions></div>
            </div>
            <div class="search-modal__products">
              <h3>PRODUCTS</h3>
              <div class="search-products" data-search-results></div>
            </div>
          </div>
        </div>
      </div>
    `;
    return modal;
  }

  function performSearch(query, resultsContainer, suggestionsContainer, searchInput) {
    // Generate suggestions based on query
    const queryLower = query.toLowerCase();
    const suggestions = [];
    
    // Create suggestions based on the search term
    if (queryLower.includes('hoodie') || queryLower.includes('hood')) {
      suggestions.push(`<div class="suggestion-item"><strong>Hoodies</strong> Mens Hoodie</div>`);
      suggestions.push(`<div class="suggestion-item"><strong>Hoodies</strong> Women Hoodies</div>`);
      suggestions.push(`<div class="suggestion-item"><strong>Hoodies</strong> For Men</div>`);
    } else if (queryLower.includes('jacket')) {
      suggestions.push(`<div class="suggestion-item"><strong>Jackets</strong> Mens Jacket</div>`);
      suggestions.push(`<div class="suggestion-item"><strong>Jackets</strong> Women <strong>Jackets</strong></div>`);
      suggestions.push(`<div class="suggestion-item"><strong>Jackets</strong> For Men</div>`);
    } else {
      // Generic suggestions
      const capitalized = query.charAt(0).toUpperCase() + query.slice(1);
      suggestions.push(`<div class="suggestion-item"><strong>${capitalized}</strong> Mens ${capitalized}</div>`);
      suggestions.push(`<div class="suggestion-item"><strong>${capitalized}</strong> Women <strong>${capitalized}</strong></div>`);
      suggestions.push(`<div class="suggestion-item"><strong>${capitalized}</strong> For Men</div>`);
    }
    
    suggestionsContainer.innerHTML = suggestions.join('');
    
    // Add click handlers to suggestions
    if (searchInput) {
      suggestionsContainer.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', function() {
          const suggestionText = this.textContent.trim();
          searchInput.value = suggestionText;
          searchInput.dispatchEvent(new Event('input'));
        });
      });
    }
    
    // First, try to get product handles from search, then fetch full product data from products.json
    Promise.all([
      fetch(`/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product&resources[limit]=10`).catch(() => null),
      fetch('/products.json?limit=250').catch(() => null)
    ])
      .then(([searchResponse, productsResponse]) => {
        // Get all products from products.json
        if (!productsResponse || !productsResponse.ok) {
          throw new Error('Failed to fetch products');
        }
        
        return productsResponse.json().then(productsData => {
          let matchingProducts = [];
          
          // If we have search results, use them to filter
          if (searchResponse && searchResponse.ok) {
            return searchResponse.json().then(searchData => {
              if (searchData.resources && searchData.resources.results && searchData.resources.results.products) {
                const searchHandles = searchData.resources.results.products.map(p => p.handle || p.url?.split('/products/')[1]?.split('?')[0]).filter(Boolean);
                matchingProducts = productsData.products.filter(p => {
                  return searchHandles.includes(p.handle) || 
                         p.title.toLowerCase().includes(query.toLowerCase()) ||
                         p.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
                });
              } else {
                // Fallback: search in all products
                matchingProducts = productsData.products.filter(p => {
                  return p.title.toLowerCase().includes(query.toLowerCase()) ||
                         p.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
                });
              }
              
              return matchingProducts.slice(0, 4).map(product => {
                // Get featured image - use first image from images array
                let imageUrl = '';
                if (product.images && product.images.length > 0) {
                  const img = product.images[0];
                  if (typeof img === 'string') {
                    imageUrl = img;
                  } else if (img.src) {
                    imageUrl = img.src;
                  } else if (img.url) {
                    imageUrl = img.url;
                  }
                  
                  // Ensure full URL
                  if (imageUrl) {
                    if (imageUrl.startsWith('//')) {
                      imageUrl = 'https:' + imageUrl;
                    } else if (imageUrl.startsWith('/')) {
                      imageUrl = window.location.origin + imageUrl;
                    }
                    // Add width parameter for optimization
                    if (imageUrl.includes('cdn.shopify.com')) {
                      imageUrl = imageUrl.replace(/\?.*$/, '') + '?width=600';
                    }
                  }
                }
                
                // Get price from variants
                const variant = product.variants && product.variants.length > 0 ? product.variants[0] : null;
                if (!variant) {
                  return {
                    image: imageUrl || 'https://via.placeholder.com/300x400/f0f0f0/999?text=No+Image',
                    title: product.title || 'Product',
                    price: 'Rs 0',
                    comparePrice: null,
                    fit: 'Regular Fit',
                    color: 'Black',
                    url: productUrl,
                    rating: (Math.random() * 1.1 + 3.9).toFixed(1)
                  };
                }
                
                // Prices are already in rupees (no conversion needed)
                const price = typeof variant.price === 'number' ? variant.price : parseInt(String(variant.price || 0), 10);
                const comparePrice = variant.compare_at_price && variant.compare_at_price > variant.price
                  ? (typeof variant.compare_at_price === 'number' ? variant.compare_at_price : parseInt(String(variant.compare_at_price || 0), 10))
                  : null;
                
                // Format price with commas - prices are already in rupees
                const priceNumber = Math.floor(price);
                const formattedPrice = `Rs ${priceNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
                
                const comparePriceNumber = comparePrice ? Math.floor(comparePrice) : null;
                const formattedComparePrice = comparePriceNumber 
                  ? `Rs ${comparePriceNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                  : null;
                
                // Extract fit and color
                let fit = 'Regular Fit';
                let color = 'Black';
                const titleLower = product.title.toLowerCase();
                
                if (titleLower.includes('slim')) fit = 'Slim Fit';
                if (titleLower.includes('oversized')) fit = 'Oversized Fit';
                
                const colorKeywords = ['black', 'white', 'gray', 'grey', 'red', 'blue', 'green', 'brown', 'beige', 'navy'];
                for (const keyword of colorKeywords) {
                  if (titleLower.includes(keyword)) {
                    color = keyword.charAt(0).toUpperCase() + keyword.slice(1);
                    break;
                  }
                }
                
                // Get product URL
                const productUrl = product.url ? (product.url.startsWith('/') ? window.location.origin + product.url : product.url) : '#';
                
                return {
                  image: imageUrl || 'https://via.placeholder.com/300x400/f0f0f0/999?text=No+Image',
                  title: product.title || 'Product',
                  price: formattedPrice,
                  comparePrice: formattedComparePrice,
                  fit: fit,
                  color: color,
                  url: productUrl,
                  rating: (Math.random() * 1.1 + 3.9).toFixed(1)
                };
              });
            });
          } else {
            // No search API, filter directly from products.json
            matchingProducts = productsData.products.filter(p => {
              return p.title.toLowerCase().includes(query.toLowerCase()) ||
                     p.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
            });
            
            return matchingProducts.slice(0, 4).map(product => {
              // Get featured image
              let imageUrl = '';
              if (product.images && product.images.length > 0) {
                const img = product.images[0];
                if (typeof img === 'string') {
                  imageUrl = img;
                } else if (img.src) {
                  imageUrl = img.src;
                } else if (img.url) {
                  imageUrl = img.url;
                }
                
                if (imageUrl) {
                  if (imageUrl.startsWith('//')) {
                    imageUrl = 'https:' + imageUrl;
                  } else if (imageUrl.startsWith('/')) {
                    imageUrl = window.location.origin + imageUrl;
                  }
                  if (imageUrl.includes('cdn.shopify.com')) {
                    imageUrl = imageUrl.replace(/\?.*$/, '') + '?width=600';
                  }
                }
              }
              
              const variant = product.variants && product.variants.length > 0 ? product.variants[0] : null;
              if (!variant) {
                return {
                  image: imageUrl || 'https://via.placeholder.com/300x400/f0f0f0/999?text=No+Image',
                  title: product.title || 'Product',
                  price: 'Rs 0',
                  comparePrice: null,
                  fit: 'Regular Fit',
                  color: 'Black',
                  url: productUrl,
                  rating: (Math.random() * 1.1 + 3.9).toFixed(1)
                };
              }
              
              // Prices are already in rupees (no conversion needed)
              const price = typeof variant.price === 'number' ? variant.price : parseInt(String(variant.price || 0), 10);
              const comparePrice = variant.compare_at_price && variant.compare_at_price > variant.price
                ? (typeof variant.compare_at_price === 'number' ? variant.compare_at_price : parseInt(String(variant.compare_at_price || 0), 10))
                : null;
              
              // Format price with commas - prices are already in rupees
              const priceNumber = Math.floor(price);
              const formattedPrice = `Rs ${priceNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
              
              const comparePriceNumber = comparePrice ? Math.floor(comparePrice) : null;
              const formattedComparePrice = comparePriceNumber 
                ? `Rs ${comparePriceNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                : null;
              
              let fit = 'Regular Fit';
              let color = 'Black';
              const titleLower = product.title.toLowerCase();
              
              if (titleLower.includes('slim')) fit = 'Slim Fit';
              if (titleLower.includes('oversized')) fit = 'Oversized Fit';
              
              const colorKeywords = ['black', 'white', 'gray', 'grey', 'red', 'blue', 'green', 'brown', 'beige', 'navy'];
              for (const keyword of colorKeywords) {
                if (titleLower.includes(keyword)) {
                  color = keyword.charAt(0).toUpperCase() + keyword.slice(1);
                  break;
                }
              }
              
              const productUrl = product.url ? (product.url.startsWith('/') ? window.location.origin + product.url : product.url) : '#';
              
              return {
                image: imageUrl || 'https://via.placeholder.com/300x400/f0f0f0/999?text=No+Image',
                title: product.title || 'Product',
                price: formattedPrice,
                comparePrice: formattedComparePrice,
                fit: fit,
                color: color,
                url: productUrl,
                rating: (Math.random() * 1.1 + 3.9).toFixed(1)
              };
            });
          }
        });
      })
      .then(products => {
        if (!products || products.length === 0) {
          resultsContainer.innerHTML = '<div class="search-empty">No products found</div>';
          return;
        }
        
        const productsHTML = products.map(product => `
          <a href="${product.url}" class="product-item">
            <div class="product-item__image-wrapper">
              <img src="${product.image}" alt="${product.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/300x400/f0f0f0/999?text=No+Image'; this.onerror=null;">
              <button class="product-wishlist" onclick="event.preventDefault(); event.stopPropagation();">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
            </div>
            <div class="product-info">
              ${product.rating ? `<div class="product-rating">★${product.rating}</div>` : ''}
              <h4>${product.title}</h4>
              <p class="product-fit">${product.fit}</p>
              <p class="product-color">Color: ${product.color}</p>
              <div class="product-price">
                ${product.comparePrice ? `<span class="product-price__original">${product.comparePrice}</span>` : ''}
                <span>${product.price}</span>
              </div>
            </div>
          </a>
        `).join('');
        
        resultsContainer.innerHTML = productsHTML;
        
        // Add "View all" link if there are products
        if (products.length > 0) {
          const viewAllLink = document.createElement('a');
          viewAllLink.href = `/search?q=${encodeURIComponent(query)}&type=product`;
          viewAllLink.className = 'view-all-link';
          viewAllLink.textContent = `View all '${query}'`;
          resultsContainer.appendChild(viewAllLink);
        }
      })
      .catch(() => {
        resultsContainer.innerHTML = '<div class="search-error">Search failed</div>';
      });
  }
  function initMegaMenu() {
    const navItems = document.querySelectorAll('[data-mega-menu]');
    const megaMenus = document.querySelectorAll('[data-mega-menu-panel]');
    const closeButtons = document.querySelectorAll('[data-mega-menu-close]');
    let activeMenu = null;

    if (!navItems.length || !megaMenus.length) return;

    // Handle click on all screen sizes
    navItems.forEach(item => {
      const menuType = item.dataset.megaMenu;
      const megaMenu = document.querySelector(`[data-mega-menu-panel="${menuType}"]`);
      const navLink = item.querySelector('.site-header__nav-link');

      if (!megaMenu) return;

      // Click to toggle menu (works on all screen sizes)
      navLink.addEventListener('click', function(e) {
        e.preventDefault();
        if (activeMenu === megaMenu) {
          closeMenu(megaMenu, item);
        } else {
          closeAllMenus();
          openMenu(megaMenu, item);
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

    // Close on outside click (works on all screen sizes)
    document.addEventListener('click', function(e) {
      const clickedInside = e.target.closest('.site-header__nav-item--has-mega-menu') || 
                           e.target.closest('.mega-menu');
      if (!clickedInside && activeMenu) {
        const navItem = document.querySelector(`[data-mega-menu="${activeMenu.dataset.megaMenuPanel}"]`);
        if (navItem) {
          closeMenu(activeMenu, navItem);
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

    // Handle window resize - close menus on resize
    window.addEventListener('resize', function() {
      closeAllMenus();
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
      const isCartPage = window.location.pathname.includes('/cart');
      if (isCartPage) return;
      
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
    
    // Show loading overlay
    showCartLoadingOverlay();
    
    // Convert variant ID to number if it's a string
    const numericVariantId = typeof variantId === 'string' ? parseInt(variantId, 10) : variantId;
    
    if (isNaN(numericVariantId)) {
      console.error('Variant ID is not a valid number:', variantId);
      alert('Invalid product variant. Please try again.');
      hideCartLoadingOverlay();
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
      hideCartLoadingOverlay();
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
            
            // Hide loading overlay
            hideCartLoadingOverlay();
            
            // Return null to skip the success handler
            return null;
          }).catch(() => {
            // If JSON parse fails, still open cart
            openCartSidebar();
            loadCartSidebar();
            alert('This item is already in your cart at maximum quantity.');
            hideCartLoadingOverlay();
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
        
        // Hide loading overlay
        hideCartLoadingOverlay();
      } else {
        // Fallback: try to load cart
        console.log('No cart data in response, fetching cart...');
        openCartSidebar();
        setTimeout(() => {
          loadCartSidebar();
          hideCartLoadingOverlay();
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
      
      // Hide loading overlay
      hideCartLoadingOverlay();
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

    // Discount code handler
    const discountInput = sidebar.querySelector('[data-cart-sidebar-discount-input]');
    const discountApplyBtn = sidebar.querySelector('[data-cart-sidebar-discount-apply]');
    const discountMessage = sidebar.querySelector('[data-cart-sidebar-discount-message]');
    
    if (discountInput && discountApplyBtn) {
      const showDiscountMessage = function(message, type) {
        if (!discountMessage) return;
        discountMessage.textContent = message;
        discountMessage.className = 'cart-sidebar__discount-message';
        discountMessage.classList.add('cart-sidebar__discount-message--' + (type || 'info'));
        discountMessage.style.display = 'block';
        
        if (type === 'success') {
          setTimeout(() => {
            discountMessage.style.display = 'none';
          }, 3000);
        }
      };

      const applyDiscount = function(e) {
        // Prevent default behavior and stop event propagation
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        
        const code = discountInput.value.trim();
        if (!code) {
          showDiscountMessage('Please enter a discount code', 'error');
          return;
        }

        // Show loading state
        discountApplyBtn.disabled = true;
        discountApplyBtn.style.opacity = '0.6';
        discountMessage.style.display = 'none';

        // Get current cart to compare
        const cartUrl = window.routes.cart_url + '.js';
        
        fetch(cartUrl)
          .then(response => response.json())
          .then(originalCart => {
            const originalTotal = parseFloat(originalCart.total_price || 0);
            const originalDiscounts = originalCart.discount_applications || [];
            const originalDiscountCodes = originalDiscounts.map(d => (d.code || '').toLowerCase());
            
            // Apply discount code using hidden iframe
            const iframe = document.createElement('iframe');
            iframe.style.position = 'absolute';
            iframe.style.left = '-9999px';
            iframe.style.width = '1px';
            iframe.style.height = '1px';
            iframe.style.border = 'none';
            iframe.name = 'discount-iframe-' + Date.now();
            
            const form = document.createElement('form');
            form.method = 'GET';
            form.action = '/discount/' + encodeURIComponent(code);
            form.target = iframe.name;
            form.style.display = 'none';
            
            document.body.appendChild(iframe);
            document.body.appendChild(form);
            form.submit();
            
            // Function to check if discount was applied
            const checkDiscountApplied = function(attempt = 1) {
              return fetch(cartUrl)
                .then(response => response.json())
                .then(newCart => {
                  const newTotal = parseFloat(newCart.total_price || 0);
                  const newDiscounts = newCart.discount_applications || [];
                  const newDiscountCodes = newDiscounts.map(d => (d.code || '').toLowerCase());
                  
                  // Check if our code is in the discount applications
                  const codeLower = code.toLowerCase();
                  const discountCodeApplied = newDiscountCodes.includes(codeLower);
                  
                  // Check if total decreased (discount applied)
                  const totalDecreased = newTotal < originalTotal && Math.abs(originalTotal - newTotal) > 1;
                  
                  // Check if new discounts were added
                  const hasNewDiscount = newDiscounts.length > originalDiscounts.length;
                  
                  if (discountCodeApplied || (totalDecreased && hasNewDiscount)) {
                    // Success!
                    showDiscountMessage('Discount code applied successfully!', 'success');
                    discountInput.value = '';
                    loadCartSidebar();
                    discountApplyBtn.disabled = false;
                    discountApplyBtn.style.opacity = '1';
                    
                    // Clean up
                    if (document.body.contains(iframe)) {
                      document.body.removeChild(iframe);
                    }
                    if (document.body.contains(form)) {
                      document.body.removeChild(form);
                    }
                    return true;
                  } else if (attempt < 3) {
                    // Try again after a delay
                    return new Promise(resolve => {
                      setTimeout(() => {
                        checkDiscountApplied(attempt + 1).then(resolve);
                      }, 1000);
                    });
                  } else {
                    // Failed after all attempts
                    showDiscountMessage('Invalid discount code. Please check and try again.', 'error');
                    discountApplyBtn.disabled = false;
                    discountApplyBtn.style.opacity = '1';
                    
                    // Clean up
                    if (document.body.contains(iframe)) {
                      document.body.removeChild(iframe);
                    }
                    if (document.body.contains(form)) {
                      document.body.removeChild(form);
                    }
                    return false;
                  }
                })
                .catch(error => {
                  console.error('Error checking cart:', error);
                  if (attempt < 3) {
                    return new Promise(resolve => {
                      setTimeout(() => {
                        checkDiscountApplied(attempt + 1).then(resolve);
                      }, 1000);
                    });
                  } else {
                    showDiscountMessage('Error applying discount code. Please try again.', 'error');
                    discountApplyBtn.disabled = false;
                    discountApplyBtn.style.opacity = '1';
                    
                    // Clean up
                    if (document.body.contains(iframe)) {
                      document.body.removeChild(iframe);
                    }
                    if (document.body.contains(form)) {
                      document.body.removeChild(form);
                    }
                    return false;
                  }
                });
            };
            
            // Start checking after a short delay
            setTimeout(() => {
              checkDiscountApplied();
            }, 1500);
          })
          .catch(error => {
            console.error('Error getting original cart:', error);
            showDiscountMessage('Error applying discount code. Please try again.', 'error');
            discountApplyBtn.disabled = false;
            discountApplyBtn.style.opacity = '1';
          });
      };

      // Prevent clicks on discount section from closing sidebar
      const discountSection = sidebar.querySelector('[data-cart-sidebar-discount]');
      if (discountSection) {
        discountSection.addEventListener('click', function(e) {
          e.stopPropagation();
        });
      }
      
      discountApplyBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        applyDiscount(e);
        return false;
      });
      
      discountInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          applyDiscount(e);
          return false;
        }
      });
      
      discountInput.addEventListener('click', function(e) {
        e.stopPropagation();
      });
    }

    // Quantity update handlers
    sidebar.addEventListener('click', function(e) {
      const minusBtn = e.target.closest('[data-cart-quantity-minus]');
      const plusBtn = e.target.closest('[data-cart-quantity-plus]');
      const removeBtn = e.target.closest('[data-cart-remove]');

      if (minusBtn) {
        e.preventDefault();
        e.stopPropagation();
        const key = minusBtn.dataset.cartQuantityMinus;
        const cartItem = minusBtn.closest('[data-cart-item-key]');
        const input = cartItem ? cartItem.querySelector('[data-cart-quantity-input]') : null;
        if (input) {
          const currentQty = parseInt(input.value) || 1;
          if (currentQty > 1) {
            input.setAttribute('data-prev-value', currentQty);
            updateCartItem(key, currentQty - 1);
          }
        }
      }

      if (plusBtn) {
        e.preventDefault();
        e.stopPropagation();
        const key = plusBtn.dataset.cartQuantityPlus;
        const cartItem = plusBtn.closest('[data-cart-item-key]');
        const input = cartItem ? cartItem.querySelector('[data-cart-quantity-input]') : null;
        if (input) {
          const currentQty = parseInt(input.value) || 1;
          input.setAttribute('data-prev-value', currentQty);
          updateCartItem(key, currentQty + 1);
        }
      }

      if (removeBtn) {
        e.preventDefault();
        e.stopPropagation();
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
    // Ensure cents is a valid number
    const amount = typeof cents === 'number' ? cents : parseInt(cents, 10) || 0;
    
    if (typeof Shopify !== 'undefined' && Shopify.formatMoney) {
      return Shopify.formatMoney(amount);
    }
    // Fallback formatting
    return 'Rs ' + (amount / 100).toLocaleString('en-IN');
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
    // Ensure cart and total_price are valid
    if (!cart) {
      console.error('Cart is undefined in updateCartSubtotal');
      return;
    }
    
    const totalPrice = cart.total_price || 0;
    const priceValue = typeof totalPrice === 'number' 
      ? totalPrice 
      : (typeof totalPrice === 'string' ? parseInt(totalPrice, 10) : 0) || 0;
    
    const subtotalEl = document.querySelector('[data-cart-sidebar-subtotal]');
    if (subtotalEl) {
      subtotalEl.textContent = formatMoney(priceValue);
    }
    
    const totalEl = document.querySelector('[data-cart-sidebar-total]');
    if (totalEl) {
      totalEl.textContent = formatMoney(priceValue);
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
    const sidebar = document.querySelector('[data-cart-sidebar]');
    const cartItem = sidebar ? sidebar.querySelector(`[data-cart-item-key="${key}"]`) : null;
    const input = cartItem ? cartItem.querySelector('[data-cart-quantity-input]') : null;
    const minusBtn = cartItem ? cartItem.querySelector('[data-cart-quantity-minus]') : null;
    const plusBtn = cartItem ? cartItem.querySelector('[data-cart-quantity-plus]') : null;
    const totalPriceEl = cartItem ? cartItem.querySelector('.cart-sidebar-item__total-price') : null;

    // Show loading overlay
    showCartLoadingOverlay();

    if (minusBtn) minusBtn.disabled = true;
    if (plusBtn) plusBtn.disabled = true;
    if (input) input.disabled = true;

    if (input) {
      input.value = '...';
    }
    if (totalPriceEl) {
      totalPriceEl.textContent = 'Updating...';
    }

    const cartUpdateUrl = window.routes.cart_update_url + '.js';
    
    const updates = {};
    const allInputs = sidebar ? sidebar.querySelectorAll('[data-cart-quantity-input]') : [];
    allInputs.forEach(inputEl => {
      const itemKey = inputEl.closest('[data-cart-item-key]')?.getAttribute('data-cart-item-key');
      if (itemKey) {
        if (itemKey === key) {
          updates[itemKey] = quantity;
        } else {
          const currentQty = parseInt(inputEl.value) || 1;
          updates[itemKey] = currentQty;
        }
      }
    });

    if (Object.keys(updates).length === 0) {
      fetch(window.routes.cart_url + '.js')
        .then(response => response.json())
        .then(cart => {
          if (cart && cart.items) {
            cart.items.forEach(item => {
              if (item.key === key) {
                updates[item.key] = quantity;
              } else {
                updates[item.key] = item.quantity;
              }
            });
          }
          return performCartUpdate(cartUpdateUrl, updates, key, quantity, input, totalPriceEl, minusBtn, plusBtn, cartItem, sidebar);
        })
        .catch(error => {
          console.error('Error loading cart for update:', error);
          handleCartSidebarError(error, input, totalPriceEl, minusBtn, plusBtn, sidebar);
        });
    } else {
      performCartUpdate(cartUpdateUrl, updates, key, quantity, input, totalPriceEl, minusBtn, plusBtn, cartItem, sidebar);
    }
  }

  function performCartUpdate(cartUpdateUrl, updates, key, quantity, input, totalPriceEl, minusBtn, plusBtn, cartItem, sidebar) {
    return fetch(cartUpdateUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        updates: updates
      })
    })
    .then(response => {
      if (!response.ok) {
        return response.text().then(text => {
          try {
            const errorData = JSON.parse(text);
            throw new Error(errorData.description || 'Cart update failed with status: ' + response.status);
          } catch (e) {
            throw new Error('Cart update failed with status: ' + response.status);
          }
        });
      }
      return response.json();
    })
    .then(cart => {
      if (!cart) {
        throw new Error('Invalid cart response');
      }

      if (quantity === 0) {
        if (cartItem) {
          cartItem.style.transition = 'opacity 0.3s ease';
          cartItem.style.opacity = '0';
          setTimeout(() => {
            cartItem.remove();
            
            const remainingItems = sidebar ? sidebar.querySelectorAll('[data-cart-item-key]') : [];
            if (remainingItems.length === 0) {
              const emptyContainer = sidebar ? sidebar.querySelector('[data-cart-sidebar-empty]') : null;
              const itemsContainer = sidebar ? sidebar.querySelector('[data-cart-sidebar-items]') : null;
              if (emptyContainer) emptyContainer.style.display = 'flex';
              if (itemsContainer) itemsContainer.innerHTML = '';
            }
          }, 300);
        }
      } else {
        if (cart.items && Array.isArray(cart.items)) {
          const updatedItem = cart.items.find(item => item.key === key);
          if (updatedItem) {
            if (input) {
              input.value = updatedItem.quantity;
            }
            if (totalPriceEl) {
              const linePrice = typeof updatedItem.line_price === 'number' 
                ? updatedItem.line_price 
                : parseInt(updatedItem.line_price, 10) || 0;
              totalPriceEl.textContent = 'Total Price: ' + formatMoney(linePrice);
            }
          } else {
            loadCartSidebar();
            return;
          }
        } else {
          loadCartSidebar();
          return;
        }
      }

      if (cart) {
        updateCartSubtotal(cart);
      }

      if (quantity > 0) {
        if (minusBtn) minusBtn.disabled = false;
        if (plusBtn) plusBtn.disabled = false;
        if (input) input.disabled = false;
      }

      updateCartCount();
      
      // Hide loading overlay
      hideCartLoadingOverlay();
    })
    .catch(error => {
      console.error('Error updating cart:', error);
      handleCartSidebarError(error, input, totalPriceEl, minusBtn, plusBtn, sidebar);
    });
  }

  function handleCartSidebarError(error, input, totalPriceEl, minusBtn, plusBtn, sidebar) {
    // Hide loading overlay
    hideCartLoadingOverlay();
    
    if (minusBtn) minusBtn.disabled = false;
    if (plusBtn) plusBtn.disabled = false;
    if (input) input.disabled = false;

    if (input && input.getAttribute('data-prev-value')) {
      input.value = input.getAttribute('data-prev-value');
    }
    if (totalPriceEl) {
      totalPriceEl.textContent = 'Error';
    }

    setTimeout(() => {
      loadCartSidebar();
    }, 500);
  }

  function removeCartItem(key) {
    // Show loading overlay immediately
    showCartLoadingOverlay();
    updateCartItem(key, 0);
  }
  
  /* Cart Loading Overlay */
  function showCartLoadingOverlay() {
    const sidebar = document.querySelector('[data-cart-sidebar]');
    const content = sidebar ? sidebar.querySelector('.cart-sidebar__content') : null;
    if (!content) return;
    
    let overlay = content.querySelector('.cart-loading-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'cart-loading-overlay';
      overlay.innerHTML = `
        <div class="cart-loading-spinner">
          <div class="cart-loading-spinner__circle"></div>
          <span class="cart-loading-spinner__text">Updating cart...</span>
        </div>
      `;
      content.appendChild(overlay);
    }
    
    overlay.classList.add('is-visible');
  }
  
  function hideCartLoadingOverlay() {
    const sidebar = document.querySelector('[data-cart-sidebar]');
    const content = sidebar ? sidebar.querySelector('.cart-sidebar__content') : null;
    if (!content) return;
    
    const overlay = content.querySelector('.cart-loading-overlay');
    if (overlay) {
      overlay.classList.remove('is-visible');
    }
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
  
    console.log('=== Variant Selection Handler Triggered ===');
    console.log('Select element:', e.target.id, 'Value:', e.target.value);
  
    const productJson = document.getElementById('ProductJson');
    if (!productJson) {
      console.error('ProductJson not found!');
      return;
    }
  
    const product = JSON.parse(productJson.textContent);
    const form = e.target.closest('form');
    const selects = form.querySelectorAll('[data-option-select]');
    
    console.log('Found', selects.length, 'select elements');
    
    // Get selected options
    const selectedOptions = Array.from(selects).map(select => {
      console.log('Select:', select.id, 'Value:', select.value);
      return select.value;
    });
    
    console.log('Selected options:', selectedOptions);
    
    // Find matching variant
    const variant = product.variants.find(v => {
      const matches = v.options.every((option, index) => option === selectedOptions[index]);
      if (matches) {
        console.log('Found matching variant:', v.id, 'Options:', v.options);
      }
      return matches;
    });
  
    if (variant) {
      console.log('Variant found:', variant.id, 'Color:', variant.option1);
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

      // Update label to show selected color
      const colorLabel = document.querySelector('.product-form__label');
      if (colorLabel && variant.option1) {
        const optionName = colorLabel.textContent.split(':')[0];
        colorLabel.textContent = optionName + ': ' + variant.option1.toUpperCase();
        console.log('Updated label to:', colorLabel.textContent);
      }

      // Update images based on variant
      console.log('Variant selected:', variant.id, 'Options:', variant.options);
      updateProductImages(variant, product);

      // Update URL
      const url = new URL(window.location.href);
      url.searchParams.set('variant', variant.id);
      window.history.replaceState({}, '', url);
    } else {
      console.error('No matching variant found for options:', selectedOptions);
      console.log('Available variants:', product.variants.map(v => ({ id: v.id, options: v.options })));
    }
  });

  /* Update Product Images Based on Variant */
  function updateProductImages(variant, product) {
    if (!variant || !product) {
      console.log('updateProductImages: Missing variant or product', { variant, product });
      return;
    }

    console.log('=== updateProductImages START ===');
    console.log('Variant ID:', variant.id);
    console.log('Variant options:', variant.options);
    console.log('Variant option1 (Color):', variant.option1);
    console.log('Product images count:', product.images ? product.images.length : 0);
    
    // Debug: Log all images
    if (product.images && product.images.length > 0) {
      console.log('All product images:');
      product.images.forEach((img, idx) => {
        // Get image URL - Shopify stores it in different ways
        let imgUrl = '';
        if (typeof img === 'string') {
          imgUrl = img;
        } else if (img.src) {
          imgUrl = img.src;
        } else if (img.id) {
          // Construct URL from image ID
          imgUrl = `https://cdn.shopify.com/s/files/1/${product.id}/products/${img.id}`;
        }
        
        console.log(`  Image ${idx}:`, {
          url: imgUrl ? imgUrl.substring(0, 60) + '...' : 'no url',
          alt: img.alt || 'no alt',
          variant_ids: img.variant_ids || 'no variant_ids',
          fullObject: img
        });
      });
    }

    // Get variant images - Shopify stores variant associations in image.variant_ids
    let variantImages = [];
    
    // Method 1: Check if images have variant_ids that include this variant
    if (product.images && product.images.length > 0) {
      const imagesWithVariant = product.images.filter(img => {
        // Shopify stores variant IDs in image.variant_ids array
        if (img.variant_ids && Array.isArray(img.variant_ids)) {
          return img.variant_ids.includes(variant.id);
        }
        return false;
      });
      
      if (imagesWithVariant.length > 0) {
        variantImages = imagesWithVariant.map(img => {
          // Extract URL from image object
          if (typeof img === 'string') return img;
          // Shopify stores image URL in different properties
          if (img.src) return img.src;
          if (img.url) return img.url;
          // Try to get from nested properties
          if (img.original && img.original.src) return img.original.src;
          // Last resort: construct from image ID (but this might not work without filename)
          console.warn('Image object has no src/url, trying to construct from ID:', img);
          return '';
        }).filter(url => url && typeof url === 'string');
        console.log('✓ Found', variantImages.length, 'images via variant_ids');
      }
    }
    
    // Method 2: If no variant-specific images, check variant's featured_image
    if (variantImages.length === 0 && variant.featured_image) {
      // featured_image can be an object or a string
      let featuredImgUrl = '';
      if (typeof variant.featured_image === 'string') {
        featuredImgUrl = variant.featured_image;
      } else if (variant.featured_image.src) {
        featuredImgUrl = variant.featured_image.src;
      } else if (variant.featured_image.id) {
        // Try to find the image in product.images by ID and get its URL from DOM
        const featuredImgId = variant.featured_image.id;
        // Try to find image in DOM by checking all product images
        const allProductImages = document.querySelectorAll('.product-gallery__image img, .product-gallery__carousel-slide img');
        allProductImages.forEach(domImg => {
          // Check if this DOM image matches the featured image ID
          // We can't directly match by ID, so we'll use a different approach
        });
        
        // Try to find in product.images array
        const featuredImg = product.images.find(img => img.id === featuredImgId);
        if (featuredImg) {
          // Try multiple ways to get URL
          featuredImgUrl = featuredImg.src || featuredImg.url || '';
          // If still no URL, try to get from DOM
          if (!featuredImgUrl) {
            // Get all current images from DOM and use the one at the position of this image
            const domImages = document.querySelectorAll('.product-gallery__image img, .product-gallery__carousel-slide img');
            const imgIndex = product.images.findIndex(img => img.id === featuredImgId);
            if (domImages[imgIndex]) {
              featuredImgUrl = domImages[imgIndex].src;
              console.log('Got image URL from DOM:', featuredImgUrl);
            }
          }
        }
      }
      
      if (featuredImgUrl) {
        variantImages = [featuredImgUrl];
        console.log('✓ Using variant featured_image');
      } else {
        console.log('✗ featured_image found but no URL extracted');
      }
    }
    
    // Method 3: Match images by color option in alt text
    if (variantImages.length === 0) {
      const colorOption = variant.option1 || (variant.options && variant.options[0]);
      
      if (colorOption && product.images) {
        const matchingImages = product.images.filter(img => {
          const imgAlt = (img.alt || '').toLowerCase().trim();
          const imgSrc = (img.src || '').toLowerCase();
          const colorLower = colorOption.toLowerCase().trim();
          // Check if image alt text or filename contains the color name
          return imgAlt.includes(colorLower) || 
                 imgAlt === colorLower || 
                 imgSrc.includes(colorLower) ||
                 imgAlt.includes(colorLower.replace(/\s+/g, '-')) ||
                 imgAlt.includes(colorLower.replace(/\s+/g, '_'));
        });
        
        if (matchingImages.length > 0) {
          variantImages = matchingImages.map(img => {
            if (typeof img === 'string') return img;
            return img.src || img.url || img.original || '';
          }).filter(url => url && typeof url === 'string');
          console.log('✓ Found', variantImages.length, 'images via color matching');
        }
      }
    }
    
    // Method 4: Fall back to all product images if still no match
    if (variantImages.length === 0 && product.images && product.images.length > 0) {
      variantImages = product.images.map(img => {
        if (typeof img === 'string') return img;
        return img.src || img.url || img.original || '';
      }).filter(url => url && typeof url === 'string');
      console.log('⚠ Using all product images as fallback:', variantImages.length);
    }
    
    // If we still don't have images, try to get from DOM using variant's featured_image
    if (variantImages.length === 0 && variant.featured_image && variant.featured_image.id) {
      console.log('Trying to get image from DOM using featured_image ID:', variant.featured_image.id);
      // Find the image index in product.images array
      const featuredImgIndex = product.images.findIndex(img => img.id === variant.featured_image.id);
      console.log('Featured image index in product.images:', featuredImgIndex);
      
      if (featuredImgIndex >= 0) {
        // Get all images from DOM carousel (they're in order)
        const domImages = document.querySelectorAll('.product-gallery__carousel-slide img');
        console.log('Found', domImages.length, 'images in DOM carousel');
        
        if (domImages[featuredImgIndex]) {
          const imgSrc = domImages[featuredImgIndex].src;
          variantImages = [imgSrc];
          console.log('✓ Got image from DOM at index', featuredImgIndex, ':', imgSrc.substring(0, 60) + '...');
        } else {
          // Try desktop gallery
          const desktopImages = document.querySelectorAll('.product-gallery__images .product-gallery__image img');
          if (desktopImages[featuredImgIndex] || desktopImages[0]) {
            const imgSrc = (desktopImages[featuredImgIndex] || desktopImages[0]).src;
            variantImages = [imgSrc];
            console.log('✓ Got image from desktop gallery');
          }
        }
      }
    }
    
    // Normalize image URLs to full URLs - ensure all are strings
    variantImages = variantImages.map(imgUrl => {
      // Convert to string if it's an object
      if (typeof imgUrl !== 'string') {
        if (imgUrl && imgUrl.src) {
          imgUrl = imgUrl.src;
        } else if (imgUrl && typeof imgUrl === 'object') {
          // Try to extract URL from object
          imgUrl = imgUrl.url || imgUrl.original || '';
        } else {
          return '';
        }
      }
      
      if (!imgUrl || typeof imgUrl !== 'string') return '';
      
      // If it's already a full URL, return as is
      if (imgUrl.startsWith('http://') || imgUrl.startsWith('https://')) {
        return imgUrl;
      }
      
      // If it's a protocol-relative URL
      if (imgUrl.startsWith('//')) {
        return 'https:' + imgUrl;
      }
      
      // If it's an absolute path
      if (imgUrl.startsWith('/')) {
        return window.location.origin + imgUrl;
      }
      
      // If it's a Shopify CDN path, construct full URL
      if (imgUrl.includes('cdn.shopify.com') || imgUrl.includes('shopifycdn.com')) {
        if (!imgUrl.startsWith('http')) {
          return 'https:' + (imgUrl.startsWith('//') ? imgUrl : '//' + imgUrl);
        }
        return imgUrl;
      }
      
      return imgUrl;
    }).filter(url => url && url.trim() !== ''); // Remove empty URLs
    
    console.log('Normalized variant images:', variantImages);
    
    // If we have variant images, update the gallery
    if (variantImages.length > 0) {
      console.log('Updating gallery with', variantImages.length, 'images');
      
      // Update desktop gallery images (2 column grid)
      const desktopImageContainers = document.querySelectorAll('.product-gallery__images .product-gallery__image');
      const desktopImages = document.querySelectorAll('.product-gallery__images .product-gallery__image img');
      console.log('Found desktop images:', desktopImages.length);
      
      // If only one image, hide the second container and adjust grid
      const imagesGrid = document.querySelector('.product-gallery__images');
      if (variantImages.length === 1 && desktopImageContainers.length >= 2) {
        desktopImageContainers[0].style.display = 'block';
        desktopImageContainers[1].style.display = 'none';
        // Adjust grid to single column with max-width constraint
        if (imagesGrid) {
          imagesGrid.style.gridTemplateColumns = '1fr';
          imagesGrid.style.maxWidth = '50%';
          imagesGrid.style.width = '50%';
        }
      } else if (variantImages.length > 1) {
        // Show both containers if we have multiple images
        desktopImageContainers.forEach(container => {
          container.style.display = 'block';
        });
        // Reset grid to two columns and remove max-width
        if (imagesGrid) {
          imagesGrid.style.gridTemplateColumns = '1fr 1fr';
          imagesGrid.style.maxWidth = '100%';
        }
      }
      
      desktopImages.forEach((img, index) => {
        const container = img.closest('.product-gallery__image');
        
        // Hide container if no image for this slot and we have only one image
        if (variantImages.length === 1 && index > 0) {
          if (container) container.style.display = 'none';
          return;
        }
        
        if (variantImages[index]) {
          // Store current dimensions to maintain aspect ratio
          const currentHeight = container ? container.offsetHeight : null;
          
          // Use Shopify image URL transformation for proper sizing
          const imageUrl = variantImages[index];
          // Try to extract base URL and add size parameter
          let optimizedUrl = imageUrl;
          
          // Remove existing size parameters and add new one
          optimizedUrl = optimizedUrl.replace(/_[0-9]+x[0-9]+\./i, '_800x.');
          if (!optimizedUrl.includes('_800x') && !optimizedUrl.match(/_[0-9]+x[0-9]+/i)) {
            optimizedUrl = optimizedUrl.replace(/\.(jpg|jpeg|png|webp)/i, '_800x.$1');
          }
          
          console.log('Updating desktop image', index, 'to', optimizedUrl);
          
          // Preserve aspect ratio by maintaining object-fit
          img.style.objectFit = 'cover';
          img.style.width = '100%';
          img.style.height = '100%';
          
          // Update image
          img.src = optimizedUrl;
          img.srcset = '';
          img.loading = 'lazy';
          
          // Ensure container maintains height
          if (container && currentHeight) {
            container.style.minHeight = currentHeight + 'px';
          }
          
          // Show container
          if (container) container.style.display = 'block';
        } else if (variantImages[0] && variantImages.length > 1) {
          // Only repeat if we have multiple images
          const currentHeight = container ? container.offsetHeight : null;
          
          let optimizedUrl = variantImages[0].replace(/_[0-9]+x[0-9]+\./i, '_800x.');
          if (!optimizedUrl.includes('_800x') && !optimizedUrl.match(/_[0-9]+x[0-9]+/i)) {
            optimizedUrl = optimizedUrl.replace(/\.(jpg|jpeg|png|webp)/i, '_800x.$1');
          }
          
          img.style.objectFit = 'cover';
          img.style.width = '100%';
          img.style.height = '100%';
          
          console.log('Repeating first image for desktop slot', index);
          img.src = optimizedUrl;
          
          if (container && currentHeight) {
            container.style.minHeight = currentHeight + 'px';
          }
          
          if (container) container.style.display = 'block';
        }
      });
      
      // Update mobile carousel images
      const carouselTrack = document.querySelector('[data-carousel-track]');
      if (carouselTrack) {
        const carouselSlides = carouselTrack.querySelectorAll('[data-carousel-slide]');
        const carouselDots = document.querySelectorAll('[data-carousel-dot]');
        const carouselCounter = document.querySelector('[data-carousel-counter]');
        const totalSpan = carouselCounter ? carouselCounter.querySelector('[data-carousel-total]') : null;
        
        // Update slides - only show slides that have images
        carouselSlides.forEach((slide, index) => {
          const slideImg = slide.querySelector('img');
          if (slideImg) {
            if (variantImages[index]) {
              // Store current slide dimensions
              const currentHeight = slide.offsetHeight;
              
              let optimizedUrl = variantImages[index];
              // Remove existing size parameters and add new one
              optimizedUrl = optimizedUrl.replace(/_[0-9]+x[0-9]+\./i, '_1200x.');
              if (!optimizedUrl.includes('_1200x') && !optimizedUrl.match(/_[0-9]+x[0-9]+/i)) {
                optimizedUrl = optimizedUrl.replace(/\.(jpg|jpeg|png|webp)/i, '_1200x.$1');
              }
              console.log('Updating carousel slide', index, 'to', optimizedUrl);
              
              // Preserve aspect ratio
              slideImg.style.objectFit = 'cover';
              slideImg.style.width = '100%';
              slideImg.style.height = '100%';
              
              // Update image
              slideImg.src = optimizedUrl;
              slideImg.srcset = '';
              slideImg.loading = index === 0 ? 'eager' : 'lazy';
              
              // Maintain slide height
              if (currentHeight) {
                slide.style.minHeight = currentHeight + 'px';
              }
              
              slide.style.display = 'flex';
            } else {
              // Hide slides that don't have images
              slide.style.display = 'none';
            }
          }
        });
        
        // If only one image, ensure carousel shows only that slide
        if (variantImages.length === 1) {
          carouselSlides.forEach((slide, index) => {
            if (index > 0) {
              slide.style.display = 'none';
            }
          });
        }
        
        // Update dots - show only for available images
        if (carouselDots.length > 0) {
          carouselDots.forEach((dot, index) => {
            if (index < variantImages.length) {
              dot.style.display = 'block';
            } else {
              dot.style.display = 'none';
            }
          });
        }
        
        // Update counter
        if (totalSpan) {
          totalSpan.textContent = variantImages.length;
        }
        
        // Reset carousel to first slide
        if (carouselSlides.length > 0 && variantImages.length > 0) {
          const firstSlide = carouselSlides[0];
          if (firstSlide) {
            carouselTrack.style.transform = 'translateX(0%)';
            // Update active dot
            carouselDots.forEach((dot, index) => {
              dot.classList.toggle('is-active', index === 0);
            });
            // Update counter
            const currentSpan = carouselCounter ? carouselCounter.querySelector('[data-carousel-current]') : null;
            if (currentSpan) {
              currentSpan.textContent = '1';
            }
          }
        }
      }
    }
  }
  
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
  
    // Touch/Drag functionality for mobile - stops exactly where user releases
    let touchStartX = 0;
    let isDragging = false;
    let startTransform = 0;

    function handleTouchStart(e) {
      touchStartX = e.touches[0].clientX;
      isDragging = false;
      
      // Get current transform value
      const transform = track.style.transform;
      const match = transform.match(/translateX\(([^)]+)px\)/);
      startTransform = match ? parseFloat(match[1]) : 0;
      
      // Disable transition during drag
      track.style.transition = 'none';
    }

    function handleTouchMove(e) {
      if (!touchStartX) return;
      
      const touchCurrentX = e.touches[0].clientX;
      const deltaX = touchCurrentX - touchStartX;
      
      // Start dragging on any horizontal movement
      if (!isDragging && Math.abs(deltaX) > 5) {
        isDragging = true;
        e.preventDefault();
      }
      
      if (isDragging) {
        e.preventDefault();
        const newTransform = startTransform + deltaX;
        track.style.transform = `translateX(${newTransform}px)`;
      }
    }

    function handleTouchEnd(e) {
      // Re-enable transition
      track.style.transition = '';
      
      // Reset without any adjustment
      touchStartX = 0;
      isDragging = false;
    }

    // Add touch event listeners to carousel
    carousel.addEventListener('touchstart', handleTouchStart, { passive: true });
    carousel.addEventListener('touchmove', handleTouchMove, { passive: false });
    carousel.addEventListener('touchend', handleTouchEnd, { passive: true });

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
  
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    let isDragging = false;
    let startTransform = 0;

    function handleTouchStart(e) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      isDragging = false;
      
      // Get current transform value
      const transform = track.style.transform;
      const match = transform.match(/translateX\(([^)]+)px\)/);
      startTransform = match ? parseFloat(match[1]) : 0;
      
      // Disable transition during drag
      track.style.transition = 'none';
    }

    function handleTouchMove(e) {
      if (!touchStartX || !touchStartY) return;
      
      const touchCurrentX = e.touches[0].clientX;
      const deltaX = touchCurrentX - touchStartX;
      
      // Start dragging on any horizontal movement
      if (!isDragging && Math.abs(deltaX) > 5) {
        isDragging = true;
        e.preventDefault();
      }
      
      if (isDragging) {
        e.preventDefault();
        const newTransform = startTransform + deltaX;
        track.style.transform = `translateX(${newTransform}px)`;
      }
    }

    function handleTouchEnd(e) {
      // Re-enable transition
      track.style.transition = '';
      
      // Reset without any adjustment
      touchStartX = 0;
      touchStartY = 0;
      touchEndX = 0;
      touchEndY = 0;
      isDragging = false;
    }

    // Add touch event listeners to carousel
    carousel.addEventListener('touchstart', handleTouchStart, { passive: true });
    carousel.addEventListener('touchmove', handleTouchMove, { passive: false });
    carousel.addEventListener('touchend', handleTouchEnd, { passive: true });

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
          svg.setAttribute('fill', '#000000');
          svg.setAttribute('stroke', '#000000');
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

  /* Navigation Loading Overlay */
  function initNavigationOverlay() {
    // Create overlay element
    const overlay = document.createElement('div');
    overlay.className = 'navigation-overlay';
    overlay.innerHTML = `
      <div class="navigation-spinner">
        <div class="navigation-spinner__circle"></div>
      </div>
    `;
    document.body.appendChild(overlay);

    // Show overlay on navigation
    document.addEventListener('click', function(e) {
      const link = e.target.closest('a[href]');
      if (link && !link.href.includes('#') && !link.href.includes('javascript:') && !link.target) {
        // Don't show loader for links inside mega menu parent items
        const hasMegaMenu = link.closest('.site-header__nav-item--has-mega-menu');
        if (!hasMegaMenu) {
          overlay.classList.add('is-visible');
        }
      }
    });

    // Hide overlay on page load
    window.addEventListener('pageshow', function() {
      overlay.classList.remove('is-visible');
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
  
  