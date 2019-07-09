const browser = require("webextension-polyfill/dist/browser-polyfill.min");

import SPECIAL_CASES from './specialSaveCases';

const SITE_SPECIAL_CASES = SPECIAL_CASES[window.location.hostname];

browser.runtime.onMessage.addListener(onMessage);

function onMessage (message) {
  switchClickHandler(message);
  window.saveMethod = message.saveMethod;
}

function switchClickHandler (data) {
  if (window.saveMethod !== data.saveMethod) {
    document.body.removeEventListener(window.saveMethod, sendImageUrl);
  }

  const operation = data.active ? 'add' : 'remove';
  document.body[operation + 'EventListener'](data.saveMethod, sendImageUrl);
}

function sendImageUrl (e) {
  if (window.saveMethod === 'mousedown' && !e.shiftKey) {
    return;
  }

  const srcData = extractSrc(e.target);
  if (srcData.src) {
    browser.runtime.sendMessage({
      src: srcData.src,
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

  if (!possibleSources.length) {
    return {};
  }

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
