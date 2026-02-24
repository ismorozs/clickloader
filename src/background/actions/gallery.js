const browser = require("webextension-polyfill");

import State from "../../shared/state";
import { getImageUrlFromNextPage, getSpecialRule, sendDownloadingProgress } from '.';
import {
  MESSAGES,
  SCRIPTS,
  IMAGES_GALLERY_URL,
  EXTRACTION_REASON,
  COLLECTING_REASON,
  DOWNLOAD_STATUS,
} from "../../shared/consts";
import {
  executeScript,
  getCurrentTab,
  isValidUrl,
} from "../../shared/helpers";

export async function prepareForGalleryPage(reason) {
  const tab = await getCurrentTab();
  await executeScript(tab.id, SCRIPTS.EXTRACT_ALL_IMAGES_URLS);
  browser.tabs.sendMessage(tab.id, {
    type: MESSAGES.GET_PICTURE_URLS,
    specialRules: State.specialRules(),
    naming: State.saveNaming(),
    reason,
    tabId: tab.id,
  });
}

export async function createGalleryPage(message) {
  const tab = await browser.tabs.create({
    active: true,
    url: IMAGES_GALLERY_URL,
  });

  State.isGalleryImagesSpecialRule(message.isSpecialRule);
  State.galleryImagesTab(tab);
  State.galleryData(message);
  State.thumbsCount(message.urls.length);

  if (!message.urls[0].thumbUrl) {
    handleNoThumbsCase(message);
  }
}

export async function sendImagesUrlsToGallery() {
  const galleryTab = State.galleryImagesTab();
  const galleryData = State.galleryData();
  const isSpecialRule = State.isGalleryImagesSpecialRule();

  if (!State.isNoThumbCase());
  {
    State.savedOriginalUrls([]);
  }

  browser.tabs.sendMessage(galleryTab.id, {
    ...galleryData,
    tabId: galleryTab.id,
    isSpecialRule,
    type: MESSAGES.RECEIVE_IMAGES_URLS,
    naming: State.saveNaming(),
    isNoThumbs: State.isNoThumbCase(),
    specialRule: getSpecialRule(galleryData.href, State.specialRules()),
  });
}

async function handleNoThumbsCase(message) {
  const specialRule = getSpecialRule(message.url, State.specialRules());

  State.isNoThumbCase(true);
  State.isDownloadingInProgress(true);

  for (let i = 0; i < message.urls.length; i++) {
    if (!State.isDownloadingInProgress()) {
      State.savedOriginalUrls([]);
      State.isNoThumbCase(false);
      return;
    }

    await getImageUrlFromNextPage({
      originalHref: message.urls[i].originalUrl,
      imageSelector: specialRule[2],
      reason: EXTRACTION_REASON.COLLECT_ORIGINAL_URLS,
    });
  }
  State.isDownloadingInProgress(false);
}

export async function changeThumbUrlsToOriginalUrls() {
  const newUrls = State.savedOriginalUrls().map(({ url }) => ({
    thumbUrl: url,
    originalUrl: url,
    isPreloaded: true,
  }));

  const galleryData = State.galleryData();
  galleryData.urls = newUrls;

  State.galleryData(galleryData);
}

export async function saveOriginalUrl(message) {
  const savedOriginalUrls = State.savedOriginalUrls();
  savedOriginalUrls.push(message);
  State.savedOriginalUrls(savedOriginalUrls);

  if (State.thumbsCount() === savedOriginalUrls.length) {
    if (State.isNoThumbCase()) {
      updateUrlsAndResendImagesToGallery();
      return;
    }

    if (message.reason === COLLECTING_REASON.DOWNLOAD_ON_SITE_AS_ARCHIVE) {
      saveAllOriginalImagesAsArchive();
      return;
    }

    sendOriginalUrlsToGallery();
  }
}

export async function saveAllOriginalImagesAsArchive() {
  const tab = await getCurrentTab();
  browser.tabs.sendMessage(tab.id, {
    originalUrls: State.savedOriginalUrls(),
    type: MESSAGES.RECEIVE_PRELOADED_IMAGES_URLS,
    naming: State.saveNaming(),
    specialRule: getSpecialRule(tab.url, State.specialRules()),
  });

  State.savedOriginalUrls([]);
}

async function updateUrlsAndResendImagesToGallery() {
  changeThumbUrlsToOriginalUrls();
  State.isNoThumbCase(false);
  sendImagesUrlsToGallery();
}

async function sendOriginalUrlsToGallery() {
  const galleryTab = State.galleryImagesTab();
  browser.tabs.sendMessage(State.galleryImagesTab().id, {
    originalUrls: State.savedOriginalUrls(),
    type: MESSAGES.RECEIVE_PRELOADED_IMAGES_URLS,
    naming: State.saveNaming(),
    specialRule: getSpecialRule(galleryTab.url, State.specialRules())
  });

  State.savedOriginalUrls([]);
}

export async function getOriginalImageUrlForPreview(message) {
  const [,, S_ORIGINAL_SELECTOR] = getSpecialRule(
    message.originalHref,
    State.specialRules(),
  );
  getImageUrlFromNextPage({
    ...message,
    imageSelector: S_ORIGINAL_SELECTOR,
    reason: EXTRACTION_REASON.GET_ORIGINAL_URL,
  });
}

export async function sendOriginalImageUrlForPreview({ tabId, originalHref, originalUrl }) {
  browser.tabs.sendMessage(tabId, {
    originalHref,
    originalUrl,
    type: MESSAGES.RECEIVE_ORIGINAL_IMAGE_URL,
  });
}

export async function collectAllOriginalImageUrls(message) {
  State.isDownloadingInProgress(true);
  State.savedOriginalUrls([]);
  State.thumbsCount(message.urls.length);
  
  getOriginalImageUrlsConsecutively(message, 0);
}

async function getOriginalImageUrlsConsecutively(message, i, imageSelector) {
  if (i >= message.urls.length) {
    return;
  }

  const imageData = message.urls[i];
  const { originalHref, isPreloaded } = imageData;

  if (!State.isDownloadingInProgress()) {
    State.savedOriginalUrls([]);
    return;
  }

  sendDownloadingProgress(message.tabId, i + 1, `${DOWNLOAD_STATUS.PREPARING}${originalHref}`);

  if (isPreloaded || !isValidUrl(originalHref)) {
    saveOriginalUrl({
      ...imageData,
      originalUrl: originalHref,
      reason: message.reason
    });
  } else {
    await getImageUrlFromNextPage({
      ...imageData,
      reason: message.reason,
    });
  }

  setTimeout(
    () => getOriginalImageUrlsConsecutively(message, i + 1, imageSelector),
    0,
  );
}
