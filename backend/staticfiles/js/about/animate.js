// State to keep track of the current active section
let activeSection = 'story';

// Function to initialize the About section
function initAbout() {
  const container = document.getElementById('about-container');
  if (container) {
    addEventListeners(container);
    updateActiveSection(container);
  }
}

// Function to add click event listeners to the navigation buttons
function addEventListeners(container) {
  const buttons = container.querySelectorAll('.gourmet-about__nav-button');
  buttons.forEach(button => {
    button.addEventListener('click', function () {
      const section = button.getAttribute('data-section');
      setActiveSection(section, container);
    });
  });
}

// Function to update the active section and re-render the relevant content
function setActiveSection(section, container) {
  activeSection = section;
  updateActiveSection(container);
}

// Function to show the currently active section and highlight the active button
function updateActiveSection(container) {
  const sections = container.querySelectorAll('.gourmet-about__section');
  sections.forEach(section => {
    section.classList.remove('gourmet-about__section--active');
  });

  const active = container.querySelector(`#${activeSection}`);
  if (active) {
    active.classList.add('gourmet-about__section--active');
  }

  // Update the active state for the buttons
  const buttons = container.querySelectorAll('.gourmet-about__nav-button');
  buttons.forEach(button => {
    button.classList.remove('gourmet-about__nav-button--active');
    if (button.getAttribute('data-section') === activeSection) {
      button.classList.add('gourmet-about__nav-button--active');
    }
  });
}

document.addEventListener('DOMContentLoaded', initAbout);
