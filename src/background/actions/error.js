const browser = require("webextension-polyfill");

import { MESSAGES } from "../../shared/consts";

export const ERROR_TYPES = {
  ORIGINAL_NOT_FOUND: "ORIGINAL_NOT_FOUND",
};

export const sendError = (tabId, text) => {
  console.error(e.message, " !!! error during downloading");
  browser.tabs.sendMessage(tabId, {
    type: MESSAGES.ERROR,
    text,
    type,
  });
};

export const sendOriginalNotFoundError = (tabId, originalHref) => {
  sendError(
    tabId,
    `Couldn't find an original image on ${originalHref}, thumbnail will be saved instead.`,
  );
};
