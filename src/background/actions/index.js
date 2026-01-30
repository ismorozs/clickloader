const browser = require("webextension-polyfill");

import State from "../../shared/state";
import {
  MESSAGES,
  SCRIPTS,
  EXTRACTION_REASON,
} from "../../shared/consts";
import {
  selectImageName,
  executeScript,
  extractExtension,
  getCurrentTab,
  isHTTPUrl,
} from "../../shared/helpers";
import { sendOriginalNotFoundError } from "./error";

const SETTINGS_PAGE_URL = "/options/options.html";

export async function runUserScript(newActiveState, newSaveMethod, tab) {
  if (!tab) {
    tab = await getCurrentTab();
  }

  if (!isHTTPUrl(tab.url)) {
    return !newActiveState;
  }

  let executeScriptPromise = Promise.resolve();
  let sendMessage = () => {};

  const stateOnTab = State.tabState(tab.id);
  if (!stateOnTab || stateOnTab.url !== tab.url) {
    if (!State.active() && !newActiveState) {
      return false;
    }

    executeScriptPromise = executeScript(tab.id, SCRIPTS.PAGE);
  }

  if (
    !stateOnTab ||
    stateOnTab.url !== tab.url ||
    stateOnTab.active !== newActiveState ||
    stateOnTab.saveMethod !== newSaveMethod
  ) {
    sendMessage = () =>
      browser.tabs.sendMessage(tab.id, {
        action: "switchClickHandler",
        active: newActiveState,
        saveMethod: newSaveMethod,
        specialCases: State.specialRules(),
      });
  }

  State.tabState(tab.id, {
    id: tab.id,
    active: newActiveState,
    saveMethod: newSaveMethod,
    url: tab.url,
  });

  executeScriptPromise.then(sendMessage);
  return newActiveState;
}

export async function saveContent(message) {
  const {
    title,
    thumbUrl,
    href,
    originalUrl,
    originalHref,
    originalTitle,
    isPreloaded,
    galleryTabId,
    isFromGallery,
    isFromSpecialCase,
  } = message;
  const [, , S_ORIGINAL_SELECTOR, S_NAMING, S_FOLDER_NAME] = getSpecialRule(
    href,
    State.specialRules(),
  );
  const tryOriginal = State.tryOriginal();
  const isValidOriginalHref =
    originalHref &&
    originalHref.length &&
    originalHref !== "null";

  if (
    !originalUrl &&
    !isFromSpecialCase &&
    isValidOriginalHref &&
    !isPreloaded &&
    S_ORIGINAL_SELECTOR &&
    (tryOriginal || isFromGallery)
  ) {
    try {
      await getImageUrlFromNextPage({
        title,
        href,
        thumbUrl,
        originalHref,
        imageSelector: S_ORIGINAL_SELECTOR,
        reason: EXTRACTION_REASON.DOWNLOAD,
      });
    } catch (e) {
      console.error(e);
    }
    return;
  }

  const saveFolder = `${State.saveFolder()}/${S_FOLDER_NAME}/`.replace(
    /\/+/g,
    "/",
  );

  const fileExtension = extractExtension(
    originalUrl || thumbUrl,
  );

  let [downloadUrl, extension] = [thumbUrl, fileExtension];

  if ((isFromGallery || tryOriginal) && !S_ORIGINAL_SELECTOR && isValidOriginalHref) {
    [downloadUrl, extension] = [originalHref, extractExtension(originalHref)];
  }

  if (originalUrl) {
    [downloadUrl, extension] = [originalUrl, fileExtension];
  }

  const name = selectImageName(S_NAMING || State.saveNaming(), title, href, downloadUrl);
  const fileName = `${saveFolder}${name}.${extension}`;

  try {
    await download(downloadUrl, fileName);
  } catch (e) {
    sendOriginalNotFoundError(galleryTabId, originalHref);
    await download(thumbUrl, fileName);
  }
}

export async function saveAllOriginalImagesRaw(message) {
  State.isDownloadingInProgress(true);

  for (let i = 0; i < message.urls.length; i++) {
    const { thumbUrl, originalHref, isPreloaded } = message.urls[i];

    if (State.isDownloadingInProgress()) {
      await saveContent({
        ...message,
        thumbUrl,
        originalHref,
        type: MESSAGES.SAVE_CONTENT,
        isPreloaded,
        isFromGallery: true,
        galleryTabId: message.tabId,
      });
      await sendDownloadingProgress(
        message.tabId,
        i + 1,
        `Downloading: ${originalHref}`,
      );
    }
  }
  sendDownloadingProgress(message.tabId, 0);
  State.isDownloadingInProgress(false);
}

export async function stopDownloading() {
  State.isDownloadingInProgress(false);
}

export async function sendDownloadingProgress(tabId, count, filename) {
  await browser.tabs.sendMessage(tabId, {
    type: MESSAGES.RECEIVE_DOWNLOADING_PROGRESS,
    count,
    filename,
  });
}

async function download(url, filename) {
  await browser.downloads.download({ url, saveAs: false, filename });
}

export async function getImageUrlFromNextPage({
  originalHref,
  imageSelector,
  reason,
  galleryTabId,
  thumbUrl,
  title,
  href,
}) {
  const newTab = await browser.tabs.create({
    url: originalHref,
    active: false,
  });

  await executeScript(newTab.id, SCRIPTS.DOWNLOAD_ORIGINAL_IMAGE_URL);
  await browser.tabs.sendMessage(newTab.id, {
    imageSelector,
    reason,
    galleryTabId,
    tabWithOriginId: newTab.id,
    thumbUrl,
    title,
    href,
  });
}

export function getSpecialRule(url, specialRules) {
  for (const params of specialRules) {
    if (url.startsWith(params[0])) {
      return params;
    }
  }

  return [];
}

export function openSettings() {
  browser.tabs.create({ active: true, url: SETTINGS_PAGE_URL });
}
