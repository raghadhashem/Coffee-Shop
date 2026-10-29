/**
 * BREW & BEAN - MAIN HOMEPAGE JAVASCRIPT (JS/script.js)
 * 
 * Features:
 * 1. Mobile Menu Drawer & Backdrop Overlay
 * 2. Sticky Glassmorphism Header & Scrollspy Active Nav
 * 3. Toast Notification Alert System
 * 4. Animated Number Counters on Viewport Scroll
 * 5. Interactive Menu Category Filtering (All, Coffee, Drinks, Desserts)
 * 6. Quick Order Modal with Drink Customization & Live Tray Counter
 * 7. Table Reservation & Newsletter Form Handling with Instant Feedback
 * 8. Scroll Reveal Animations (IntersectionObserver)
 */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------------
    // 1. MOBILE NAVIGATION TOGGLE
    // -------------------------------------------------------------------------
    const hamburger = document.getElementById('hamburgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    function toggleMobileMenu() {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    }

    function closeMobileMenu() {
        if (hamburger) hamburger.classList.remove('active');
        if (mobileMenu) mobileMenu.classList.remove('active');
        if (mobileOverlay) mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', closeMobileMenu);
    }

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // -------------------------------------------------------------------------
    // 2. HEADER SCROLL & ACTIVE LINK HIGHLIGHT (SCROLLSPY)
    // -------------------------------------------------------------------------
    const header = document.querySelector('.header');
    const backToTop = document.getElementById('backToTop');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    function handleScroll() {
        const scrollY = window.pageYOffset;

        // Sticky Header styling
        if (header) {
            if (scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // Back to top button visibility
        if (backToTop) {
            if (scrollY > 400) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }

        // Active link detection for on-page sections
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 130;
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href === `#${sectionId}` || href === `index.html#${sectionId}`) {
                        link.classList.add('active');
                    } else if (href && href.startsWith('#')) {
                        link.classList.remove('active');
                    }
                });
                mobileNavLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href === `#${sectionId}` || href === `index.html#${sectionId}`) {
                        link.classList.add('active');
                    } else if (href && href.startsWith('#')) {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // -------------------------------------------------------------------------
    // 3. TOAST NOTIFICATION SYSTEM
    // -------------------------------------------------------------------------
    let toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toastContainer';
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }

    function showToast(title, message, iconClass = 'fa-solid fa-mug-hot') {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="${iconClass}"></i>
            </div>
            <div class="toast-body">
                <h5>${title}</h5>
                <p>${message}</p>
            </div>
        `;

        toastContainer.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentElement) {
                    toast.remove();
                }
            }, 400);
        }, 4000);
    }

    // Expose showToast globally
    window.showToast = showToast;

    // -------------------------------------------------------------------------
    // 4. "VIEW MENU" BUTTON INTERACTION
    // -------------------------------------------------------------------------
    const viewMenuBtn = document.getElementById('viewMenuBtn');
    if (viewMenuBtn) {
        viewMenuBtn.addEventListener('click', (e) => {
            const menuSection = document.getElementById('menu');
            if (menuSection) {
                e.preventDefault();
                menuSection.scrollIntoView({ behavior: 'smooth' });
                showToast(
                    'Welcome to Brew & Bean! ☕',
                    'Discover our freshly ground coffee, artisan drinks, and warm bakery treats.'
                );
            }
        });
    }

    // -------------------------------------------------------------------------
    // 5. ANIMATED NUMBER COUNTERS
    // -------------------------------------------------------------------------
    const statCounters = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    function animateCounters() {
        statCounters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const prefix = counter.getAttribute('data-prefix') || '';
            const suffix = counter.getAttribute('data-suffix') || '';
            const duration = 1800;
            const stepTime = 25;
            const totalSteps = duration / stepTime;
            const increment = target / totalSteps;
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
                    clearInterval(timer);
                } else {
                    counter.textContent = `${prefix}${Math.floor(current).toLocaleString()}${suffix}`;
                }
            }, stepTime);
        });
    }

    const statsSection = document.getElementById('stats');
    if (statsSection && 'IntersectionObserver' in window) {
        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersAnimated) {
                    countersAnimated = true;
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.25 });

        statsObserver.observe(statsSection);
    } else if (statCounters.length > 0) {
        animateCounters();
    }

    // -------------------------------------------------------------------------
    // 6. MENU CATEGORY FILTERING (All, Coffee, Drinks, Desserts)
    // -------------------------------------------------------------------------
    const filterButtons = document.querySelectorAll('.menu-filter-btn');
    const menuCards = document.querySelectorAll('.menu-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            menuCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(12px)';
                    setTimeout(() => {
                        card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 40);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // -------------------------------------------------------------------------
    // 7. ITEM DETAILS / QUICK ORDER MODAL
    // -------------------------------------------------------------------------
    const modalOverlay = document.getElementById('itemModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalPrice = document.getElementById('modalPrice');
    const modalDesc = document.getElementById('modalDesc');
    const modalAddBtn = document.getElementById('modalAddBtn');

    let trayCount = 0;

    const orderButtons = document.querySelectorAll('.menu-order-btn, .specialty-btn');

    orderButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const card = btn.closest('.menu-card') || btn.closest('.specialty-card');

            if (card) {
                const title = card.querySelector('.menu-item-title, .specialty-title')?.textContent || 'Special Coffee';
                const price = card.querySelector('.menu-item-price')?.textContent || '$4.50';
                const desc = card.querySelector('.menu-item-desc, .specialty-desc')?.textContent || 'Freshly brewed artisanal beverage.';
                const img = card.querySelector('img')?.src || '';

                if (modalImg) modalImg.src = img;
                if (modalTitle) modalTitle.textContent = title;
                if (modalPrice) modalPrice.textContent = price;
                if (modalDesc) modalDesc.textContent = desc;

                openModal();
            }
        });
    });

    function openModal() {
        if (modalOverlay) {
            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal() {
        if (modalOverlay) {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });

    if (modalAddBtn) {
        modalAddBtn.addEventListener('click', () => {
            const title = modalTitle ? modalTitle.textContent : 'Item';
            const milk = document.getElementById('milkOption')?.value || 'Whole Milk';
            const sweetness = document.getElementById('sweetnessOption')?.value || 'Regular';

            trayCount++;
            closeModal();

            showToast(
                `Added to Tray! (${trayCount}) ☕`,
                `${title} with ${milk} (${sweetness}) has been added to your order.`
            );
        });
    }

    // -------------------------------------------------------------------------
    // 8. TABLE RESERVATION FORM
    // -------------------------------------------------------------------------
    const reserveForm = document.getElementById('reservationForm');
    if (reserveForm) {
        reserveForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('resName')?.value || 'Guest';
            const guests = document.getElementById('resGuests')?.value || '2';
            const date = document.getElementById('resDate')?.value || 'Today';
            const time = document.getElementById('resTime')?.value || '7:00 PM';

            showToast(
                'Reservation Confirmed! 🎉',
                `Thank you, ${name}! Your table for ${guests} guests on ${date} at ${time} is reserved.`,
                'fa-solid fa-calendar-check'
            );

            reserveForm.reset();
        });
    }

    // -------------------------------------------------------------------------
    // 9. NEWSLETTER SUBSCRIPTION FORM
    // -------------------------------------------------------------------------
    const newsletterForms = document.querySelectorAll('.newsletter-form, .footer-newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = form.querySelector('input[type="email"]');
            const email = emailInput ? emailInput.value : '';

            showToast(
                'Welcome to the Brew Club! 💌',
                `Thank you for joining! A 15% discount code has been sent to ${email}.`,
                'fa-solid fa-envelope-circle-check'
            );

            form.reset();
        });
    });

    // -------------------------------------------------------------------------
    // 10. SCROLL REVEAL ANIMATION (INTERSECTION OBSERVER)
    // -------------------------------------------------------------------------
    const revealElements = document.querySelectorAll('.reveal');

    function revealElement(el) {
        el.classList.add('revealed', 'active');
    }

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    revealElement(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.08,
            rootMargin: '50px 0px 50px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        revealElements.forEach(el => revealElement(el));
    }

    // Immediately reveal elements visible on initial page load
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    revealElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= windowHeight + 100) {
            revealElement(el);
        }
    });

    // Failsafe: reveal all remaining elements after 600ms
    setTimeout(() => {
        revealElements.forEach(el => revealElement(el));
    }, 600);
});
