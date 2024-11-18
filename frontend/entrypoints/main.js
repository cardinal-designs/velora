import 'vite/modulepreload-polyfill'
import Headroom from "headroom.js"
import Alpine from 'alpinejs'
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { handleTab } from '../js/helpers';
import { initLoadingAnimations } from '../js/animations';
import swiperInit from '@/js/components/swiper';
 
window.Alpine = Alpine
 
Alpine.start()


// Add components
const components = import.meta.glob('../js/components/*.js',{ eager: true });

// set up header
let headroom = new Headroom(document.querySelector("[data-headroom]"), {
    offset: document.querySelector("main .shopify-section:first-of-type") ? document.querySelector("main .shopify-section:first-of-type").offsetHeight - 150 : 30,
    // offset: document.querySelector("[data-headroom]").offsetHeight + 20,
    classes: {
        initial: 'headroom-initialized'
    }
})
headroom.init()

swiperInit()

// Initialize animations
gsap.registerPlugin(ScrollTrigger);

// a11y tab handler
handleTab();

// Initialize animations
if (document.documentElement.classList.contains('enable-animations')) initLoadingAnimations();

if(document.querySelector("[data-logo-transition]")) {
  // Homepage
  const heroLogo = document.querySelector("[data-logo-transition]")

  const hero = heroLogo.closest(".shopify-section")
  const header = document.querySelector("header")
  const headerLogo = header.querySelector("[data-header-logo]")

  headerLogo.classList.add("opacity-0")

  // Other pages
  let firstSection = document.querySelector("#MainContent .shopify-policy__title") || document.querySelector("#MainContent .shopify-section:first-of-type")

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach( entry => {
        entry.target.classList.toggle("show", entry.isIntersecting)
        if(heroLogo){
            headerLogo.classList.toggle('opacity-0', entry.isIntersecting)
        }

      })
    },
    {
      rootMargin: `-${(header.clientHeight - 20)}px`,
      threshold: 0
    }
  )

  heroLogo != undefined ? observer.observe(heroLogo) : observer.observe(firstSection)

  gsap.registerPlugin(ScrollTrigger);

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      scrub: true,
      pin: false,
      
      start: "0%",
      end: "+=90%",
      markers: false
    }
  })
  
  .to(heroLogo, {
    scale: 0.1, 
    ease: "linear"
  })
}