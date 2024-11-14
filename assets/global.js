/*================ Shopify Common JS ================*/
if ((typeof window.Shopify) == 'undefined') {
  window.Shopify = {};
}

Shopify.bind = function(fn, scope) {
  return function() {
    return fn.apply(scope, arguments);
  }
};

Shopify.setSelectorByValue = function(selector, value) {
  for (var i = 0, count = selector.options.length; i < count; i++) {
    var option = selector.options[i];
    if (value == option.value || value == option.innerHTML) {
      selector.selectedIndex = i;
      return i;
    }
  } 
};

Shopify.addListener = function(target, eventName, callback) {
  target.addEventListener ? target.addEventListener(eventName, callback, false) : target.attachEvent('on'+eventName, callback);
};

Shopify.postLink = function(path, options) {
  options = options || {};
  var method = options['method'] || 'post';
  var params = options['parameters'] || {};

  var form = document.createElement("form");
  form.setAttribute("method", method);
  form.setAttribute("action", path);

  for(var key in params) {
    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", key);
    hiddenField.setAttribute("value", params[key]);
    form.appendChild(hiddenField);
  }
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
};

Shopify.CountryProvinceSelector = function(country_domid, province_domid, options) {
  this.countryEl         = document.getElementById(country_domid);
  this.provinceEl        = document.getElementById(province_domid);
  this.provinceContainer = document.getElementById(options['hideElement'] || province_domid);

  if (this.countryEl) {
    Shopify.addListener(this.countryEl, 'change', Shopify.bind(this.countryHandler,this));

    this.initCountry();
    this.initProvince();
  }
};

Shopify.CountryProvinceSelector.prototype = {
  initCountry: function() {
    var value = this.countryEl.getAttribute('data-default');
    Shopify.setSelectorByValue(this.countryEl, value);
    this.countryHandler();
  },

  initProvince: function() {
    var value = this.provinceEl.getAttribute('data-default');
    if (value && this.provinceEl.options.length > 0) {
      Shopify.setSelectorByValue(this.provinceEl, value);
    }
  },

  countryHandler: function(e) {
    var opt       = this.countryEl.options[this.countryEl.selectedIndex];
    var raw       = opt.getAttribute('data-provinces');
    var provinces = JSON.parse(raw);

    this.clearOptions(this.provinceEl);
    if (provinces && provinces.length == 0) {
      this.provinceContainer.style.display = 'none';
    } else {
      for (var i = 0; i < provinces.length; i++) {
        var opt = document.createElement('option');
        opt.value = provinces[i][0];
        opt.innerHTML = provinces[i][1];
        this.provinceEl.appendChild(opt);
      }

      this.provinceContainer.style.display = "";
    }
  },

  clearOptions: function(selector) {
    while (selector.firstChild) {
      selector.removeChild(selector.firstChild);
    }
  },

  setOptions: function(selector, values) {
    for (var i = 0, count = values.length; i < values.length; i++) {
      var opt = document.createElement('option');
      opt.value = values[i];
      opt.innerHTML = values[i];
      selector.appendChild(opt);
    }
  }
};

Shopify.formatMoney = function(cents, format = "") {
  if (typeof cents === "string") {
    cents = cents.replace(".", "");
  }
  const placeholderRegex = /\{\{\s*(\w+)\s*\}\}/, formatString = format || window.themeVariables.settings.moneyFormat;
  function defaultTo(value2, defaultValue) {
    return value2 == null || value2 !== value2 ? defaultValue : value2;
  }
  function formatWithDelimiters(number, precision, thousands, decimal) {
    precision = defaultTo(precision, 2);
    thousands = defaultTo(thousands, ",");
    decimal = defaultTo(decimal, ".");
    if (isNaN(number) || number == null) {
      return 0;
    }
    number = (number / 100).toFixed(precision);
    let parts = number.split("."), dollarsAmount = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + thousands), centsAmount = parts[1] ? decimal + parts[1] : "";
    return dollarsAmount + centsAmount;
  }
  let value = "";
  switch (formatString.match(placeholderRegex)[1]) {
    case "amount":
      value = formatWithDelimiters(cents, 2);
      break;
    case "amount_no_decimals":
      value = formatWithDelimiters(cents, 0);
      break;
    case "amount_with_space_separator":
      value = formatWithDelimiters(cents, 2, " ", ".");
      break;
    case "amount_with_comma_separator":
      value = formatWithDelimiters(cents, 2, ".", ",");
      break;
    case "amount_with_apostrophe_separator":
      value = formatWithDelimiters(cents, 2, "'", ".");
      break;
    case "amount_no_decimals_with_comma_separator":
      value = formatWithDelimiters(cents, 0, ",", ".");
      break;
    case "amount_no_decimals_with_space_separator":
      value = formatWithDelimiters(cents, 0, " ");
      break;
    case "amount_no_decimals_with_apostrophe_separator":
      value = formatWithDelimiters(cents, 0, "'");
      break;
  }
  if (formatString.indexOf("with_comma_separator") !== -1) {
    return formatString.replace(placeholderRegex, value);
  } else {
    return formatString.replace(placeholderRegex, value);
  }
}

