import { debounce } from "../helpers";

export default class PredictiveSearch extends HTMLElement {
  constructor() {
    super();

    this.input = this.querySelector('input[type="search"]');
    this.predictiveSearchResults = this.querySelector('.predictive-search');

    this.input.addEventListener('input', debounce((event) => {
      this.onChange(event);
    }, 300).bind(this));
  }

  onChange() {
    const searchTerm = this.input.value.trim();

    if (!searchTerm.length) {
      this.close();
      return;
    }

    this.getSearchResults(searchTerm);
  }

  getSearchResults(searchTerm) {
    fetch(`/search/suggest?type=product&options%5Bprefix%5D=last&q=${searchTerm}&section_id=predictive-search`)
      .then((response) => {
        if (!response.ok) {
          var error = new Error(response.status);
          this.close();
          throw error;
        }

        return response.text();
      })
      .then((text) => {
        const resultsMarkup = new DOMParser().parseFromString(text, 'text/html').querySelector('#shopify-section-predictive-search').innerHTML;
        this.predictiveSearchResults.innerHTML = resultsMarkup;
        this.open();
      })
      .catch((error) => {
        this.close();
        throw error;
      });
  }

  open() {
    this.predictiveSearchResults.style.display = 'block';

    // Show all results
    this.querySelector('[data-submit]').addEventListener('click', this.onSubmit.bind(this));
  }

  close() {
    // this.predictiveSearchResults.style.display = 'none';
  }

  onSubmit(event) {
    event.preventDefault();

    this.querySelector('form').submit();
  }
}

window.customElements.define('predictive-search', PredictiveSearch);