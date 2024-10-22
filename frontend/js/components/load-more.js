var LoadMore = class extends HTMLElement {
    constructor() {
      super();
  
      this.dataUrl = this.dataset.url
      this.target = document.querySelector(this.dataset.target)
      this.loadMoreWrapper = this.parentElement
  
      this.addEventListener("click", function(e){
        e.preventDefault();
  
        this.closest('nav').classList.add("loading")
  
        fetch(this.dataUrl).then(response => response.text()).then((responseText) => {
          const html = responseText;
          const htmlContent = new DOMParser().parseFromString(html, 'text/html')
  
            this.replaceContent(htmlContent.querySelector(this.dataset.target).innerHTML)
          this.loadMoreWrapper.innerHTML = htmlContent.querySelector(".load-more-wrapper ul").innerHTML || ""  
        }).then(() => {
            // this.closest('nav').classList.remove("loading")
        })
      }.bind(this))
    }

    replaceContent(content) {
        this.target.innerHTML = this.target.innerHTML + content;
    }
  }
  
  window.customElements.define('load-more', LoadMore)

  var PaginationButton = class extends LoadMore {
    constructor() {
        super()
    }

    replaceContent(content) {
        this.target.innerHTML = content;
        this.target.scrollIntoView()
    }
  }

  window.customElements.define('pagination-button', PaginationButton)