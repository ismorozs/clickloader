(function () {
  if (window.hasRun) return;
  window.hasRun = true;
  window.active = false;

  const SELECTORS = ['img', 'audio', 'video'];

  const SPECIAL_CASES = {
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
  }

  const SITE_SPECIAL_CASES = SPECIAL_CASES[window.location.hostname];

  if (SITE_SPECIAL_CASES) {
    const specialSelectors = Object.keys(SITE_SPECIAL_CASES)
    SELECTORS.splice.apply(SELECTORS, [0, 0].concat(specialSelectors))
  }

  browser.runtime.onMessage.addListener(onMessage);

  function onMessage (message) {
    if (message.senderId !== browser.runtime.id || window.active === message.activate) {
      return;
    }

    switchClickHandler(message);
    window.active = message.activate;
  }

  function switchClickHandler (data) {
    const operation = data.activate ? 'add' : 'remove';
    document.querySelectorAll(SELECTORS.join(', '))
      .forEach((el) => window[operation + 'EventListener']('contextmenu', sendImageUrl));
  }

  function sendImageUrl (e) {
    e.preventDefault();

    const srcData = extractSrc(e.target);
    if (srcData.src) {
      browser.runtime.sendMessage({
        src: srcData.src,
        senderId: browser.runtime.id,
        extension: srcData.extension || '',
      });
    }
  }

  function extractSrc (el) {
    if (SITE_SPECIAL_CASES) {
      for (let selector in SITE_SPECIAL_CASES) {
        if (el.matches(selector)) {
          return SITE_SPECIAL_CASES[selector](el);
        }
      }
    }

    if (!!el.src) {
      return { src: el.src };
    }

    const testEl = document.createElement(el.tagName);
    const possibleSources = el.querySelectorAll('source');

    let src = null;
    for (let i = 0; i < possibleSources.length; i++) {
      const source = possibleSources[i];

      if (!!testEl.canPlayType(source.type)) {
        src = source.src;
        break;
      }

    }

    if (!src) {
      src = possibleSources[0].src;
    }

    return { src };
  }

})();
