const browser = require("webextension-polyfill/dist/browser-polyfill.min");

import { MESSAGES } from "../shared/consts";

browser.runtime.onMessage.addListener(onMessage);

function onMessage (message) {
  const img = document.querySelector(message.imageSelector);
  const url = img && img.src;

  browser.runtime.sendMessage({
    ...message,
    type: MESSAGES.RECEIVE_ORIGINAL_URL,
    originalUrl: url,
    originalHref: document.location.href,
    originalTitle: document.title,
    isFromSpecialCase: true,
    origin: document.location.origin,
  });
}
