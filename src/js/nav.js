function toggleMenu(event) {
  event.preventDefault();
  let navMenu = document.querySelector('.collapse');
  navMenu.classList.toggle('in');
}

let navButton = document.querySelector('.navbar-toggle');
navButton.addEventListener('click', toggleMenu);
