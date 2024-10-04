class collectionFilters extends HTMLElement {
  constructor() {
    super();

    // console.log(location.pathname, location.href, window.location.pathname)
    
    this.grid = document.querySelector('#product-grid');
    this.form = document.querySelector('.filters-form');
    this.filters = document.querySelector('#filter-dropdowns');
    this.pageOverlay = document.querySelector('.page-overlay');

    this.drawer = this.querySelector('.filters-slideout');
    this.dropdownButtons = document.querySelectorAll('.dropdown-header');
    this.filterButtons = document.querySelectorAll('.filter-button');

    this.sortForm = this.querySelector('.sort-form');
    this.sortBy = this.dataset.currentSort;

    this.openFilterButtons = document.querySelectorAll('.js-open-filters');
    this.closeFilterButtons = document.querySelectorAll('.js-close-filters');

    this.setListeners();
  }

  setListeners() {
    // Handle Dropdown Click
    this.dropdownButtons.forEach(item => {
      item.addEventListener('click', this.handleDropdownClick);
    });

    // Handle Form Change
    this.form.addEventListener('change', event => {
      console.log("change")
      this.reloadSections();
      // this.handleFilterClick(event.target);
    });

    // Handle Sort form 
    this.sortForm.addEventListener('change', event => {
      event.preventDefault();
      
      this.handleSortClick(event.target);
    });

    // Remove Filters
    this.addEventListener('click', event => {
      const button = event.target.closest('.remove-filter');
      if (button) {
        event.preventDefault();
        this.removeSelectedFilter(button.dataset.filter);
      }
    });

    // Clear All Filters
    this.addEventListener('click', event => {
      const button = event.target.closest('.js-clear-all-filters');
      if (button) {
        event.preventDefault();
        this.clearAllFilters();
      }
    });

    // Open
    this.openFilterButtons.forEach(filter => {
      filter.addEventListener('click', event => {
        this.open();
      });
    });

    // Close
    this.closeFilterButtons.forEach(filter => {
      filter.addEventListener('click', event => {
        this.close();
      });
    });
  }

  open() {
    event.preventDefault();

    this.drawer.setAttribute('aria-hidden', false);
    this.drawer.setAttribute('aria-expanded', true);

    document.body.classList.add('overflow-hidden');
    this.pageOverlay.classList.remove('invisible', 'opacity-0');

    this.pageOverlay.addEventListener('click', event => {
      this.close();
    });
  }

  close() {
    event.preventDefault();
  
    this.drawer.setAttribute('aria-hidden', true);
    this.drawer.setAttribute('aria-expanded', false);

    document.body.classList.remove('overflow-hidden');
    this.pageOverlay.classList.add('invisible', 'opacity-0');

    this.dropdownButtons.forEach(dropdown => {
      dropdown.classList.remove('active');
    });
  }

  handleDropdownClick(event) {
    event.preventDefault();

    if (this.classList.contains('active')) {
      this.classList.remove('active');
    } else {
      if (window.innerWidth > 767) {
        const activeDropdown = document.querySelector('.dropdown-header.active')
        if (activeDropdown) activeDropdown.classList.remove('active')
      }
      this.classList.add('active');
    }
  }

  handleFilterClick() {
    this.reloadSections();
  }

  removeSelectedFilter(filter) {
    return
    this.querySelector(`input[data-filter="${filter}"]`).checked = false;

    console.log(this.querySelector(`input[data-filter="${filter}"]`).checked)

    this.form.dispatchEvent(new Event('change'))

    // this.reloadSections();
  }

  handleSortClick(target) {
    const sort = target.value;
    this.sortBy = sort;

    this.sortForm.querySelector('.dropdown').classList.remove('active');
    // this.querySelector('.dropdown-header-sort').classList.remove('active');
    
    this.reloadSections();
  }

  clearCategoryFilters() {
    event.preventDefault();
    event.stopImmediatePropagation();

    event.target.parentElement.querySelectorAll('.filter-button').forEach(item => {
      item.removeAttribute('checked');
    });

    this.reloadSections();
  }

  clearAllFilters() {
    event.preventDefault();
    event.stopImmediatePropagation();

    document.querySelectorAll('.filter-button').forEach(item => {
      item.removeAttribute('checked');
    });

    this.reloadSections();
    this.close();
  }

  reloadSections(newUrl) {
    let url = '';
    
    const formData = new FormData(this.form);
    const searchParams = new URLSearchParams(formData).toString();
    let sortByText = searchParams ? '&sort_by=' : 'sort_by=';
    
    url = location.pathname + '?' + searchParams + sortByText + this.sortBy;

    if (history.replaceState) {
      window.history.pushState({ path: url }, '', url);
    }

    // Fetch and replace sections
    this.enableLoading();
    fetch(url)
      .then(response => response.text())
      .then((responseText) => {
        const html = responseText;
        const htmlContent = new DOMParser().parseFromString(html, 'text/html');

        // Replace sections
        this.getSectionsToRender().forEach((section => {
          document.getElementById(section.id).innerHTML = htmlContent.getElementById(section.id).innerHTML;
        }));

        // Replace dropdown button text
        const dropdownButtonContents = this.querySelectorAll('.filter-dropdown');
        dropdownButtonContents.forEach(content => {
          const newContent = htmlContent.getElementById(content.id).innerHTML;
          content.innerHTML = newContent;
        });

        // Replace dropdown filters
        const dropdownContents = this.querySelectorAll('.filter-dropdown__content-container');
        dropdownContents.forEach(content => {
          const newContent = htmlContent.getElementById(content.id).innerHTML;
          content.innerHTML = newContent;
        });
      
        this.disableLoading();
      })
      .catch(() => {
        this.disableLoading();
      })
      .finally(() => {

      });
  }

  getSectionsToRender() {
    return [
      { id: 'product-grid' },
      { id: 'active-filters' },
      { id: 'active-filters-slideout' }
    ]
  }

  getSectionInnerHTML(html, selector) {
    return new DOMParser()
      .parseFromString(html, 'text/html')
      .querySelector(selector).innerHTML;
  }

  enableLoading() {
    // this.grid.classList.add('loading');
  }

  disableLoading() {
    // this.grid.classList.remove('loading');
  }
}

customElements.define('collection-filters', collectionFilters);