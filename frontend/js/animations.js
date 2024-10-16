export function initLoadingAnimations() {
    const observer = new IntersectionObserver(callback, {
      root: null,
      rootMargin: '0px 0px -150px 0px',
      threshold: 0,
    });
  
    const sections = document.querySelectorAll('.shopify-section');
  
    sections.forEach(section => {
      const elements = section.querySelectorAll('[data-animate]');
      for (let count = 0; count < elements.length; count++) {
        elements[count].setAttribute('style', 'transition-delay: ' + count * 0.07 + 's');
      }
  
      observer.observe(section)
    });
  }
  
  function callback(entries, observer) {
    entries.forEach(entry => {
  
      if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
        entry.target.classList.add('animated');
      }
    })
  }