/*================ Helper Functions ================*/
function getFocusableElements(container) {
  return Array.from(
    container.querySelectorAll(
      "summary, a[href], button:enabled, [tabindex]:not([tabindex^='-']), [draggable], area, input:not([type=hidden]):enabled, select:enabled, textarea:enabled, object, iframe"
    )
  );
}

const trapFocusHandlers = {};

function trapFocus(container, elementToFocus = container) {
  var elements = getFocusableElements(container);
  var first = elements[0];
  var last = elements[elements.length - 1];

  removeTrapFocus();

  trapFocusHandlers.focusin = (event) => {
    if (
      event.target !== container &&
      event.target !== last &&
      event.target !== first
    )
      return;

    document.addEventListener('keydown', trapFocusHandlers.keydown);
  };

  trapFocusHandlers.focusout = function() {
    document.removeEventListener('keydown', trapFocusHandlers.keydown);
  };

  trapFocusHandlers.keydown = function(event) {
    if (event.code.toUpperCase() !== 'TAB') return; // If not TAB key
    // On the last focusable element and tab forward, focus the first element.
    if (event.target === last && !event.shiftKey) {
      event.preventDefault();
      first.focus();
    }

    //  On the first focusable element and tab backward, focus the last element.
    if (
      (event.target === container || event.target === first) &&
      event.shiftKey
    ) {
      event.preventDefault();
      last.focus();
    }
  };

  document.addEventListener('focusout', trapFocusHandlers.focusout);
  document.addEventListener('focusin', trapFocusHandlers.focusin);

  elementToFocus.focus();
}

function removeTrapFocus(elementToFocus = null) {
  document.removeEventListener('focusin', trapFocusHandlers.focusin);
  document.removeEventListener('focusout', trapFocusHandlers.focusout);
  document.removeEventListener('keydown', trapFocusHandlers.keydown);

  if (elementToFocus) elementToFocus.focus();
}

// Here run the querySelector to figure out if the browser supports :focus-visible or not and run code based on it.
try {
  document.querySelector(":focus-visible");
} catch {
  focusVisiblePolyfill();
}

function focusVisiblePolyfill() {
  const navKeys = ['ARROWUP', 'ARROWDOWN', 'ARROWLEFT', 'ARROWRIGHT', 'TAB', 'ENTER', 'SPACE', 'ESCAPE', 'HOME', 'END', 'PAGEUP', 'PAGEDOWN']
  let currentFocusedElement = null;
  let mouseClick = null;

  window.addEventListener('keydown', (event) => {
    if(navKeys.includes(event.code.toUpperCase())) {
      mouseClick = false;
    }
  });

  window.addEventListener('mousedown', (event) => {
    mouseClick = true;
  });

  window.addEventListener('focus', () => {
    if (currentFocusedElement) currentFocusedElement.classList.remove('focused');

    if (mouseClick) return;

    currentFocusedElement = document.activeElement;
    currentFocusedElement.classList.add('focused');

  }, true);
}

