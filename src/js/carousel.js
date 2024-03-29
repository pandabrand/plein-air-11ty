const swiperOptions = {
  slidesPerView: 1,
  spaceBetween: 10,
  breakpoints: {
    480: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 30,
    },
  },
  centerInsufficientSlides: true,
};

if( null !== document.querySelector('.artist-swiper') ) {
  const artistSwiper = new Swiper('.artist-swiper', {
    ...swiperOptions,
    navigation: {
      nextEl: '.artist-next',
      prevEl: '.artist-prev',
    }
  });
}

if( null !== document.querySelector('.leslie-swiper') ) {
  const leslieSwiper = new Swiper('.leslie-swiper', {
    ...swiperOptions,
    navigation: {
      nextEl: '.leslie-next',
      prevEl: '.leslie-prev',
    }
  });
}

if( null !== document.querySelector('.location-swiper') ) {
  const locationSwiper = new Swiper('.location-swiper', {
    ...swiperOptions,
    navigation: {
      nextEl: '.location-next',
      prevEl: '.location-prev',
    }
  });
}
