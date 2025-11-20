const browser = require('webextension-polyfill');

import State from '../shared/state';
import { MESSAGES, MAX_FILE_NAME, SCRIPTS, IMAGES_GALLERY_URL, EXTRACTION_REASON, ERRORS } from '../shared/consts';
import { executeScript, extractExtension, getCurrentTab, isHTTPUrl, isValidUrl, removeForbiddenCharacters } from '../shared/helpers';

export async function runUserScript (newActiveState, newSaveMethod, tab) {
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

  if (!stateOnTab || stateOnTab.url !== tab.url || stateOnTab.active !== newActiveState || stateOnTab.saveMethod !== newSaveMethod) {
    sendMessage = () => browser.tabs.sendMessage(tab.id, { action: 'switchClickHandler', active: newActiveState, saveMethod: newSaveMethod, specialCases: State.specialRules() });
  }

  State.tabState(tab.id, { id: tab.id, active: newActiveState, saveMethod: newSaveMethod, url: tab.url });

  executeScriptPromise.then(sendMessage);
  return newActiveState;
}

export async function extractAllImageUrls () {
  const tab = await getCurrentTab();
  await executeScript(tab.id, SCRIPTS.EXTRACT_ALL_IMAGES_URLS);
  browser.tabs.sendMessage(tab.id, { type: MESSAGES.GET_PICTURE_URLS, specialRules: State.specialRules() })
}

export async function createImagesPage (message) {
  const tab = await browser.tabs.create({
    active: true,
    url: IMAGES_GALLERY_URL,
  });

  State.isGalleryImagesSpecialRule(message.isSpecialRule);
  State.galleryImagesTab(tab);
  State.galleryImagesUrls(message);
  State.thumbsCount(message.urls.length);

  if (!message.urls[0].thumbUrl) {
    handleNoThumbsCase(message);
  }
}

async function handleNoThumbsCase (message) {
  const specialRule = getSpecialRule(message.url, State.specialRules());

  State.isNoThumbCase(true);
  State.isDownloadingInProgress(true);

  for (let i = 0; i < message.urls.length; i++) {
    if (!State.isDownloadingInProgress()) {
      State.savedOriginalUrls([]);
      State.isNoThumbCase(false);
      return;
    }

    await getOriginalImageUrl({
      pageUrl: message.urls[i].originalUrl,
      imageSelector: specialRule[2],
      reason: EXTRACTION_REASON.NO_THUMB,
    });
  }
  State.isDownloadingInProgress(false);
}

export async function changeThumbUrlsToOriginalUrls () {
  const newUrls = State.savedOriginalUrls().map(({ url }) => ({
    thumbUrl: url,
    originalUrl: url,
    isPreloaded: true,
  }));

  const galleryData = State.galleryImagesUrls();
  galleryData.urls = newUrls;

  State.galleryImagesUrls(galleryData);
}

export async function sendImagesUrls () {
  const tab = State.galleryImagesTab();
  const urls = State.galleryImagesUrls();
  const isSpecialRule = State.isGalleryImagesSpecialRule();

  if (!State.isNoThumbCase()); {
    State.savedOriginalUrls([]);
  }

  browser.tabs.sendMessage(tab.id, {
    ...urls,
    tabId: tab.id,
    isSpecialRule,
    type: MESSAGES.RECEIVE_IMAGES_URLS,
    isNoThumbs: State.isNoThumbCase(),
    specialRule: getSpecialRule(urls.url, State.specialRules())
  });
}

export async function saveOriginalUrl (message) {
  const savedOriginalUrls = State.savedOriginalUrls();
  savedOriginalUrls.push(message);
  State.savedOriginalUrls(savedOriginalUrls);

  if (State.thumbsCount() === savedOriginalUrls.length) {
    if (State.isNoThumbCase()) {
      updateUrlsAndResendImagesToGallery();
      return;
    }

    sendPreloadedUrlsToGallery();
  }
}

async function updateUrlsAndResendImagesToGallery () {
  changeThumbUrlsToOriginalUrls();
  State.isNoThumbCase(false);
  sendImagesUrls();
}

async function sendPreloadedUrlsToGallery() {
  const originalUrls = {};

  State.savedOriginalUrls().forEach(
    ({ href, url }) => (originalUrls[href] = url)
  );

  browser.tabs.sendMessage(State.galleryImagesTab().id, {
    originalUrls,
    type: MESSAGES.RECEIVE_PRELOADED_IMAGES_URLS,
  });

  State.savedOriginalUrls([]);
}

