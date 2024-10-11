// Main product slider
// const productSlider = new Swiper('.product-slider', {
//   slidesPerView: 1,
//   loop: false,
//   spaceBetween: 20,
//   pagination: {
//     el: '.product-slider-pagination'
//   }
// });

customElements.define('product-form', class ProductForm extends HTMLElement {
  constructor() {
    super();   

    this.form = this.querySelector('form');
    this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
    this.cartDrawer = document.querySelector('cart-drawer');
  }

  onSubmitHandler(event) {
    event.preventDefault();
    
    const submitButton = this.querySelector('[type="submit"]');

    submitButton.setAttribute('disabled', true);
    submitButton.classList.add('loading');

    const body = JSON.stringify({
      ...JSON.parse(serializeForm(this.form)),
      sections: getSectionsToRender().map((section) => section.section),
      sections_url: window.location.pathname
    });

    fetch(`${routes.cart_add_url}`, { ...fetchConfig('javascript'), body })
      .then((response) => response.json())
      .then((parsedState) => {

        getSectionsToRender().forEach((section => {
          const elementToReplace =
            document.getElementById(section.id).querySelector(section.selector) || document.getElementById(section.id);

          elementToReplace.innerHTML =
            getSectionInnerHTML(parsedState.sections[section.section], section.selector);

        }));
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        submitButton.classList.remove('loading');
        submitButton.removeAttribute('disabled');
        this.cartDrawer.open();
      });
  }
});