(function () {
  if (window.hasRun) return;
  window.hasRun = true;


  browser.runtime.onMessage.addListener(onMessage);

  function onMessage (message) {
    if (message.senderId !== browser.runtime.id) {
      return;
    }

    switchClickHandler(message);
  }

  function switchClickHandler (data) {
    const operation = data.activate ? 'add' : 'remove';
    document.querySelectorAll('img, audio, video')
      .forEach((el) => window[operation + 'EventListener']('contextmenu', sendImageUrl));
  }

  function sendImageUrl (e) {
    e.preventDefault();
    const src = extractSrc(e.target);
    if (src) {
      browser.runtime.sendMessage({ src, senderId: browser.runtime.id });
    }
  }

  function extractSrc (el) {
    if (!!el.src) {
      return el.src;
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

    return src;
  }

})();
