// window.theme = window.theme || {};
// theme.config = {
//     bpSmall: false,
//     bpSmallValue: 589,
//     hasSessionStorage: true,
//     mediaQuerySmall: 'screen and (max-width: 589px)',
//     youTubeReady: false,
//     vimeoReady: false,
//     vimeoLoading: false,
//     isTouch: ('ontouchstart' in window) || window.DocumentTouch && window.document instanceof DocumentTouch || window.navigator.maxTouchPoints || window.navigator.msMaxTouchPoints ? true : false,
//     rtl: document.documentElement.getAttribute('dir') == 'rtl' ? true : false
//   };

// theme.LibraryLoader = (function() {
//     var types = {
//       link: 'link',
//       script: 'script'
//     };
  
//     var status = {
//       requested: 'requested',
//       loaded: 'loaded'
//     };
  
//     var cloudCdn = 'https://cdn.shopify.com/shopifycloud/';
  
//     var libraries = {
//       youtubeSdk: {
//         tagId: 'youtube-sdk',
//         src: 'https://www.youtube.com/iframe_api',
//         type: types.script
//       },
//       vimeo: {
//         tagId: 'vimeo-api',
//         src: 'https://player.vimeo.com/api/player.js',
//         type: types.script
//       },
//       shopifyXr: {
//         tagId: 'shopify-model-viewer-xr',
//         src: cloudCdn + 'shopify-xr-js/assets/v1.0/shopify-xr.en.js',
//         type: types.script
//       },
//       modelViewerUi: {
//         tagId: 'shopify-model-viewer-ui',
//         src: cloudCdn + 'model-viewer-ui/assets/v1.0/model-viewer-ui.en.js',
//         type: types.script
//       },
//       modelViewerUiStyles: {
//         tagId: 'shopify-model-viewer-ui-styles',
//         src: cloudCdn + 'model-viewer-ui/assets/v1.0/model-viewer-ui.css',
//         type: types.link
//       }
//     };
  
//     function load(libraryName, callback) {
//       var library = libraries[libraryName];
  
//       if (!library) return;
//       if (library.status === status.requested) return;
  
//       callback = callback || function() {};
//       if (library.status === status.loaded) {
//         callback();
//         return;
//       }
  
//       library.status = status.requested;
  
//       var tag;
  
//       switch (library.type) {
//         case types.script:
//           tag = createScriptTag(library, callback);
//           break;
//         case types.link:
//           tag = createLinkTag(library, callback);
//           break;
//       }
  
//       tag.id = library.tagId;
//       library.element = tag;
  
//       var firstScriptTag = document.getElementsByTagName(library.type)[0];
//       firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
//     }
  
//     function createScriptTag(library, callback) {
//       var tag = document.createElement('script');
//       tag.src = library.src;
//       tag.addEventListener('load', function() {
//         library.status = status.loaded;
//         callback();
//       });
//       return tag;
//     }
  
//     function createLinkTag(library, callback) {
//       var tag = document.createElement('link');
//       tag.href = library.src;
//       tag.rel = 'stylesheet';
//       tag.type = 'text/css';
//       tag.addEventListener('load', function() {
//         library.status = status.loaded;
//         callback();
//       });
//       return tag;
//     }
  
//     return {
//       load: load
//     };
//   })();
  
// window.vimeoApiReady = function() {
//     theme.config.vimeoLoading = true;
  
//     // Because there's no way to check for the Vimeo API being loaded
//     // asynchronously, we use this terrible timeout to wait for it being ready
//     checkIfVimeoIsReady()
//       .then(function() {
//         theme.config.vimeoReady = true;
//         theme.config.vimeoLoading = false;
//         document.dispatchEvent(new CustomEvent('vimeoReady'));
//       });
//   }
  
//   function checkIfVimeoIsReady() {
//     var wait;
//     var timeout;
  
//     var deferred = new Promise((resolve, reject) => {
//       wait = setInterval(function() {
//         if (!Vimeo) {
//           return;
//         }
  
//         clearInterval(wait);
//         clearTimeout(timeout);
//         resolve();
//       }, 500);
  
//       timeout = setTimeout(function() {
//         clearInterval(wait);
//         reject();
//       }, 4000); // subjective. test up to 8 times over 4 seconds
//     });
  
//     return deferred;
//   }
  
//   theme.VimeoPlayer = (function() {
//     var classes = {
//       loading: 'loading',
//       loaded: 'loaded',
//       interactable: 'video-interactable'
//     }
  
//     var defaults = {
//       byline: false,
//       loop: true,
//       muted: true,
//       playsinline: true,
//       portrait: false,
//       title: false
//     };
  