export async function saveContent (message) {
  const { title, url, originalPictureHref, href, isFromSpecialCase, isFromGallery, isPreloaded } = message;
  const specialRule = getSpecialRule(href, State.specialRules());
  const tryOriginal = State.tryOriginal();
  const isValidOriginalPictureHref =
    originalPictureHref &&
    originalPictureHref.length &&
    originalPictureHref !== "null";

  if (
    isValidOriginalPictureHref &&
    !isPreloaded &&
    !isFromSpecialCase &&
    specialRule[2] &&
    (isFromGallery || tryOriginal)
  ) {
    try {
      await getOriginalImageUrl({
      pageUrl: originalPictureHref,
      imageSelector: specialRule[2],
      reason: EXTRACTION_REASON.DOWNLOAD,
    });
    } catch (e) {
      console.error(e);
    }
    return;
  }


  const saveFolder = `${State.saveFolder()}/${specialRule[4]}/`.replace(/\/+/g, "/");
  const extension = extractExtension(url || originalPictureHref);
  const rawName = specialRule[3] === "URL" ? href : title;
  const handledName = removeForbiddenCharacters(rawName, true).substring(0, MAX_FILE_NAME);
  const name = `${saveFolder}${handledName}.${extension}`;
  const downloadUrl =
    tryOriginal && !specialRule[2] && isValidOriginalPictureHref
      ? originalPictureHref
      : url;

  try {
    await download(downloadUrl, name);
  } catch (e) {
    console.error(e.message, " !!! error during downloading")
    if (e.message === ERRORS.INVALID_URL) {
      await download(url, name);
    }
  }
}

export async function saveAllContent (message) {
  State.isDownloadingInProgress(true);
  for (let i = 0; i < message.urls.length; i++) {
    const { thumbUrl, originalUrl, isPreloaded } = message.urls[i];
    const originalPictureHref = originalUrl !== "null" ? originalUrl : '';
    const url = isPreloaded ? originalUrl : thumbUrl;

    if (State.isDownloadingInProgress()) {
      await saveContent({
        ...message,
        url: thumbUrl,
        originalPictureHref,
        type: MESSAGES.SAVE_CONTENT,
        isPreloaded,
      });
      await sendDownloadingProgress(message.tabId, i + 1);
    }
  }
  sendDownloadingProgress(message.tabId, 0);
  State.isDownloadingInProgress(false);
}

export async function stopDownloading () {
  State.isDownloadingInProgress(false);
}

async function sendDownloadingProgress (tabId, count) {
  await browser.tabs.sendMessage(tabId, {
    type: MESSAGES.RECEIVE_DOWNLOADING_PROGRESS,
    count,
  });
}

async function download (url, filename) {
  await browser.downloads.download({ url, saveAs: false, filename });
}

export async function getOriginalImageUrlForGallery (message) {
  const specialRule = getSpecialRule(message.originalPictureHref, State.specialRules());
  getOriginalImageUrl({ pageUrl: message.originalPictureHref, imageSelector: specialRule[2], reason: EXTRACTION_REASON.FOR_GALLERY, tabId: message.tabId });
}

export async function sendOriginalImageUrltoGallery ({ tabId, href, url }) {
  browser.tabs.sendMessage(tabId, { href, originalUrl: url, type: MESSAGES.RECEIVE_ORIGINAL_IMAGE_URL });
}

async function getOriginalImageUrl ({ pageUrl, imageSelector, reason, tabId }) {
  const newTab = await browser.tabs.create({
    url: pageUrl,
    active: false,
  });

  await executeScript(newTab.id, SCRIPTS.DOWNLOAD_ORIGINAL_IMAGE_URL);
  await browser.tabs.sendMessage(newTab.id, { imageSelector, reason, tabId, tabWithOriginId: newTab.id });
}

export function getSpecialRule (url, specialRules) {
  for (const params of specialRules) {
    if (url.startsWith(params[0])) {
      return params;
    }
  }

  return [];
}

export async function getAllOriginalImageUrlsForGallery (message) {
  const specialRule = getSpecialRule(message.href, State.specialRules());
  State.isDownloadingInProgress(true);
  State.savedOriginalUrls([]);
  
  for (let i = 0; i < message.urls.length; i++) {
    const { thumbUrl, originalUrl, isPreloaded } = message.urls[i];

    if(!State.isDownloadingInProgress()) {
      sendDownloadingProgress(message.tabId, 0);
      State.savedOriginalUrls([]);
      return;
    }

    if (isPreloaded || !isValidUrl(originalUrl)) {
      saveOriginalUrl({ href: originalUrl, url: originalUrl || thumbUrl });
      continue;
    }

    await getOriginalImageUrl({
      pageUrl: originalUrl,
      imageSelector: specialRule[2],
      reason: EXTRACTION_REASON.NO_THUMB,
    });
  }
}
