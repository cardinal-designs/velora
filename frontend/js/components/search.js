export default class SearchDropdown extends HTMLElement {
    constructor() {
      super();
  
      this.isOpen = false;
      this.openButtons = document.querySelectorAll('[data-open-search]');
      this.closeButtons = document.querySelectorAll('[data-close-search]');
      this.overlay = document.querySelector('.page-overlay-under');
  
      this.openButtons.forEach(button => button.addEventListener('click', this.open.bind(this)));
      this.closeButtons.forEach(button => button.addEventListener('click', this.close.bind(this)));
    }
  
    open(e) {
      if(e) e.preventDefault()
      const search = this.querySelector('input[type="search"]');

      if(this.isOpen == true) {
        this.close()
        return
      }
  
      this.isOpen = true;
      this.classList.add('active');

      
      document.documentElement.classList.add('scrolled');
      document.body.setAttribute("data-search-open", true)
      // this.overlay.classList.remove('invisible', 'opacity-0');
  
      // Focus on input
      setTimeout(() => {
        search.focus();
      }, 500);
  
      // Add listeners
      document.addEventListener('click', this.handleFocusOut.bind(this));
      this.addEventListener('keyup', this.handleKeyup.bind(this));
    }
  
    close(e) {
      if(e) e.preventDefault()
      this.isOpen = false;
      this.classList.remove('active');
  
      // this.overlay.classList.add('invisible', 'opacity-0');
      document.body.removeAttribute("data-search-open")
  
      if (window.scrollY < 5) {
        document.documentElement.classList.remove('scrolled');
      }
    }
  
    handleFocusOut(event) {
      const parent = event.target.closest('header');
      if (parent == null && this.isOpen) this.close(event);
    }
  
    handleKeyup(event) {
      if (event.keyCode !== 27) return;
  
      this.close(event);
    }
  }
  
  window.customElements.define('search-dropdown', SearchDropdown);