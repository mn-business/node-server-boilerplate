const header = document.getElementById('divHeader');
const headerHeight = header.getBoundingClientRect().height;

window.addEventListener('scroll', () => {
  if (window.scrollY > headerHeight) {
    header.classList.add('bg-base-100', 'shadow-sm');
  } else {
    header.classList.remove('bg-base-100', 'shadow-sm');
  }
});
