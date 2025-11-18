const browser = require('webextension-polyfill');

const MAX_NODE_TREE_ASCENTION = 3;

export function removeForbiddenCharacters (str) {
  const regexpStr = [
    '[\\\\\?%*:|"<>',
    '\\/' , '\\.',
    ']'
  ].join('');

  const regexp = new RegExp(regexpStr, 'g');
  return str.replace(regexp, '_');
}

export function getCurrentTab () {
  return browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => tabs[0]);
}

export function isHTTPUrl (url) {
  return url.indexOf('http') === 0;
}

export function extractExtension (url) {
  return url.split(".").slice(-1)[0].split("?")[0].split("/")[0];
}

export function isVideo (url) {
  const extension = extractExtension(url);

  return ["mp4", "webm", "mov"].includes(extension);
}

export async function executeScript (tabId, file) {
  try {
    return await browser.scripting.executeScript({
      target: {
        tabId
      },
      files: [file],
    });
  } catch (e) {
    return await browser.tabs.executeScript(tabId, { file });
  }
}

export function isValidUrl (url) {
  return url && url !== null && url.length && url !== "null";
}