//     function VimeoPlayer(divId, videoId, options) {
//       this.divId = divId;
//       this.el = document.getElementById(divId);
//       this.videoId = videoId;
//       this.iframe = null;
//       this.options = options;
  
//       if (this.options && this.options.videoParent) {
//         this.parent = this.el.closest(this.options.videoParent);
//       }
  
//       this.setAsLoading();
  
//       if (theme.config.vimeoReady) {
//         this.init();
//       } else {
//         theme.LibraryLoader.load('vimeo', window.vimeoApiReady);
//         document.addEventListener('vimeoReady', this.init.bind(this));
//       }
//     }
  
//     VimeoPlayer.prototype = Object.assign({}, VimeoPlayer.prototype, {
//       init: function() {
//         var args = defaults;
//         args.id = this.videoId;
  
//         this.videoPlayer = new Vimeo.Player(this.el, args);
  
//         this.videoPlayer.ready().then(this.playerReady.bind(this));
//       },
  
//       playerReady: function() {
//         this.iframe = this.el.querySelector('iframe');
//         this.iframe.setAttribute('tabindex', '-1');
  
//         if (this.options.loop === 'false') {
//           this.videoPlayer.setLoop(false);
//         }
  
//         // When sound is enabled in section settings,
//         // for some mobile browsers Vimeo video playback
//         // will stop immediately after starting and
//         // will require users to tap the play button once more
//         if (this.options.style === 'sound') {
//          this.videoPlayer.setVolume(1);
//         } else {
//           this.videoPlayer.setVolume(0);
//         }
  
//         this.setAsLoaded();
  
//         // pause when out of view
//         var observer = new IntersectionObserver((entries, observer) => {
//           entries.forEach(entry => {
//             if (entry.isIntersecting) {
//               this.play();
//             } else {
//               this.pause();
//             }
//           });
//         }, {rootMargin: '0px 0px 50px 0px'});
  
//         observer.observe(this.iframe);
//       },
  
//       setAsLoading: function() {
//         if (!this.parent) return;
//         this.parent.classList.add(classes.loading);
//       },
  
//       setAsLoaded: function() {
//         if (!this.parent) return;
//         this.parent.classList.remove(classes.loading);
//         this.parent.classList.add(classes.loaded);
//         this.parent.classList.add(classes.interactable); // Once video is loaded, we should be able to interact with it
//         if (Shopify && Shopify.designMode) {
//           if (window.AOS) {AOS.refreshHard()}
//         }
//       },
  
//       enableInteraction: function() {
//         if (!this.parent) return;
//         this.parent.classList.add(classes.interactable);
//       },
  
//       play: function() {
//         if (this.videoPlayer && typeof this.videoPlayer.play === 'function') {
//           this.videoPlayer.play();
//         }
//       },
  
//       pause: function() {
//         if (this.videoPlayer && typeof this.videoPlayer.pause === 'function') {
//           this.videoPlayer.pause();
//         }
//       },
  
//       destroy: function() {
//         if (this.videoPlayer && typeof this.videoPlayer.destroy === 'function') {
//           this.videoPlayer.destroy();
//         }
//       }
//     });
  
//     return VimeoPlayer;
//   })();
  
//   window.onYouTubeIframeAPIReady = function() {
//     theme.config.youTubeReady = true;
//     document.dispatchEvent(new CustomEvent('youTubeReady'));
//   }

//     /*============================================================================
//     YouTube SDK method
//     Parameters:
//       - player div id (required)
//       - arguments
//         - videoId (required)
//         - videoParent (selector, optional for section loading state)
//         - events (object, optional)
//   ==============================================================================*/
//   theme.YouTube = (function() {
//     var classes = {
//       loading: 'loading',
//       loaded: 'loaded',
//       interactable: 'video-interactable'
//     }
  
//     var defaults = {
//       width: 1280,
//       height: 720,
//       playerVars: {
//         autohide: 0,
//         autoplay: 1,
//         cc_load_policy: 0,
//         controls: 0,
//         fs: 0,
//         iv_load_policy: 3,
//         modestbranding: 1,
//         playsinline: 1,
//         rel: 0
//       }
//     };
  
//     function YouTube(divId, options) {
//       this.divId = divId;
//       this.iframe = null;
  
//       this.attemptedToPlay = false;
  
//       // API callback events
//       defaults.events = {
//         onReady: this.onVideoPlayerReady.bind(this),
//         onStateChange: this.onVideoStateChange.bind(this)
//       };
  
//       this.options = Object.assign({}, defaults, options);
  
//       if (this.options) {
//         if (this.options.videoParent) {
//           this.parent = document.getElementById(this.divId).closest(this.options.videoParent);
//         }
  
