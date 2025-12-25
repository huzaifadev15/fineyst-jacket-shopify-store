/* ============================================
   FINEYST JACKETS - GLOBAL JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initHeader();
  initMobileMenu();
  initProductGallery();
  initQuantityButtons();
  initAddToCart();
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

    e.preventDefault();
    const variantId = addBtn.dataset.addToCart;

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
  const data = {
    items: [{
      id: variantId,
      quantity: parseInt(quantity)
    }]
  };

  fetch(window.routes.cart_add_url + '.js', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    updateCartCount();
    showCartNotification('Item added to cart!');
  })
  .catch(error => {
    console.error('Error:', error);
    showCartNotification('Failed to add item to cart', 'error');
  });
}

function updateCartCount() {
  fetch(window.routes.cart_url + '.js')
    .then(response => response.json())
    .then(cart => {
      const countElements = document.querySelectorAll('[data-cart-count]');
      countElements.forEach(el => {
        el.textContent = cart.item_count;
      });
    });
}

function showCartNotification(message, type = 'success') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `cart-notification cart-notification--${type}`;
  notification.innerHTML = `
    <p>${message}</p>
    <a href="${window.routes.cart_url}" class="btn btn--white btn--sm">View Cart</a>
  `;
  
  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 10rem;
    right: 2rem;
    background: ${type === 'success' ? 'var(--color-primary)' : '#e63946'};
    color: #fff;
    padding: 2rem;
    z-index: 9999;
    display: flex;
    align-items: center;
    gap: 2rem;
    animation: slideInRight 0.3s ease;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  `;

  document.body.appendChild(notification);

  // Auto remove after 4 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease forwards';
    setTimeout(() => notification.remove(), 300);
  }, 4000);
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

