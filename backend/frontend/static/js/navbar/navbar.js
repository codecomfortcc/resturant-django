document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  let lastScrollY = window.scrollY;
  let isScrollingDown = false;

  // Function to handle scrolling
  function handleScroll() {
    const currentScrollY = window.scrollY;
    const newIsScrollingDown = currentScrollY > lastScrollY;

    if (newIsScrollingDown !== isScrollingDown) {
      isScrollingDown = newIsScrollingDown;
      updateNavbarClass();
    }

    lastScrollY = currentScrollY;
  }

  // Function to update the navbar class based on scroll direction
  function updateNavbarClass() {
    const scrollClass = isScrollingDown ? 'scroll-down' : 'scroll-up';
    navbar.className = `navbar-container ${scrollClass}`;
  }

  // Highlight the current page link
  function highlightCurrentPage() {
    const currentPath = window.location.pathname;
    const links = document.querySelectorAll('.nav-link');

    links.forEach(link => {
      if (link.getAttribute('href') === currentPath) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', handleScroll);
  // highlightCurrentPage();
});