//         // Most YT videos will autoplay. If in product media,
//         // will handle in theme.Product instead
//         if (!this.options.autoplay) {
//           this.options.playerVars.autoplay = this.options.autoplay;
//         }
  
//         if (this.options.style === 'sound') {
//           this.options.playerVars.controls = 1;
//           this.options.playerVars.autoplay = 0;
//         }
  
//       }
  
//       this.setAsLoading();
  
//       if (theme.config.youTubeReady) {
//         this.init();
//       } else {
//         theme.LibraryLoader.load('youtubeSdk');
//         document.addEventListener('youTubeReady', this.init.bind(this));
//       }
//     }
  
//     YouTube.prototype = Object.assign({}, YouTube.prototype, {
//       init: function() {
//         this.videoPlayer = new YT.Player(this.divId, this.options);
//       },
  
//       onVideoPlayerReady: function(evt) {
//         this.iframe = document.getElementById(this.divId); // iframe once YT loads
//         this.iframe.setAttribute('tabindex', '-1');
  
//         if (this.options.style !== 'sound') {
//           evt.target.mute();
//         }
  
//         // pause when out of view
//         var observer = new IntersectionObserver((entries, observer) => {
//           entries.forEach(entry => {
//             if (entry.isIntersecting) {
//               this.play();
//             } else {
//               this.pause();
//             }
//           });
//         }, {rootMargin: '0px 0px 50px 0px'});
  
//         observer.observe(this.iframe);
//       },
  
//       onVideoStateChange: function(evt) {
//         switch (evt.data) {
//           case -1: // unstarted
//             // Handle low power state on iOS by checking if
//             // video is reset to unplayed after attempting to buffer
//             if (this.attemptedToPlay) {
//               this.setAsLoaded();
//               this.enableInteraction();
//             }
//             break;
//           case 0: // ended, loop it
//             this.play(evt);
//             break;
//           case 1: // playing
//             this.setAsLoaded();
//             break;
//           case 3: // buffering
//             this.attemptedToPlay = true;
//             break;
//         }
//       },
  
//       setAsLoading: function() {
//         if (!this.parent) return;
//         this.parent.classList.add(classes.loading);
//       },
  
//       setAsLoaded: function() {
//         if (!this.parent) return;
//         this.parent.classList.remove(classes.loading);
//         this.parent.classList.add(classes.loaded);
//         if (Shopify && Shopify.designMode) {
//           if (window.AOS) {AOS.refreshHard()}
//         }
//       },
  
//       enableInteraction: function() {
//         if (!this.parent) return;
//         this.parent.classList.add(classes.interactable);
//       },
  
//       play: function() {
//         if (this.videoPlayer && typeof this.videoPlayer.playVideo === 'function') {
//           this.videoPlayer.playVideo();
//         }
//       },
  
//       pause: function() {
//         if (this.videoPlayer && typeof this.videoPlayer.pauseVideo === 'function') {
//           this.videoPlayer.pauseVideo();
//         }
//       },
  
//       destroy: function() {
//         if (this.videoPlayer && typeof this.videoPlayer.destroy === 'function') {
//           this.videoPlayer.destroy();
//         }
//       }
//     });
  
//     return YouTube;
//   })();

//   const videoPlayers = document.querySelectorAll("[data-video-player]")

//   function initVideoPlayer(type, videoId, sectionId){
//     let videoObject
//     switch(type) {
//         case 'youtube':
//             videoObject = new theme.YouTube(
//                 'YouTubeVideo-' + sectionId,
//                 {
//                   videoId: videoId
//                 }
//             );
//         break;
//         case 'vimeo':
//             videoObject = new theme.VimeoPlayer(
//                 'Vimeo-' + sectionId,
//                 videoId
//               );        
//         break;
//         // case 'mp4':
//         //     var mp4Video = 'Mp4Video-' + sectionId;
//         //     var mp4Div = document.getElementById(mp4Video);
//         //     // var parent = mp4Div.closest(selectors.videoParent);
    
//         //     if (mp4Div) {
//         //     parent.classList.add('loaded');
    
//         //     var playPromise = document.querySelector('#' + mp4Video).play();
    
//         //     // Edge does not return a promise (video still plays)
//         //     if (playPromise !== undefined) {
//         //         playPromise.then(function() {
//         //             // playback normal
//         //         }).catch(function() {
//         //             mp4Div.setAttribute('controls', '');
//         //             parent.classList.add('video-interactable');
//         //         });
//         //     }
//         //     }
//         // break;
//     }
    
//   }

//   videoPlayers.forEach(player => {
//     initVideoPlayer(player.dataset.type, player.dataset.videoId || '', player.dataset.sectionId);
//   })