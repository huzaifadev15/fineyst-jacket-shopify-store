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
  
  /* Welcome Section Carousel */
  function initWelcomeCarousel() {
    const carousel = document.querySelector('[data-carousel]');
    if (!carousel) return;
  
    const track = carousel.querySelector('[data-carousel-track]');
    const prevBtn = document.querySelector('[data-carousel-prev]');
    const nextBtn = document.querySelector('[data-carousel-next]');
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
      const gap = parseInt(style.marginRight) || 32;
      return width + gap;
    }
  
    function filterByGender(gender) {
      currentGender = gender;
      const allCards = Array.from(track.querySelectorAll('.welcome-section__category-card'));
      visibleCards = [];
      
      allCards.forEach(card => {
        const cardGender = card.getAttribute('data-gender') || 'men';
        
        // Show card if it matches the selected gender or is set to 'both'
        if (cardGender === gender || cardGender === 'both') {
          card.style.display = '';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
          }, 10);
          visibleCards.push(card);
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
  
      // Reset carousel position
      currentIndex = 0;
      
      // Wait for display changes to take effect
      setTimeout(() => {
        updateCarousel();
      }, 50);
    }
  
    function updateCarousel() {
      const cardWidth = getCardWidth();
      const translateX = -currentIndex * cardWidth;
      track.style.transform = `translateX(${translateX}px)`;
      
      const visibleCount = visibleCards.length;
      const maxVisible = Math.min(5, visibleCount);
      
      // Update button states
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex >= Math.max(0, visibleCount - maxVisible);
    }
  
    // Gender filter buttons
    genderFilters.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const gender = this.getAttribute('data-gender-filter');
        
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
  
    // Initialize with men's categories
    filterByGender('men');
  }
  
  /* Hand-Picked Section Carousel */
  function initHandPickedCarousel() {
    const carousel = document.querySelector('[data-handpicked-carousel]');
    if (!carousel) return;
  
    const track = carousel.querySelector('[data-handpicked-track]');
    const prevBtn = document.querySelector('[data-handpicked-prev]');
    const nextBtn = document.querySelector('[data-handpicked-next]');
    const genderFilters = document.querySelectorAll('[data-handpicked-gender]');
    
    if (!track || !prevBtn || !nextBtn) return;
  
    let currentIndex = 0;
    let currentGender = 'men';
    let visibleProducts = [];
  
    function getProductWidth() {
      // Use the base width (non-center product) for calculations
      const firstProduct = track.querySelector('.hand-picked-section__product:not([style*="display: none"]):not(.is-center)');
      if (!firstProduct) {
        const anyProduct = track.querySelector('.hand-picked-section__product:not([style*="display: none"])');
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
      const allProducts = Array.from(track.querySelectorAll('.hand-picked-section__product'));
      visibleProducts = [];
      
      allProducts.forEach(product => {
        const productGender = product.getAttribute('data-gender') || 'men';
        
        if (productGender === gender) {
          product.style.display = '';
          product.style.opacity = '0';
          setTimeout(() => {
            product.style.opacity = '1';
          }, 10);
          visibleProducts.push(product);
        } else {
          product.style.display = 'none';
          product.style.opacity = '0';
        }
      });
  
      currentIndex = 0;
      setTimeout(() => {
        updateCarousel();
      }, 50);
    }
  
    function updateCarousel() {
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
      track.style.transform = `translateX(${translateX}px)`;
      
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
  
    const track = carousel.querySelector('[data-color-track]');
    const prevBtn = document.querySelector('[data-color-prev]');
    const nextBtn = document.querySelector('[data-color-next]');
    
    if (!track || !prevBtn || !nextBtn) return;
  
    let currentIndex = 0;
    const cards = Array.from(track.querySelectorAll('.color-collection-section__card'));
    const totalCards = cards.length;
    const visibleCards = 5;
  
    function getCardWidth() {
      const firstCard = cards[0];
      if (!firstCard) return 0;
      const style = window.getComputedStyle(firstCard);
      const width = firstCard.offsetWidth;
      const gap = parseInt(style.marginRight) || 32;
      return width + gap;
    }
  
    function updateCarousel() {
      const cardWidth = getCardWidth();
      const translateX = -currentIndex * cardWidth;
      track.style.transform = `translateX(${translateX}px)`;
      
      const maxIndex = Math.max(0, totalCards - visibleCards);
      
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
      const maxIndex = Math.max(0, totalCards - visibleCards);
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
  
    // Initialize
    updateCarousel();
  }
  
  /* FAQ Accordion */
  function initFAQ() {
    const faqSection = document.querySelector('.faq-section');
    if (!faqSection) return;
    
    const faqQuestions = faqSection.querySelectorAll('[data-faq-toggle]');
    
    if (!faqQuestions.length) return;
    
    // Set initial state for first item
    const firstQuestion = faqQuestions[0];
    if (firstQuestion && firstQuestion.getAttribute('aria-expanded') === 'true') {
      const firstId = firstQuestion.getAttribute('data-faq-id');
      const firstAnswer = faqSection.querySelector(`[data-faq-answer="${firstId}"]`);
      if (firstAnswer) {
        setTimeout(() => {
          firstAnswer.style.maxHeight = firstAnswer.scrollHeight + 'px';
        }, 100);
      }
    }
    
    // Add click handler to each question using unique ID
    faqQuestions.forEach((question) => {
      const faqId = question.getAttribute('data-faq-id');
      if (!faqId) return;
      
      question.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const clickedId = this.getAttribute('data-faq-id');
        const clickedAnswer = faqSection.querySelector(`[data-faq-answer="${clickedId}"]`);
        const clickedItem = this.closest('.faq-section__item');
        
        if (!clickedAnswer || !clickedItem) return;
        
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        
        // Close all other FAQs using their unique IDs
        faqQuestions.forEach(otherQuestion => {
          const otherId = otherQuestion.getAttribute('data-faq-id');
          if (otherId !== clickedId) {
            const otherAnswer = faqSection.querySelector(`[data-faq-answer="${otherId}"]`);
            const otherItem = otherQuestion.closest('.faq-section__item');
            
            if (otherAnswer && otherItem) {
              otherQuestion.setAttribute('aria-expanded', 'false');
              otherItem.classList.remove('faq-section__item--active');
              otherAnswer.style.maxHeight = '0';
            }
          }
        });
        
        // Toggle current FAQ
        if (isExpanded) {
          this.setAttribute('aria-expanded', 'false');
          clickedItem.classList.remove('faq-section__item--active');
          clickedAnswer.style.maxHeight = '0';
        } else {
          this.setAttribute('aria-expanded', 'true');
          clickedItem.classList.add('faq-section__item--active');
          // Get the actual scroll height
          clickedAnswer.style.maxHeight = 'none';
          const height = clickedAnswer.scrollHeight;
          clickedAnswer.style.maxHeight = '0';
          // Force reflow
          clickedAnswer.offsetHeight;
          // Set to actual height
          clickedAnswer.style.maxHeight = height + 'px';
        }
      });
    });
  }
  
  