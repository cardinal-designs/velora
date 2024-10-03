import 'vite/modulepreload-polyfill'
import Headroom from "headroom.js"
import Alpine from 'alpinejs'
import swiperInit from '@/global/swiper'
 
window.Alpine = Alpine
 
Alpine.start()

// set up header
let headroom = new Headroom(document.querySelector("[data-headroom]"), {
    // offset: document.querySelector("main section") ? document.querySelector("main section").offsetHeight : 30,
    offset: document.querySelector("[data-headroom]").offsetHeight + 20,
    classes: {
        initial: 'headroom-initialized'
    }
})
headroom.init()

swiperInit()