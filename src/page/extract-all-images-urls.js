const browser = require("webextension-polyfill/dist/browser-polyfill.min");
const { MESSAGES } = require("../shared/consts");
import { tryFindHref } from "../shared/helpers";
const { getSpecialRule } = require("../background/actions");

const REDUNDANT_ELEMENTS = ["SCRIPT", "IFRAME"];

browser.runtime.onMessage.addListener(onMessage);

function onMessage (message) {
  switch (message.type) {
    case MESSAGES.GET_PICTURE_URLS:
      getPictureUrls(message);
      break;
  }
}

async function getPictureUrls ({ specialRules }) {
  const specialRule = getSpecialRule(document.location.href, specialRules)
  const imageSelector = specialRule[1] || "[src]";

  let urls = Array.from(document.querySelectorAll(imageSelector))
    .filter((el) => {
      return !REDUNDANT_ELEMENTS.includes(el.nodeName);
    })
    .map((img) => {
      const a = img.closest("a");

      return {
        thumbUrl: img.src,
        originalUrl: a && a.href,
        isPreloaded: specialRule[2].length === 0
      };
    });

  await browser.runtime.sendMessage({
    type: MESSAGES.RECEIVE_IMAGES_URLS,
    title: document.title,
    url: document.location.href,
    urls,
  });

  browser.runtime.onMessage.removeListener(onMessage);
}
