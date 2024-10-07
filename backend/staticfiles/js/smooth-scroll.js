function debounce(func, delay) {
  let timeout;
  return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), delay);
  };
}
(function() {
  
  const content = document.querySelector('.smooth-scroll-content');
  let scrollHeight = 0;
  let currentY = 0;
  let targetY = 0;
  let ticking = false; 

  function setScrollHeight() {
      const height = content.getBoundingClientRect().height;
      document.body.style.height = `${height}px`;
      scrollHeight = height - window.innerHeight;
  }

  function lerp(start, end, t) {
      return start * (1 - t) + end * t;
  }

  function animate() {
      currentY = lerp(currentY, targetY, 0.1);
      content.style.transform = `translate3d(0, ${currentY}px, 0)`;
      requestAnimationFrame(animate);
  }

  function onScroll() {
      targetY = -window.scrollY;
      if (!ticking) {
          window.requestAnimationFrame(() => {
              ticking = false; 
          });
          ticking = true; 
      }
  }


  function init() {
      setScrollHeight();
      animate();

      window.addEventListener('resize', debounce(setScrollHeight, 200)); 
      window.addEventListener('scroll', onScroll); 
  }

  init();
})();
