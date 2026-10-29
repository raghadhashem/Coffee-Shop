/**
 * BREW & BEAN - DEDICATED MENU PAGE JAVASCRIPT (JS/menu.js)
 * 
 * Features:
 * 1. Mobile Drawer Navigation & Sticky Header
 * 2. Instant Toast Notification Engine
 * 3. Filter Tabs (All, Coffee, Drinks, Desserts) with smooth transitions
 * 4. Live Search Input with automatic no-results fallback
 * 5. Quick Order Modal with drink customization (milk, sweetness)
 * 6. Floating Cart/Tray live counter badge
 * 7. Newsletter subscription feedback
 */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------------
    // 1. MOBILE NAVIGATION DRAWER
    // -------------------------------------------------------------------------
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    function toggleMenu() {
        hamburgerBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    }

    function closeMenu() {
        if (hamburgerBtn) hamburgerBtn.classList.remove('active');
        if (mobileMenu) mobileMenu.classList.remove('active');
        if (mobileOverlay) mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (hamburgerBtn) hamburgerBtn.addEventListener('click', toggleMenu);
    if (mobileOverlay) mobileOverlay.addEventListener('click', closeMenu);
    mobileNavLinks.forEach(link => link.addEventListener('click', closeMenu));

    // -------------------------------------------------------------------------
    // 2. STICKY HEADER
    // -------------------------------------------------------------------------
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });

    // -------------------------------------------------------------------------
    // 3. TOAST NOTIFICATION ENGINE
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
            }, 350);
        }, 4000);
    }

    // -------------------------------------------------------------------------
    // 4. MENU CATEGORY FILTERING & LIVE SEARCH
    // -------------------------------------------------------------------------
    const filterButtons = document.querySelectorAll('.menu-filter-btn');
    const menuCards = document.querySelectorAll('.menu-card');
    const searchInput = document.getElementById('menuSearchInput');
    const noResultsBox = document.getElementById('noResultsBox');

    let currentFilter = 'all';
    let currentSearchTerm = '';

    function applyFilters() {
        let visibleCount = 0;

        menuCards.forEach(card => {
            const category = card.getAttribute('data-category');
            const title = card.querySelector('.menu-item-title')?.textContent.toLowerCase() || '';
            const desc = card.querySelector('.menu-item-desc')?.textContent.toLowerCase() || '';

            const matchesCategory = (currentFilter === 'all' || category === currentFilter);
            const matchesSearch = (!currentSearchTerm || title.includes(currentSearchTerm) || desc.includes(currentSearchTerm));

            if (matchesCategory && matchesSearch) {
                card.style.display = 'flex';
                card.style.opacity = '0';
                card.style.transform = 'translateY(12px)';
                setTimeout(() => {
                    card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 30);
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        if (noResultsBox) {
            if (visibleCount === 0) {
                noResultsBox.classList.add('show');
            } else {
                noResultsBox.classList.remove('show');
            }
        }
    }

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter');
            applyFilters();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearchTerm = e.target.value.trim().toLowerCase();
            applyFilters();
        });
    }

    // -------------------------------------------------------------------------
    // 5. QUICK ORDER MODAL & TRAY BADGE
    // -------------------------------------------------------------------------
    const modalOverlay = document.getElementById('itemModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalPrice = document.getElementById('modalPrice');
    const modalDesc = document.getElementById('modalDesc');
    const modalAddBtn = document.getElementById('modalAddBtn');
    const trayBadge = document.getElementById('trayBadgeCount');

    let trayCount = 0;

    const orderButtons = document.querySelectorAll('.menu-order-btn');

    orderButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const card = btn.closest('.menu-card');
            if (card) {
                const title = card.querySelector('.menu-item-title')?.textContent || 'Artisan Selection';
                const price = card.querySelector('.menu-item-price')?.textContent || '$4.50';
                const desc = card.querySelector('.menu-item-desc')?.textContent || 'Handcrafted fresh coffeehouse item.';
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

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
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
            const sweetness = document.getElementById('sweetnessOption')?.value || 'Regular (100%)';

            trayCount++;
            if (trayBadge) trayBadge.textContent = trayCount;

            closeModal();

            showToast(
                `Added to Tray! (${trayCount}) ☕`,
                `${title} (${milk}, ${sweetness}) is in your order tray. Ready for pick-up!`
            );
        });
    }

    // -------------------------------------------------------------------------
    // 6. NEWSLETTER SUBSCRIPTION
    // -------------------------------------------------------------------------
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = document.getElementById('newsletterEmail');
            const email = input ? input.value : '';

            showToast(
                'Welcome to Brew Club! 💌',
                `Thank you for joining! A 15% discount code has been sent to ${email}.`,
                'fa-solid fa-envelope-circle-check'
            );

            newsletterForm.reset();
        });
    }
});
