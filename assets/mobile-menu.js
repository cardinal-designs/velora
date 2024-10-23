var MobileMenu = class extends HTMLElement {
  constructor() {
    super();

    this.drawer = document.getElementById('mobile-menu');
    this.overlay = document.querySelector('.page-overlay');

    this.openButtons = document.querySelectorAll('.js-open-menu');
    this.closeButtons = document.querySelectorAll('.js-close-menu');

    this.dropdownButtons = this.querySelectorAll('.dropdown-button');
    
    this.drawer.addEventListener('keydown', (evt) => evt.code === 'Escape' && this.close());
    this.bindEvents();
  }

  bindEvents() {
    this.openButtons.forEach(button => button.addEventListener('click', this.open.bind(this)));
    this.closeButtons.forEach(button => button.addEventListener('click', this.close.bind(this)));
    this.dropdownButtons.forEach(dropdownBtn => dropdownBtn.addEventListener('click', this.handleButtonClick.bind(this)));
  }

  open() {
    this.drawer.setAttribute('aria-hidden', false);
    this.drawer.setAttribute('aria-expanded', true);

    this.overlay.classList.remove('invisible', 'opacity-0');
    this.overlay.addEventListener('click', event => {
      this.close();
    });

    document.body.classList.add('overflow-hidden');
    document.body.setAttribute("menu-drawer-open", true)
  }

  close() {
    this.drawer.setAttribute('aria-hidden', true);
    this.drawer.removeAttribute('aria-expanded', true);

    this.overlay.classList.add('invisible', 'opacity-0');

    document.body.classList.remove('overflow-hidden');
    document.body.removeAttribute("menu-drawer-open")

    if(this.hasAttribute("x-data")) {
      this._x_dataStack[0].searchOpen = false
    }
  }

  handleButtonClick(event) {
    event.preventDefault();
    const button = event.currentTarget;
    const dropdown = button.nextElementSibling;

    if (button.classList.contains('active')) {
      button.classList.remove('active');
      slideUp(dropdown, 300);
    } else {
      button.classList.add('active');
      slideDown(dropdown, 300);
    }
  }
}

customElements.define('mobile-menu', MobileMenu);