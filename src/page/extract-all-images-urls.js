const browser = require("webextension-polyfill/dist/browser-polyfill.min");

import { downloadAllAsArchive } from "./download-all-as-archive";
import Popup from "./download-popup";

const { MESSAGES, COLLECTING_REASON } = require("../shared/consts");
const { getSpecialRule } = require("../background/actions");

const REDUNDANT_ELEMENTS = ["SCRIPT", "IFRAME"];

browser.runtime.onMessage.addListener(onMessage);

function onMessage (message) {
  switch (message.type) {
    case MESSAGES.GET_PICTURE_URLS:
      getAllThumbsAndOriginalHrefs(message);
      break;

    case MESSAGES.RECEIVE_DOWNLOADING_PROGRESS:
      updateDownloadingPopup(message);
      break;

    case MESSAGES.RECEIVE_PRELOADED_IMAGES_URLS:
      downloadAllAsArchive(message);
      break;
  }
}

async function getAllThumbsAndOriginalHrefs ({ specialRules, naming, reason, tabId }) {
  const [ , S_THUMB_SELECTOR, S_ORIGINAL_SELECTOR, S_NAMING ] = getSpecialRule(document.location.href, specialRules)
  const imageSelector = S_THUMB_SELECTOR || "[src]";

  let urls = Array.from(document.querySelectorAll(imageSelector))
    .filter((el) => {
      return !REDUNDANT_ELEMENTS.includes(el.nodeName);
    })
    .map((img) => {
      const a = img.closest("a");
      const isPreloaded = !S_ORIGINAL_SELECTOR;

      return {
        thumbUrl: img.src,
        originalHref: a && a.href,
        href: document.location.href,
        origin: document.location.origin,
        title: document.title,
        isPreloaded,
        originalUrl: isPreloaded && a && a.href,
        imageSelector: S_ORIGINAL_SELECTOR,
        naming: S_NAMING || naming,
      };
    });

  await browser.runtime.sendMessage({
    type: MESSAGES.RECEIVE_IMAGES_URLS,
    title: document.title,
    href: document.location.href,
    origin: document.location.origin,
    urls,
    reason,
    tabId,
  });

  if (reason !== COLLECTING_REASON.FOR_GALLERY) {
    Popup.build(urls.length);
    return;
  }

  browser.runtime.onMessage.removeListener(onMessage);
}

function updateDownloadingPopup ({ count, filename }) {
  Popup.update(count, filename);

  if (!count) {
    browser.runtime.onMessage.removeListener(onMessage);
  }
}