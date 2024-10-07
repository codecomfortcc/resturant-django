
let lastScrollTop = 0;
function revealOnScroll() {
    const menuItems = document.querySelectorAll('.menu-item');
    const timelineProgress = document.querySelector('.timeline-progress');
    const windowHeight = window.innerHeight;
    const st = window.pageYOffset || document.documentElement.scrollTop;
    
    let revealedCount = 0;
    
    menuItems.forEach(function(item, index) {
        const positionFromTop = item.getBoundingClientRect().top;
        
        if (positionFromTop - windowHeight <= 0) {
            if (st > lastScrollTop) {
                // Scrolling down
                item.classList.add('reveal');
                revealedCount++;
            }
        } else {
            if (st < lastScrollTop) {
                item.classList.remove('reveal');
                revealedCount--;
            }
        }
    });
    
    const progress = revealedCount / menuItems.length;
    timelineProgress.style.height = `${progress * 100}%`;
    
    lastScrollTop = st <= 0 ? 0 : st;
}

// Function to initialize the menu items and popup
function initializeMenu() {
    const menuItems = document.querySelectorAll('.menu-item');
    const popupOverlay = document.querySelector('.popup-overlay');
    const popupContent = document.querySelector('.popup-content');
    const popupClose = document.querySelector('.popup-close');

    function openPopup(item) {
        const img = popupContent.querySelector('img');
        const name = popupContent.querySelector('h2');
        const price = popupContent.querySelector('.price');
        const description = popupContent.querySelector('.description');
        const tag = popupContent.querySelector('.tag');

        img.src = item.querySelector('img').src;
        img.alt = item.querySelector('img').alt;
        name.textContent = item.dataset.name;
        price.textContent = item.dataset.price;
        description.textContent = item.dataset.description;
        tag.textContent = item.dataset.tag || '';
        tag.style.display = item.dataset.tag ? 'inline-block' : 'none';

        popupOverlay.classList.add('active');
    }

    function closePopup() {
        popupOverlay.classList.remove('active');
    }

    menuItems.forEach(item => {
        item.addEventListener('click', () => openPopup(item));
    });

    if (popupClose) {
        popupClose.addEventListener('click', closePopup);
    }

    document.addEventListener('mousedown', (event) => {
        if (!popupContent.contains(event.target) && popupOverlay.classList.contains('active')) {
            closePopup();
        }
    });

    // Initialize Intersection Observer
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
                observer.unobserve(entry.target); // To observe only once
            }
        });
    }, { threshold: 0.1 });

    menuItems.forEach(item => {
        observer.observe(item);
    });
}

// Event listeners
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);
document.addEventListener('DOMContentLoaded', initializeMenu);
