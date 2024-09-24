const legalPopup = document.querySelector('.legal-popup');
const legalPopupCloseButtons = document.querySelectorAll('.legal-popup__close');
const isMobile = window.innerWidth < 768;

if (getCookie('legalCookie')) {
  legalPopup.setAttribute('aria-hidden', true);
} else {
  legalPopup.setAttribute('aria-hidden', false);
}

legalPopupCloseButtons.forEach(legalPopupClose => {
  legalPopupClose.addEventListener('click', event => {
    const day = legalPopup.dataset.day;

    legalPopup.setAttribute('aria-hidden', true);
    setCookie('legalCookie', true, day);
  });
});