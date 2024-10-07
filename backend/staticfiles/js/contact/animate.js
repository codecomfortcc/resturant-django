document.addEventListener('DOMContentLoaded', function () {
  const container = document.querySelector('.lux-container');

  if (container) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateElements();
            observer.disconnect(); 
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(container);
  }

  function animateElements() {
    const elements = document.querySelectorAll('.gh-contact__animate');
    elements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('gh-contact__fade-in');
      }, index * 200);
    });
  }
});
