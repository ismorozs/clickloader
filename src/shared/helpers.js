const browser = require('webextension-polyfill');

import { MAX_FILE_NAME } from "./consts";

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

export function createSafeFolderName (string) {
  let folderName = removeForbiddenCharacters(string)
    .replace(/\/+/g, "/")
    .replace(/^\/|\/$/g, "");

  return folderName;
}

export function isMediaResource (url, domainName) {
  return domainName.length && url.slice(domainName.length).split(".")[1] || url.split(".").length > 3;
}

function extractOriginalFileName (url) {
  return url.split("/").slice(-1)[0].split(".")[0];
}

export function getFileName (pictureData, idx) {
  const { thumbUrl, originalUrl, originalHref, origin, title, href, naming } = pictureData;

  const downloadUrl =
      originalUrl && isMediaResource(originalUrl, origin)
        ? originalUrl
        : thumbUrl;

  const name =
    naming === "URL"
      ? href
      : naming === "Original"
        ? extractOriginalFileName(originalUrl || originalHref)
        : title;

  const number = naming !== "Original" && idx ? ` (${idx})` : "";

  const fileName = `${removeForbiddenCharacters(name).substring(0, MAX_FILE_NAME)}${number}`;

  return [fileName, downloadUrl];
}

export function extractKeys (obj, keys) {
  const newObj = {};

  for (let key in obj) {
    if (keys.includes(key)) {
      newObj[key] = obj[key];
    }
  }

  return newObj;
}
