function swiperInit() {
    const swipers = document.querySelectorAll('[data-swiper]')
  
    swipers.forEach(s => {
      // let options, swiper;
      // const overlay = document.createElement("div")
      // overlay.classList.add("prevent-interaction")

      s.appendChild(overlay)

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
              preventClicks: true,
              preventClicksPropagation: true,
              // initialSlide: s.querySelector('[data-initial-slide="true"]') ? s.querySelector('[data-initial-slide="true"]').getAttribute("data-media-index") : 0,
              navigation: {
                nextEl: `.swiper-button-next-${s.dataset.sectionId}`,
                prevEl: `.swiper-button-prev-${s.dataset.sectionId}`,
              },
              on: {
                slideChange: function(swiper) {
                    s.querySelector(`[data-active-slide="${s.dataset.sectionId}"]`).innerText = ( swiper.realIndex + 1 )
                },
                init: function(swiper) {
                  // console.log("swiper init")
                  s.classList.remove("pointer-events-none")
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
              preventClicks: true,
              preventClicksPropagation: true,
              mousewheel: {
                enabled: false
              },
              freeMode: {
                enabled: false,
                sticky: false,
              },
              breakpoints: {
                768: {
                  freeMode: {
                    enabled: true,
                    sticky: false,
                  },
                  mousewheel: {
                    enabled: true,
                    releaseOnEdges: false,
                    forceToAxis: true,
                  }
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

    // document.addEventListener("DOMContentLoaded", () => {
    //   const overlays = document.querySelectorAll(".swiper .prevent-interaction")
      
    //   if (!overlays) return
    //   overlays.forEach( o => {
    //     console.log("removed: ", o)
    //     // o.remove()
    //   })
    // })

    // window.addEventListener("load", (event) => {
    //   const overlays = document.querySelectorAll(".swiper .prevent-interaction")
      
    //   if (!overlays) return
    //   overlays.forEach( o => {
    //     o.remove()
    //   })
    // });
  }
  
  export default swiperInit