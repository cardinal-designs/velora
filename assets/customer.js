const selectors = {
  customerAddresses: '[data-customer-addresses]',
  addressCountrySelect: '[data-address-country-select]',
  addressContainer: '[data-address]',
  toggleAddressButton: 'button[aria-expanded]',
  cancelAddressButton: 'button[type="reset"]',
  deleteAddressButton: 'button[data-confirm-message]'
};

const attributes = {
  expanded: 'aria-expanded',
  confirmMessage: 'data-confirm-message'
};

class CustomerAddresses {
  constructor() {
    this.elements = this._getElements();
    if (Object.keys(this.elements).length === 0) return;
    this._setupCountries();
    this._setupEventListeners();
  }

  _getElements() {
    const container = document.querySelector(selectors.customerAddresses);
    return container ? {
      container,
      addressContainer: container.querySelector(selectors.addressContainer),
      toggleButtons: document.querySelectorAll(selectors.toggleAddressButton),
      cancelButtons: container.querySelectorAll(selectors.cancelAddressButton),
      deleteButtons: container.querySelectorAll(selectors.deleteAddressButton),
      countrySelects: container.querySelectorAll(selectors.addressCountrySelect)
    } : {};
  }

  _setupCountries() {
    if (Shopify && Shopify.CountryProvinceSelector) {
      // eslint-disable-next-line no-new
      new Shopify.CountryProvinceSelector('AddressCountryNew', 'AddressProvinceNew', {
        hideElement: 'AddressProvinceContainerNew'
      });

      this.elements.countrySelects.forEach((select) => {
        const formId = select.dataset.formId;
        // eslint-disable-next-line no-new
        new Shopify.CountryProvinceSelector(`AddressCountry_${formId}`, `AddressProvince_${formId}`, {
          hideElement: `AddressProvinceContainer_${formId}`
        });
      });
    }
  }

  _setupEventListeners() {
    this.elements.toggleButtons.forEach((element) => {
      element.addEventListener('click', this._handleAddEditButtonClick);
    });
    this.elements.cancelButtons.forEach((element) => {
      element.addEventListener('click', this._handleCancelButtonClick);
    });
    this.elements.deleteButtons.forEach((element) => {
      element.addEventListener('click', this._handleDeleteButtonClick);
    });
  }

  _toggleExpanded(target) {
    target.setAttribute(
      attributes.expanded,
      (target.getAttribute(attributes.expanded) === 'false').toString()
    );
  }

  _handleAddEditButtonClick = ({ currentTarget }) => {
    this._toggleExpanded(currentTarget);
  }

  _handleCancelButtonClick = ({ currentTarget }) => {
    this._toggleExpanded(
      currentTarget
        .closest(selectors.addressContainer)
        .querySelector(`[${attributes.expanded}]`)
    )
  }

  _handleDeleteButtonClick = ({ currentTarget }) => {
    // eslint-disable-next-line no-alert
    if (confirm(currentTarget.getAttribute(attributes.confirmMessage))) {
      Shopify.postLink(currentTarget.dataset.target, {
        parameters: { _method: 'delete' },
      });
    }
  }
}


const navLinkContainer = document.querySelector('.navigation-container');
const navLinks = document.querySelectorAll('.account-navigation-button');
const mobileButton = document.querySelector('.mobile-button');
const mobileButtonText = document.querySelector('.mobile-button-text');

// Handle Navigation Tabs
if (navLinks) {
  navLinks.forEach(navLink => {
    navLink.addEventListener('click', event => {
      const tab = navLink.dataset.tab;
      const tabName = navLink.innerHTML;

      document.querySelector('.account-navigation-button:not(.opacity-50)').classList.add('opacity-50');
      document.querySelector(`.account-navigation-button[data-tab="${tab}"]`).classList.remove('opacity-50');

      document.querySelector('.account-content:not(.hidden)').classList.add('hidden');
      document.querySelector(`.account-content[data-tab="${tab}"]`).classList.remove('hidden');

      mobileButtonText.innerHTML = tabName;
      if (mobileButton.classList.contains('active')) {
        slideUp(navLinkContainer, 300);
        mobileButton.classList.remove('active');
      }
    });
  });
}

// Handle Mobile Navigation Button
if (mobileButton) {
  mobileButton.addEventListener('click', event => {
    if (mobileButton.classList.contains('active')) {
      slideUp(navLinkContainer, 300);
      mobileButton.classList.remove('active');
    } else {
      slideDown(navLinkContainer, 300);
      mobileButton.classList.add('active');
    }
  });
}

// Change forgot password header
const forgotPassword = document.querySelector('.forgot-password');
if (forgotPassword) {
  forgotPassword.addEventListener('click', event => {
    document.querySelector('.account-header h1').innerHTML = 'Forgot Password?';
  });
}

const forgotPasswordCancel = document.querySelector('.forgot-password-cancel');
if (forgotPasswordCancel) {
  document.querySelector('.forgot-password-cancel').addEventListener('click', event => {
    document.querySelector('.account-header h1').innerHTML = 'Log In';
  });
}