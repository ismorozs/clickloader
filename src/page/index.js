const browser = require("webextension-polyfill/dist/browser-polyfill.min");

import { getSpecialRule } from '../background/actions';
import { EXTRACTION_REASON, MESSAGES } from '../shared/consts';

function init () {
  if (!window.hasRun) {
    window.hasRun = true;
    browser.runtime.onMessage.addListener(onMessage);
  }
}

function onMessage (message) {
  switch (message.type) {
    case MESSAGES.RECEIVE_IMAGES_URLS:
      break;

    default:
      switchClickHandler(message);
      window.saveMethod = message.saveMethod;
      window.specialRules = message.specialCases;
  }
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

  const { thumbUrl, originalHref } = extractSrc(e.target);
  if (thumbUrl || originalHref) {
    browser.runtime.sendMessage({
      type: MESSAGES.RECEIVE_ORIGINAL_URL,
      title: document.title,
      thumbUrl,
      originalHref,
      href: document.location.href,
      reason: EXTRACTION_REASON.DOWNLOAD,
    });
  }
}

function extractSrc (el) {
  let url;

  const testEl = document.createElement(el.tagName);
  const possibleSources = el.querySelectorAll('source');
  if (possibleSources.length) {
    for (let i = 0; i < possibleSources.length; i++) {
      const source = possibleSources[i];

      if (!!testEl.canPlayType(source.type)) {
        url = source.src;
        break;
      }
    }

    if (!url) {
      url = possibleSources[0].src;
    }
  } else {
    url = el.src;
  }

  const a = el.closest("a");
  const originalHref = a && a.href;

  return { thumbUrl: url, originalHref };
}

export default init;