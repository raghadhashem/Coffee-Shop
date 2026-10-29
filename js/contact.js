/**
 * BREW & BEAN - CONTACT & RESERVATION JAVASCRIPT (JS/contact.js)
 * 
 * Features:
 * 1. Mobile Menu Drawer & Overlay
 * 2. Sticky Glassmorphism Header
 * 3. Toast Notification Engine
 * 4. Interactive Table Reservation Form with Validation & Feedback
 * 5. Interactive FAQ Accordion
 * 6. Get Directions / Copy Address Action
 * 7. Newsletter Subscription Handler
 */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------------
    // 1. MOBILE DRAWER NAVIGATION
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
    // 3. TOAST NOTIFICATIONS
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
        }, 4500);
    }

    // -------------------------------------------------------------------------
    // 4. TABLE RESERVATION FORM
    // -------------------------------------------------------------------------
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        // Set minimum date to today
        const dateInput = document.getElementById('bookDate');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.min = today;
        }

        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('bookName')?.value || 'Guest';
            const guests = document.getElementById('bookGuests')?.value || '2 Guests';
            const date = document.getElementById('bookDate')?.value || 'Upcoming';
            const time = document.getElementById('bookTime')?.value || '7:00 PM';
            const seating = document.getElementById('bookSeating')?.value || 'Cozy Booth';

            showToast(
                'Table Reserved Successfully! ☕',
                `Thank you, ${name}! Your table for ${guests} (${seating}) on ${date} at ${time} is confirmed. A reminder has been sent.`,
                'fa-solid fa-calendar-check'
            );

            bookingForm.reset();
        });
    }

    // -------------------------------------------------------------------------
    // 5. FAQ ACCORDION
    // -------------------------------------------------------------------------
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        questionBtn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close other open questions
            faqItems.forEach(other => other.classList.remove('active'));

            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // -------------------------------------------------------------------------
    // 6. GET DIRECTIONS / COPY ADDRESS BUTTON
    // -------------------------------------------------------------------------
    const directionsBtn = document.getElementById('getDirectionsBtn');
    if (directionsBtn) {
        directionsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const address = "124 Espresso Lane, Roast District, NY 10012";
            
            if (navigator.clipboard) {
                navigator.clipboard.writeText(address).then(() => {
                    showToast(
                        'Address Copied to Clipboard! 📍',
                        `${address} - Ready to paste in Google Maps or your GPS.`,
                        'fa-solid fa-map-location-dot'
                    );
                }).catch(() => {
                    showToast(
                        'Our Café Location ☕',
                        address,
                        'fa-solid fa-location-dot'
                    );
                });
            } else {
                showToast(
                    'Our Café Location ☕',
                    address,
                    'fa-solid fa-location-dot'
                );
            }
        });
    }

    // -------------------------------------------------------------------------
    // 7. NEWSLETTER SUBSCRIPTION
    // -------------------------------------------------------------------------
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = document.getElementById('newsletterEmail');
            const email = input ? input.value : '';

            showToast(
                'Subscribed to Brew Club! 💌',
                `Check your inbox at ${email} for your 15% welcome voucher!`,
                'fa-solid fa-envelope-circle-check'
            );

            newsletterForm.reset();
        });
    }
});
