const links = document.querySelectorAll('.faq-link');

// // Highlight on scroll
// window.addEventListener('scroll', (event) => {
//   const fromTop = window.scrollY + 90;

//   links.forEach(link => {
//     const section = document.querySelector(`.faq-component[data-section="${link.dataset.section}"]`);

//     if (section) {
//       if (section.offsetTop <= fromTop && section.offsetTop + section.clientHeight > fromTop) {
//         link.classList.remove('opacity-40');
//       } else {
//         link.classList.add('opacity-40');
//       }
//     }
//   });
// });

// Scroll to link
// links.forEach(link => {
//   link.addEventListener('click', event => {
//     event.preventDefault();
//     const section = document.querySelector(`.faq-component[data-section="${event.currentTarget.dataset.section}"]`)

//     window.scrollTo({
//       top: section.offsetTop,
//       behavior: "smooth"
//     });
//   });
// });