function pauseAllMedia() {
  document.querySelectorAll('.js-youtube').forEach((video) => {
    video.contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
  });
  document.querySelectorAll('.js-vimeo').forEach((video) => {
    video.contentWindow.postMessage('{"method":"pause"}', '*');
  });
  document.querySelectorAll('video').forEach((video) => video.pause());
  document.querySelectorAll('product-model').forEach((model) => {
    if (model.modelViewerUI) model.modelViewerUI.pause();
  });
}

function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

function fetchConfig(type = 'json') {
  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': `application/${type}` }
  };
}

function getCookie(name) {
  var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  return v ? v[2] : null;
}

function setCookie(name, value, days) {
  var d = new Date;
  d.setTime(d.getTime() + 24*60*60*1000*days);
  document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
}

function slideUp(target, duration = 500) {
  target.style.transitionProperty = 'height, margin, padding';
  target.style.transitionDuration = duration + 'ms';
  target.style.boxSizing = 'border-box';
  target.style.height = target.offsetHeight + 'px';
  target.offsetHeight;
  target.style.overflow = 'hidden';
  target.style.height = 0;
  target.style.paddingTop = 0;
  target.style.paddingBottom = 0;
  target.style.marginTop = 0;
  target.style.marginBottom = 0;
  window.setTimeout( () => {
        target.style.display = 'none';
        target.style.removeProperty('height');
        target.style.removeProperty('padding-top');
        target.style.removeProperty('padding-bottom');
        target.style.removeProperty('margin-top');
        target.style.removeProperty('margin-bottom');
        target.style.removeProperty('overflow');
        target.style.removeProperty('transition-duration');
        target.style.removeProperty('transition-property');
        //alert("!");
  }, duration);
}

function slideDown(target, duration = 500) {
  target.style.removeProperty('display');
  let display = window.getComputedStyle(target).display;
  if (display === 'none') display = 'block';
  target.style.display = display;
  let height = target.offsetHeight;
  target.style.overflow = 'hidden';
  target.style.height = 0;
  target.style.paddingTop = 0;
  target.style.paddingBottom = 0;
  target.style.marginTop = 0;
  target.style.marginBottom = 0;
  target.offsetHeight;
  target.style.boxSizing = 'border-box';
  target.style.transitionProperty = "height, margin, padding";
  target.style.transitionDuration = duration + 'ms';
  target.style.height = height + 'px';
  target.style.removeProperty('padding-top');
  target.style.removeProperty('padding-bottom');
  target.style.removeProperty('margin-top');
  target.style.removeProperty('margin-bottom');
  window.setTimeout( () => {
    target.style.removeProperty('height');
    target.style.removeProperty('overflow');
    target.style.removeProperty('transition-duration');
    target.style.removeProperty('transition-property');
  }, duration);
}

function slideToggle(target, duration = 500) {
  if (window.getComputedStyle(target).display === 'none') {
    return slideDown(target, duration);
  } else {
    return slideUp(target, duration);
  }
}

