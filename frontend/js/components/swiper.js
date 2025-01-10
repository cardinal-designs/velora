function swiperInit() {
    const swipers = document.querySelectorAll('[data-swiper]')
  
    swipers.forEach(s => {
      let options, swiper;
      switch(s.dataset.swiper) {
        // Hero Section
        case 'hero':
          options = {
              slidesPerView: 1,
              spaceBetween: 0,
              effect: "fade",
              autoplay: {
                  delay: 4000,
                  disableOnInteraction: false,
              },
              pagination: {
                el: ".swiper-pagination",
                clickable: true,
                renderBullet: function (index, className) {
                  return '<span class="swiper-hero-bullet ' + className + '">' + ' ' + "</span>";
                },
              },
          }
          if(s.classList.contains("swiper-initialized")) return
          swiper = new Swiper(s, options)
          break;
        case 'product-media':
          options = {
              slidesPerView: 1,
              spaceBetween: 0,
              navigation: {
                nextEl: `.swiper-button-next-${s.dataset.sectionId}`,
                prevEl: `.swiper-button-prev-${s.dataset.sectionId}`,
              },
              on: {
                slideChange: function() {
                    s.querySelector(`[data-active-slide="${s.dataset.sectionId}"]`).innerText = ( swiper.realIndex + 1 )
                }
              }
          }
          if(s.classList.contains("swiper-initialized")) return
          swiper = new Swiper(s, options)
          break;
        case 'product-carousel':
          options = {
              slidesPerView: 'auto',
              spaceBetween: 20,
              mousewheel: {
                enabled: false
              },
              freeMode: {
                enabled: false
              },
              breakpoints: {
                768: {
                  mousewheel: {
                    enabled: true,
                    releaseOnEdges: false,
                    forceToAxis: true,
                  },
                  freeMode: {
                    enabled: true
                  },
                }
              }
          }
          if(s.classList.contains("swiper-initialized")) return
          swiper = new Swiper(s, options)
          break;
        case 'press':
            options = {
                slidesPerView: 1,
                spaceBetween: 0,
                effect: "fade",
                autoplay: {
                    delay: 4500,
                    disableOnInteraction: false,
                },
                navigation: {
                  nextEl: `.swiper-button-next-${s.dataset.sectionId}`,
                  prevEl: `.swiper-button-prev-${s.dataset.sectionId}`,
                },
                on: {
                    slideChange: function() {
                        let alpineObject = s.closest("div[x-data]")
                        if(!alpineObject) return
                        let scrollContainer = alpineObject.querySelector("[data-press-scroll]")
                        let activeThumb = alpineObject.querySelector(`[data-press-thumbs="${ swiper.activeIndex }"]`)

                        if(!activeThumb) return
                        alpineObject._x_dataStack[0].slide = swiper.activeIndex

                        if(swiper.activeIndex == 0 ){
                            scrollContainer.scrollLeft = 0 
                            return
                        }

                        let elRight = activeThumb.offsetLeft + activeThumb.offsetWidth;
                        let elLeft = activeThumb.offsetLeft;

                        let elParentRight = scrollContainer.offsetLeft + scrollContainer.offsetWidth;
                        let elParentLeft = scrollContainer.offsetLeft;

                        if (elRight > elParentRight + scrollContainer.scrollLeft) {
                            scrollContainer.scrollLeft = elRight - elParentRight + 30;
                        }
                        else if (elLeft < elParentLeft + scrollContainer.scrollLeft) {
                            scrollContainer.scrollLeft = elLeft - elParentLeft + 30;
                        }
                    },
                    activeIndexChange: function() {
                      s.closest('.shopify-section').querySelector(`[data-active-slide="${s.dataset.sectionId}"]`).innerText = ( swiper.activeIndex + 1 )
                    }
                }
            }

            if(s.classList.contains("swiper-initialized")) return
            swiper = new Swiper(s, options)
            break
        // case 'press-thumbs'
        case 'announcement':
          options = {
            slidesPerView: 1,
            spaceBetween: 0,
            effect: "fade",
            fadeEffect: { crossFade: true },
            autoplay: {
                delay: 4500,
                disableOnInteraction: false,
            }
          }
          if(s.classList.contains("swiper-initialized")) return
          swiper = new Swiper(s, options)
          break;
        default:
          options = s.dataset.options ? JSON.parse(`{${s.dataset.options}}`) : {slidesPerView: 1}
          if(s.classList.contains("swiper-initialized")) return
          swiper = new Swiper(s, options)
          break
      }
    })
  }
  
  export default swiperInit