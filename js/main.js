/**
 * BREW & BEAN - MODERN JAVASCRIPT
 * Handles mobile navigation, smooth scrolling, active link tracking,
 * animated number counters, menu filtering, toast notifications,
 * quick order modal, and scroll reveal animations.
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
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        mobileOverlay.classList.remove('active');
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
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Back to top button visibility
        if (scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        // Active link detection
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
                mobileNavLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Trigger on load

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
    const toastContainer = document.getElementById('toastContainer');

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

        // Animate in
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // Remove after 4.5s
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentElement) {
                    toast.remove();
                }
            }, 400);
        }, 4500);
    }

    // -------------------------------------------------------------------------
    // 4. "VIEW MENU" BUTTON INTERACTION (WELCOME MESSAGE + SMOOTH SCROLL)
    // -------------------------------------------------------------------------
    const viewMenuBtn = document.getElementById('viewMenuBtn');
    if (viewMenuBtn) {
        viewMenuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const menuSection = document.getElementById('menu');
            if (menuSection) {
                menuSection.scrollIntoView({ behavior: 'smooth' });
            }
            showToast(
                'Welcome to Brew & Bean! ☕',
                'Explore our artisanal roast selection handcrafted just for you.'
            );
        });
    }

    // -------------------------------------------------------------------------
    // 5. ANIMATED NUMBER COUNTERS (OUR COFFEE IN NUMBERS)
    // -------------------------------------------------------------------------
    const statCounters = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    function animateCounters() {
        statCounters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const prefix = counter.getAttribute('data-prefix') || '';
            const suffix = counter.getAttribute('data-suffix') || '';
            const duration = 2000; // 2 seconds
            const stepTime = 20;
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
        }, { threshold: 0.3 });

        statsObserver.observe(statsSection);
    } else {
        // Fallback for older browsers
        animateCounters();
    }

    // -------------------------------------------------------------------------
    // 6. MENU CATEGORY FILTERING
    // -------------------------------------------------------------------------
    const filterButtons = document.querySelectorAll('.menu-filter-btn');
    const menuCards = document.querySelectorAll('.menu-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            menuCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px)';
                    setTimeout(() => {
                        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
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

    // Attach click listeners to Menu card order buttons & specialty cards
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
            closeModal();
            showToast(
                'Added to Your Order! 🛍️',
                `${title} has been added to your tray. See you at the counter!`,
                'fa-solid fa-check-circle'
            );
        });
    }

    // -------------------------------------------------------------------------
    // 8. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
    // -------------------------------------------------------------------------
    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add('revealed'));
    }

    // -------------------------------------------------------------------------
    // 9. CONTACT FORM SUBMISSION
    // -------------------------------------------------------------------------
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('contactName');
            const guestName = nameInput ? nameInput.value : 'Guest';

            showToast(
                'Message Received! 💌',
                `Thank you ${guestName}! We have received your note and will be in touch shortly.`,
                'fa-solid fa-heart'
            );
            contactForm.reset();
        });
    }

    // -------------------------------------------------------------------------
    // 10. NEWSLETTER SUBSCRIPTION
    // -------------------------------------------------------------------------
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('newsletterEmail');
            if (emailInput && emailInput.value) {
                showToast(
                    'Welcome to Brew Club! ✨',
                    'You are now subscribed to exclusive coffee perks and secret drops.',
                    'fa-solid fa-gift'
                );
                newsletterForm.reset();
            }
        });
    }
});