function fadeIn(target, duration = 500) {
  target.style.display = '';
  target.style.opacity = 0;
  var last = +new Date();
  var tick = function() {
    target.style.opacity = +target.style.opacity + (new Date() - last) / duration;
    last = +new Date();
    if (+target.style.opacity < 1) {
      (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
    }
  };
  tick();
}

function fadeOut(target, duration = 500) {
  target.style.display = '';
  target.style.opacity = 1;
  let last = +new Date();
  let tick = function() {
    target.style.opacity = Number(+target.style.opacity - (new Date() - last) / duration).toFixed(4);
    last = +new Date();
    if (-target.style.opacity <= 0) {
      (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
    } else{
        target.style.opacity = 0;
    }
  };
  tick();
}

const serializeForm = form => {
  const obj = {};
  const formData = new FormData(form);
  for (const key of formData.keys()) {
    obj[key] = formData.get(key);
  }

  Object.keys(obj).forEach(k => {
    var path = k.replace(/\[/g, '.').replace(/\]/g, '').split('.'),
        last = path.pop();

    if (path.length) {
        path.reduce((o, p) => o[p] = o[p] || {}, obj)[last] = obj[k];
        delete obj[k];
    }
  });
  return JSON.stringify(obj);
};

function getSectionsToRender(isCartPage) {
  if (isCartPage) {
    return [
      {
        id: 'cart-icon-bubble',
        section: 'header',
        selector: '#cart-icon-bubble'
      },
      {
        id: 'main-cart-items',
        section: 'main-cart',
        selector: '#main-cart-items'
      }
    ];
  } else {
    return [
      {
        id: 'cart-drawer__inner',
        section: 'cart-drawer',
        selector: '#cart-drawer__inner',
      },
      {
        id: 'cart-icon-bubble',
        section: 'header',
        selector: '#cart-icon-bubble'
      }
    ];
  }
}

function getSectionInnerHTML(html, selector) {
  return new DOMParser()
    .parseFromString(html, 'text/html')
    .querySelector(selector).innerHTML;
}

/*================ Initialize ================*/
// Micromodal
MicroModal.init({
  openClass: 'is-open',
  disableScroll: true,
  disableFocus: true,
  awaitOpenAnimation: true,
  awaitCloseAnimation: true
});

function setCSSVariables() {
  const mainNav = document.querySelector("[id*='__header']")
  const announcementBar = document.querySelector("[id*='__announcement']")
  const footer = document.querySelector("footer")

  if(mainNav) {
    document.body.style.setProperty(`--nav-height`, `${mainNav.offsetHeight}px`)
  }
  if(announcementBar) {
      document.body.style.setProperty(`--announcement-bar-height`, `${announcementBar.offsetHeight}px`)
  }
  if(footer) {
      document.body.style.setProperty(`--footer-height`, `${footer.offsetHeight + parseInt(window.getComputedStyle(footer).marginTop)}px`)
  }
}

document.addEventListener("DOMContentLoaded", setCSSVariables())
document.addEventListener("resize", setCSSVariables())

/*================ Components ================*/
var QuantityInput = class extends HTMLElement {
  constructor() {
    super();
    this.input = this.querySelector('input');
    this.changeEvent = new Event('change', { bubbles: true })

    this.querySelectorAll('button').forEach(
      (button) => button.addEventListener('click', this.onButtonClick.bind(this))
    );
  }

  onButtonClick(event) {
    event.preventDefault();
    const previousValue = this.input.value;

    event.currentTarget.name === 'plus' ? this.input.stepUp() : this.input.stepDown();
    if (previousValue !== this.input.value) this.input.dispatchEvent(this.changeEvent);
  }
}

customElements.define('quantity-input', QuantityInput);

var VariantSelects = class extends HTMLElement {
  constructor() {
    super();
    this.addEventListener('change', this.onVariantChange);

    this.optionsApp = this.querySelector("#infiniteoptions-container")

    if (this.optionsApp) {
      const callback = (mutationList, observer) => {
        for (const mutation of mutationList) {
          if (mutation.type === "childList") {
            if (!this.optionsApp.closest('section').querySelector('div')) return

            this.insertBefore(this.optionsApp.closest('section').querySelector('div'), this.querySelector(".product-form-quantity"))
            observer.disconnect();
          }
        }
      };

      const config = { attributes: false, childList: true, subtree: false };
      const observer = new MutationObserver(callback);
      observer.observe(this.optionsApp, config);
    }
  }

  onVariantChange(event) {

    if(event.srcElement.name == 'quantity') return

    this.updateOptions();
    this.updateMasterId();
    this.toggleAddButton(true, '', false);
    this.updateVariantStatuses();

    if (!this.currentVariant) {
      this.toggleAddButton(true, '', true);
      this.setUnavailable();
    } else {
      this.updateMedia();
      this.updateURL();
      this.updateVariantInput();
      this.renderProductInfo();
    }
  }

  updateOptions() {
    this.options = Array.from(this.querySelectorAll('select'), (select) => select.value);
  }

  updateMasterId() {
    this.currentVariant = this.getVariantData().find((variant) => {
      return !variant.options.map((option, index) => {
        return this.options[index] === option;
      }).includes(false);
    });
  }

  updateMedia() {
    // if(this.getAttribute("data-section") == 'product-bar') return
    if( !this.closest(".product" )) return
    const slider = this.closest(".product").querySelector(".product-slider")
    if(!slider) return
    const newVariantImage = slider.querySelector(`[data-image-variants*="${this.currentVariant.id}"]`)
    
    if(newVariantImage) {
      const slideToIndex = newVariantImage.getAttribute("data-swiper-slide-index") || newVariantImage.getAttribute("data-media-index")
      slider.swiper.slideTo(slideToIndex)
    }
  }

  updateURL() {
    if (!this.currentVariant || this.dataset.updateUrl === 'false') return;
    window.history.replaceState({ }, '', `${this.dataset.url}?variant=${this.currentVariant.id}`);
  }

  updateVariantInput() {
    const productForms = document.querySelectorAll(`#product-form-${this.dataset.section}, #product-form-installment`);
    productForms.forEach((productForm) => {
      const input = productForm.querySelector('input[name="id"]');
      input.value = this.currentVariant.id;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  updatePickupAvailability() {
    const pickUpAvailability = document.querySelector('pickup-availability');
    if (!pickUpAvailability) return;

    if (this.currentVariant && this.currentVariant.available) {
      pickUpAvailability.fetchAvailability(this.currentVariant.id);
    } else {
      pickUpAvailability.removeAttribute('available');
      pickUpAvailability.innerHTML = '';
    }
  }

  renderProductInfo() {
    if(this.closest('[data-product-card]')){

      const imageWrapper = this.closest('[data-product-card]').querySelector("[data-image]")
      imageWrapper.classList.add("loading")

      let fetchUrl = new URL(`${this.dataset.url}`, window.shopUrl);
      let fetchParams = new URLSearchParams(fetchUrl.search);
      fetchParams.append('variant', `${this.currentVariant.id}`);
      fetchParams.append('section_id', `product-card-content`);

      fetch(`${fetchUrl.href}${fetchUrl.search == '' ? '?' : ''}${fetchParams.toString()}`)
      .then((response) => response.text())
      .then((responseText) => {
        const html = new DOMParser().parseFromString(responseText, 'text/html')

        if(!html.querySelector('[data-image]')) return
        const elementToReplace = imageWrapper.querySelector(`img`)
        imageWrapper.insertBefore(html.querySelector(`img`), elementToReplace)

        imageWrapper.querySelector(`img`).addEventListener("load", () => {
          imageWrapper.classList.remove("loading"); 
          elementToReplace.remove()
        },
        {once: true}
      )

      });
    } else {
      fetch(`${this.dataset.url}?variant=${this.currentVariant.id}&section_id=${this.dataset.section}`)
      .then((response) => response.text())
      .then((responseText) => {
        const id = `price-${this.dataset.section}`;
        const html = new DOMParser().parseFromString(responseText, 'text/html')
        const destination = document.getElementById(id);
        const source = html.getElementById(id);

        if (source && destination) destination.innerHTML = source.innerHTML;

        const price = document.getElementById(`price-${this.dataset.section}`);

        if (price) price.classList.remove('visibility-hidden');
        this.toggleAddButton(!this.currentVariant.available, window.variantStrings.soldOut);
      });
    }
  }

  toggleAddButton(disable = true, text, modifyClass = true) {
    const productForm = document.getElementById(`product-form-${this.dataset.section}`);
    if (!productForm) return;
    const addButton = productForm.querySelector('[name="add"]');
    const addButtonText = productForm.querySelector('[name="add"] > span');

    if (!addButton) return;

    if (disable) {
      addButton.setAttribute('disabled', 'disabled');
      if (text) addButtonText.innerHTML = text;
    } else {
      addButton.removeAttribute('disabled');
      addButtonText.innerHTML = window.variantStrings.addToCart;
    }

    if (!modifyClass) return;
  }

  setUnavailable() {
    const button = document.getElementById(`product-form-${this.dataset.section}`);
    const addButton = button.querySelector('[name="add"]');
    const addButtonText = button.querySelector('[name="add"] > span');
    const price = document.getElementById(`price-${this.dataset.section}`);
    if (!addButton) return;
    addButtonText.textContent = window.variantStrings.unavailable;
    if (price) price.classList.add('visibility-hidden');
  }

  getVariantData() {
    this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent);
    return this.variantData;
  }

  updateVariantStatuses() {
    const selectedOptionOneVariants = this.variantData.filter(
      (variant) => this.querySelector(':checked').value === variant.option1
    );
    const inputWrappers = [...this.querySelectorAll('.product-form-input')];
    inputWrappers.forEach((option, index) => {
      if (index === 0) return;
      const optionInputs = [...option.querySelectorAll('input[type="radio"], option')];
      const previousOptionSelected = inputWrappers[index - 1].querySelector(':checked').value;
      const availableOptionInputsValue = selectedOptionOneVariants
        .filter((variant) => variant.available && variant[`option${index}`] === previousOptionSelected)
        .map((variantOption) => variantOption[`option${index + 1}`]);
      this.setInputAvailability(optionInputs, availableOptionInputsValue);
    });
  }

  setInputAvailability(listOfOptions, listOfAvailableOptions) {
    listOfOptions.forEach((input) => {
      if (listOfAvailableOptions.includes(input.getAttribute('value'))) {
        input.nextElementSibling.classList.remove('opacity-50');
      } else {
        input.nextElementSibling.classList.add('opacity-50');
      }
    });
  }
}

customElements.define('variant-selects', VariantSelects);

var VariantRadios = class extends VariantSelects {
  constructor() {
    super();
  }

  updateOptions() {
    const fieldsets = Array.from(this.querySelectorAll('fieldset'));
    this.options = fieldsets.map((fieldset) => {
      return Array.from(fieldset.querySelectorAll('input')).find((radio) => radio.checked).value;
    });

    fieldsets.forEach( (f, index) => {
      f.querySelector("legend span:nth-of-type(2)").textContent = this.options[index]
    })
  }
}

customElements.define('variant-radios', VariantRadios);

var DropdownItem = class extends HTMLElement {
  constructor() {
    super();

    this.parent = this.querySelector('.dropdown') || this;
    this.header = this.querySelector('.dropdown-header');
    this.content = this.querySelector('.dropdown-content');

    this.header.addEventListener('click', this.onDropdownClick.bind(this));
  }

  onDropdownClick() {
    if (this.parent.classList.contains('active')) {
      this.parent.classList.remove('active');
      slideUp(this.content, 200);
    } else {
      this.parent.classList.add('active');
      slideDown(this.content, 200);
    }
  }
}

customElements.define('dropdown-item', DropdownItem);

class ProductRecommendations extends HTMLElement {
  constructor() {
    super();

    const handleIntersection = (entries, observer) => {
      if (!entries[0].isIntersecting) return;
      observer.unobserve(this);

      fetch(this.dataset.url)
        .then(response => response.text())
        .then(text => {
          const html = document.createElement('div');
          html.innerHTML = text;
          const recommendations = html.querySelector('product-recommendations');
          if (recommendations && recommendations.innerHTML.trim().length) {
            this.innerHTML = recommendations.innerHTML;
          }

          const recommendationSlider = new Swiper('.recommendation-slider', {
            slidesPerView: 1.5,
            spaceBetween: 20,
            loop: false,
            allowTouchMove: true,
            breakpoints: {
              768: {
                slidesPerView: 4,
                allowTouchMove: false,
              },
            }
          });
        })
        .catch(e => {
          console.error(e);
        });
    }

    new IntersectionObserver(handleIntersection.bind(this), {rootMargin: '0px 0px 200px 0px'}).observe(this);
  }
}

customElements.define('product-recommendations', ProductRecommendations);

class TextMarquee extends HTMLElement {
  constructor() {
    super();

    this.still = this.querySelector('.still');
    this.marquee = this.querySelector('.marquee');

    this.width = this.still.offsetWidth;

    this.handleMarquee(this.width);
    window.addEventListener('resize', this.handleMarquee.bind(this));
  }

  handleMarquee() {
    if (this.width >= window.innerWidth) {
      this.still.classList.add('hidden');
      this.marquee.classList.remove('hidden');
    } else {
      this.still.classList.remove('hidden');
      this.marquee.classList.add('hidden');
    }
  }
}

customElements.define('text-marquee', TextMarquee);