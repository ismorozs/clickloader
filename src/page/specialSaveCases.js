export default {
  'www.instagram.com': {

    'div._9AhH0': (el) => ({
      src: el.previousElementSibling.firstElementChild.src,
      extension: '.jpg'
    }),

    'img._6q-tv': (el) => ({
      src: el.src,
      extension: '.jpg'
    })

  }
};
