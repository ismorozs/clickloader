const browser = require("webextension-polyfill");

import State from "../../shared/state";
import { getImageUrlFromNextPage, getSpecialRule, sendDownloadingProgress } from '.';
import {
  MESSAGES,
  SCRIPTS,
  IMAGES_GALLERY_URL,
  EXTRACTION_REASON,
} from "../../shared/consts";
import {
  executeScript,
  getCurrentTab,
  isValidUrl,
} from "../../shared/helpers";

export async function prepareForGalleryPage() {
  const tab = await getCurrentTab();
  await executeScript(tab.id, SCRIPTS.EXTRACT_ALL_IMAGES_URLS);
  browser.tabs.sendMessage(tab.id, {
    type: MESSAGES.GET_PICTURE_URLS,
    specialRules: State.specialRules(),
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

    sendOriginalUrlsToGallery();
  }
}

async function updateUrlsAndResendImagesToGallery() {
  changeThumbUrlsToOriginalUrls();
  State.isNoThumbCase(false);
  sendImagesUrlsToGallery();
}

async function sendOriginalUrlsToGallery() {
  browser.tabs.sendMessage(State.galleryImagesTab().id, {
    originalUrls: State.savedOriginalUrls(),
    type: MESSAGES.RECEIVE_PRELOADED_IMAGES_URLS,
  });

  State.savedOriginalUrls([]);
}

export async function getOriginalImageUrlForPreview(message) {
  const [,, S_ORIGINAL_SELECTOR] = getSpecialRule(
    message.originalHref,
    State.specialRules(),
  );
  getImageUrlFromNextPage({
    title: message.title,
    href: message.href,
    thumbUrl: message.thumbUrl,
    originalHref: message.originalHref,
    imageSelector: S_ORIGINAL_SELECTOR,
    reason: EXTRACTION_REASON.GET_ORIGINAL_URL,
    galleryTabId: message.galleryTabId,
  });
}

export async function sendOriginalImageUrlForPreview({ galleryTabId, originalHref, originalUrl }) {
  browser.tabs.sendMessage(galleryTabId, {
    originalHref,
    originalUrl,
    type: MESSAGES.RECEIVE_ORIGINAL_IMAGE_URL,
  });
}

export async function collectAllOriginalImageUrls(message) {
  const [,, S_ORIGINAL_SELECTOR] = getSpecialRule(message.href, State.specialRules());
  State.isDownloadingInProgress(true);
  State.savedOriginalUrls([]);

  getOriginalImageUrlsConsecutively(message, 0, S_ORIGINAL_SELECTOR);
}

async function getOriginalImageUrlsConsecutively(message, i, imageSelector) {
  if (i >= message.urls.length) {
    return;
  }

  const { title, href, thumbUrl, originalHref, isPreloaded } = message.urls[i];

  if (!State.isDownloadingInProgress()) {
    sendDownloadingProgress(message.tabId, 0);
    State.savedOriginalUrls([]);
    return;
  }

  sendDownloadingProgress(message.galleryTabId, i + 1, `Preparing: ${originalHref}`);

  if (isPreloaded || !isValidUrl(originalHref)) {
    saveOriginalUrl({ originalHref, originalUrl: originalHref || thumbUrl });
  } else {
    await getImageUrlFromNextPage({
      title,
      href,
      thumbUrl,
      originalHref,
      imageSelector,
      reason: EXTRACTION_REASON.COLLECT_ORIGINAL_URLS,
    });
  }

  setTimeout(
    () => getOriginalImageUrlsConsecutively(message, i + 1, imageSelector),
    0,
  );
}
