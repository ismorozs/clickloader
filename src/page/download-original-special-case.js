const browser = require("webextension-polyfill/dist/browser-polyfill.min");

import { MESSAGES } from "../shared/consts";

browser.runtime.onMessage.addListener(onMessage);

function onMessage ({ imageSelector, reason, galleryTabId, tabWithOriginId, thumbUrl, title, href }) {
  const img = document.querySelector(imageSelector);
  const url = img && img.src;

  browser.runtime.sendMessage({
    type: MESSAGES.RECEIVE_ORIGINAL_URL,
    title,
    href,
    thumbUrl,
    originalUrl: url,
    originalHref: document.location.href,
    originalTitle: document.title,
    reason,
    galleryTabId,
    tabWithOriginId,
    isFromSpecialCase: true,
  });
}
