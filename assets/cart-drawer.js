class CartDrawerRemoveButton extends HTMLElement {
  constructor() {
    super();
    this.addEventListener('click', (event) => {
      event.preventDefault();
      this.closest('cart-drawer').updateQuantity(this.dataset.index, 0);
    });
  }
}

customElements.define('cart-drawer-remove-button', CartDrawerRemoveButton);

class CartDrawer extends HTMLElement {
  constructor() {
    super();

    // Elements
    this.drawer = document.getElementById('cart-drawer');
    this.overlay = document.querySelector('.page-overlay');
    
    this.openButtons = document.querySelectorAll('.js-open-cart');
    this.closeButtons = document.querySelectorAll('.js-close-cart');

    this.currentItemCount = Array.from(this.querySelectorAll('[name="updates[]"]'))
      .reduce((total, quantityInput) => total + parseInt(quantityInput.value), 0);

    this.debouncedOnChange = debounce((event) => {
      this.onChange(event);
    }, 300);

    this.bindEvents();
  }

  bindEvents() {
    this.addEventListener('change', this.debouncedOnChange.bind(this));
    this.drawer.addEventListener('keyup', (evt) => evt.code === 'Escape' && this.close());
    this.openButtons.forEach(button => button.addEventListener('click', this.open.bind(this)));
    this.closeButtons.forEach(button => button.addEventListener('click', this.close.bind(this)));
  }

  open() {
    this.drawer.setAttribute('aria-hidden', false);
    this.drawer.setAttribute('aria-expanded', true);

    this.overlay.classList.remove('invisible', 'opacity-0');
    this.overlay.addEventListener('click', event => {
      this.close();
    });

    document.body.classList.add('overflow-hidden');
  }

  close() {
    this.drawer.setAttribute('aria-hidden', true);
    this.drawer.removeAttribute('aria-expanded', true);

    this.overlay.classList.add('invisible', 'opacity-0');

    document.body.classList.remove('overflow-hidden');
  }

  onChange(event) {
    this.updateQuantity(event.target.dataset.index, event.target.value, document.activeElement.getAttribute('name'));
  }

  updateQuantity(line, quantity, name) {
    this.enableLoading(line);

    const body = JSON.stringify({
      line,
      quantity,
      sections: getSectionsToRender().map((section) => section.section),
      sections_url: window.location.pathname
    });

    fetch(`${routes.cart_change_url}`, {...fetchConfig(), ...{ body }})
      .then((response) => {
        return response.text();
      })
      .then((state) => {
        const parsedState = JSON.parse(state);

        getSectionsToRender().forEach((section => {
          const elementToReplace =
            document.getElementById(section.id).querySelector(section.selector) || document.getElementById(section.id);
            
          elementToReplace.innerHTML =
          getSectionInnerHTML(parsedState.sections[section.section], section.selector);

        }));

        this.disableLoading();
      }).catch(() => {
        this.disableLoading();
      });
  }

  enableLoading() {
    document.getElementById('cart-drawer-loading').classList.remove('hidden');
  }

  disableLoading() {
    document.getElementById('cart-drawer-loading').classList.add('hidden');
  }
}

customElements.define('cart-drawer', CartDrawer);
