const browser = require("webextension-polyfill/dist/browser-polyfill.min");
const { MESSAGES } = require("../shared/consts");
import { tryFindHref } from "../shared/helpers";
const { getSpecialRule } = require("../background/actions");

const REDUNDANT_ELEMENTS = ["SCRIPT", "IFRAME"];

browser.runtime.onMessage.addListener(onMessage);

function onMessage (message) {
  switch (message.type) {
    case MESSAGES.GET_PICTURE_URLS:
      getAllThumbsAndOriginalHrefs(message);
      break;
  }
}

async function getAllThumbsAndOriginalHrefs ({ specialRules }) {
  const [ , S_THUMB_SELECTOR, S_ORIGINAL_SELECTOR ] = getSpecialRule(document.location.href, specialRules)
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
        isPreloaded,
        originalUrl: isPreloaded && a && a.href,
      };
    });

  await browser.runtime.sendMessage({
    type: MESSAGES.RECEIVE_IMAGES_URLS,
    title: document.title,
    href: document.location.href,
    urls,
  });

  browser.runtime.onMessage.removeListener(onMessage);
}
