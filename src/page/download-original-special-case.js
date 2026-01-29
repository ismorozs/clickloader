const browser = require("webextension-polyfill/dist/browser-polyfill.min");

import { MESSAGES } from "../shared/consts";

browser.runtime.onMessage.addListener(onMessage);

function onMessage ({ imageSelector, reason, tabId, tabWithOriginId, thumbUrl }) {
  const img = document.querySelector(imageSelector);
  const url = img && img.src;

  browser.runtime.sendMessage({
    type: MESSAGES.RECEIVE_ORIGINAL_URL,
    title: document.title,
    url,
    href: document.location.href,
    reason,
    tabId,
    isFromSpecialCase: true,
    tabWithOriginId,
    thumbUrl,
  });
}
