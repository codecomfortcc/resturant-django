document.addEventListener('DOMContentLoaded', () => {
  const card = document.querySelector('.d3-card-inner');

  card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const angleX = (centerY - y) / 30; // Reversed and reduced intensity
      const angleY = (x - centerX) / 30; // Reversed and reduced intensity

      card.style.transform = `rotateX(${angleX}deg) rotateY(${angleY}deg)`;
  });

  card.addEventListener('mouseleave', () => {
      card.style.transform = 'rotateX(0) rotateY(0)';
  });
});

const observerOptions = {
  threshold: 0.1 // Trigger when 10% of the element is in view
};


const observerCallback = (entries, observer) => {
  entries.forEach(entry => {
      if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); 
      }
  });
};

// Create Intersection Observer instance
const observer = new IntersectionObserver(observerCallback, observerOptions);

// Observe story container, paragraphs, and timeline items
document.querySelectorAll('.story-container, .story-paragraph, .timeline-item').forEach(element => {
  observer.observe(element);
});




