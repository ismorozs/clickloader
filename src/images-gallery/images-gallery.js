const browser = require("webextension-polyfill/dist/browser-polyfill.min");
const JSZip = require("jszip");

import { EXTRACTION_REASON, MESSAGES, MAX_FILE_NAME } from "../shared/consts";
import { createElement, emptyNode, hasClass, setupEventHandler } from "../shared/markup";
import { extractExtension, isMediaResource, isVideo, selectImageName } from "../shared/helpers";

const PAGE_TITLE = document.querySelector(".pageTitle");
const PAGE_URL = document.querySelector(".pageUrl");
const IMAGES_COUNT = document.querySelector('.totalCount');
const DOWNLOAD_ALL_BUTTONS = document.querySelector('.downloadAllButtons');
const DOWNLOAD_ALL = document.querySelector('.downloadAll');
const DOWNLOAD_ALL_AS_ARCHIVE = document.querySelector('.downloadAllAsArchive');
const IMAGES = document.querySelector(".images");
const LAYOVER = document.querySelector(".layover");
const BIG_IMAGE = document.querySelector(".bigImage");
const POPUP_CONTAINER = document.querySelector(".popupContainer");
const DOWNLOAD_PROGRESS = document.querySelector(".downloadProgress");
const DOWNLOAD_LEFT = document.querySelector(".downloadLeft");
const DOWNLOADING_FILE = document.querySelector(".downloadingFile");
const TOTAL_DOWNLOAD_COUNT = document.querySelector(".totalDownloadCount");
const STOP_DOWNLOADING_BUTTON = document.querySelector(".stopDownloading");
const NO_THUMB_WARNING = document.querySelector('.noThumbWarning');
const NO_IMAGE_WARNING = document.querySelector('.noImageWarning');
const ORIGINAL_IMAGE_URL = document.querySelector('.originalImageUrl');
const DOWNLOAD_THUMBNAIL_BUTTON = document.querySelector('.loadThumbnail');
const SMALL_THUMBNAIL = document.querySelector('.smallThumbnail');
const OPEN_SETTINGS_BUTTON = document.querySelector('.openSettings');

const DOWNLOAD_INFO_HEADRERS = [
  "Title",
  "URL",
  "Thumb",
  "Original",
  "Original Title",
];

browser.runtime.sendMessage({
  type: MESSAGES.IMAGES_GALLERY_COMPLETED,
});

browser.runtime.onMessage.addListener(onMessage);

function onMessage(message) {
  switch (message.type) {
    case MESSAGES.RECEIVE_IMAGES_URLS:
      buildPage(message);
      break;
    case MESSAGES.RECEIVE_ORIGINAL_IMAGE_URL:
      updateOriginalUrl(message);
      break;
    case MESSAGES.RECEIVE_DOWNLOADING_PROGRESS:
      updateTotalDownloadCount(message);
      break;
    case MESSAGES.RECEIVE_PRELOADED_IMAGES_URLS:
      downloadAllAsArchive(message);
      break;
  }
}

setupEventHandler(IMAGES, "click", handleImage);
setupEventHandler(LAYOVER, "click", switchLayover);
setupEventHandler(BIG_IMAGE, "click", switchLayover);
setupEventHandler(BIG_IMAGE, "load", () => BIG_IMAGE.classList.add("show"));
setupEventHandler(DOWNLOAD_ALL, "click", downloadAllImages);
setupEventHandler(DOWNLOAD_ALL_AS_ARCHIVE, "click", prepareDownloadAllAsArchive);
setupEventHandler(STOP_DOWNLOADING_BUTTON, "click", stopDownloading);
setupEventHandler(DOWNLOAD_THUMBNAIL_BUTTON, "click", downloadThumbnail);
setupEventHandler(OPEN_SETTINGS_BUTTON, "click", openSettings);
setupEventHandler(window, 'beforeunload', stopDownloading);

function buildPage (message) {
  window.__PAGE_DATA = message;
  NO_THUMB_WARNING.classList.remove("show");
  emptyNode(IMAGES);
  const { title, href, urls, isNoThumbs } = message;
  document.title = `All images for ${title}`;
  PAGE_TITLE.textContent = title;
  PAGE_URL.textContent = href;
  IMAGES_COUNT.textContent = message.urls.length;
  TOTAL_DOWNLOAD_COUNT.textContent = `/${message.urls.length}`;

  if (isNoThumbs) {
    NO_THUMB_WARNING.classList.add("show");
    return;
  }

  urls.forEach(({ thumbUrl, originalHref }) => {
    const card = createElement("div", "", ["card"]);
    const img = createElement("img", thumbUrl, ["image"]);
    img.dataset.originalHref = originalHref;

    if (originalHref && isVideo(originalHref)) {
      img.classList.add("video");
    }

    const downloadButton = createElement("button", "", ["download"]);
    downloadButton.title = "Download";
    downloadButton.dataset.originalHref = originalHref;
    downloadButton.dataset.title = message.title;
    downloadButton.dataset.href = message.href;
    downloadButton.dataset.thumbUrl = thumbUrl;

    card.appendChild(img);
    card.appendChild(downloadButton);
    IMAGES.appendChild(card);
  });
}

function handleImage (e) {
  e.stopPropagation();

  if (hasClass(e.target, "download")) {
    downloadImage(e);
    return;
  }

  if (hasClass(e.target, "image")) {
    showOriginal(e);
    return;
  }
}

async function downloadImage (e) {
  const { specialRule } = window.__PAGE_DATA;
  const { href, thumbUrl, title  } = e.target.dataset;
  const { isPreloaded, originalHref } = getPictureData(thumbUrl);

  if (originalHref && !isMediaResource(originalHref, specialRule[0]) && isPreloaded) {
    switchLayover();
    onShowingOriginalError(originalHref, thumbUrl);
    return;
  }

  browser.runtime.sendMessage({
    type: MESSAGES.RECEIVE_ORIGINAL_URL,
    title,
    originalHref,
    href,
    thumbUrl,
    isFromGallery: true,
    reason: EXTRACTION_REASON.DOWNLOAD,
  });
}

async function showOriginal(e) {
  switchLayover(e);

  const { title, href, tabId } = window.__PAGE_DATA;
  const { originalHref } = e.target.dataset;
  const { isPreloaded, originalUrl, thumbUrl } = getPictureData(e.target.src);

  if (isPreloaded) {
    updateBigPicture(originalUrl, thumbUrl);
    return;
  }

  browser.runtime.sendMessage({
    type: MESSAGES.GET_IMAGE_URL_FOR_GALLERY,
    galleryTabId: tabId,
    title,
    originalHref,
    href,
    thumbUrl,
    reason: EXTRACTION_REASON.GET_ORIGINAL_URL,
  });
}

async function downloadAllImages () {
  const { title, href, urls, tabId } = window.__PAGE_DATA;

  TOTAL_DOWNLOAD_COUNT.classList.add("show");
  DOWNLOAD_LEFT.textContent = 0;
  switchDownloadPanel();

  browser.runtime.sendMessage({
    type: MESSAGES.SAVE_ALL_CONTENT_RAW,
    title,
    href,
    urls,
    tabId,
  }); 
}

function switchLayover () {
  LAYOVER.classList.toggle("show");
  BIG_IMAGE.classList.remove("show");
  POPUP_CONTAINER.classList.toggle("show");
  NO_IMAGE_WARNING.classList.remove("show");
}

function updateOriginalUrl (message) {
  const item = window.__PAGE_DATA.urls.find((el) => el.originalHref === message.originalHref);
  item.originalUrl = message.originalUrl;
  item.isPreloaded = true;
  updateBigPicture(message.originalUrl, item.thumbUrl);
}

function updateBigPicture (originalUrl, thumbUrl) {
  const { specialRule } = window.__PAGE_DATA;
  BIG_IMAGE.style.maxHeight = `${window.innerHeight}px`;
  BIG_IMAGE.src =
    originalUrl && isMediaResource(originalUrl, specialRule[0])
      ? originalUrl
      : thumbUrl;
}

function getPictureData (thumbUrl) {
  const item = window.__PAGE_DATA.urls.find((url) => url.thumbUrl === thumbUrl);

  return item || {};
}

function updateTotalDownloadCount ({ count, filename }) {
  if (!count) {
    switchDownloadPanel();
    return;
  }

  if (count) {
    DOWNLOAD_LEFT.textContent = count;
  }

  if (filename) {
    DOWNLOADING_FILE.textContent = filename;
  }
}

function switchDownloadPanel () {
  DOWNLOAD_ALL_BUTTONS.classList.toggle("show");
  STOP_DOWNLOADING_BUTTON.classList.toggle("show");
  DOWNLOAD_PROGRESS.classList.toggle("show");
}

function stopDownloading () {
  browser.runtime.sendMessage({
    type: MESSAGES.STOP_DOWNLOADING
  });
  window.__PAGE_DATA.isDownloading = false;
}

async function prepareDownloadAllAsArchive () {
  const { title, href, urls, tabId } = window.__PAGE_DATA;

  switchDownloadPanel();

  browser.runtime.sendMessage({
    type: MESSAGES.GET_ALL_IMAGES_URLS_FOR_GALLERY,
    title,
    href,
    urls,
    galleryTabId: tabId,
  });
}

async function downloadAllAsArchive (message) {
  const zip = new JSZip();
  const { urls, href, title, naming, specialRule } = window.__PAGE_DATA;
  const [S_ORIGIN,,,S_NAMING] = specialRule;

  window.__PAGE_DATA.isDownloading = true;
  let info = DOWNLOAD_INFO_HEADRERS.join("\t") + "\n";

  for (let i = 0; i < urls.length; i++) {
    if (!window.__PAGE_DATA.isDownloading) {
      updateTotalDownloadCount({ count: 0 });
      return;
    }

    const pictureData = window.__PAGE_DATA.urls[i];
    const newPictureData = message.originalUrls.find(
      ({ originalHref }) =>
        originalHref === pictureData.originalHref ||
        (originalHref && originalHref.startsWith(pictureData.originalHref)),
    );

    Object.assign(pictureData, newPictureData, { isPreloaded: true });
    const { thumbUrl, originalHref, originalUrl, originalTitle } = pictureData;

    try {
      const downloadUrl = originalUrl && isMediaResource(originalUrl, S_ORIGIN) ? originalUrl : thumbUrl;
      updateTotalDownloadCount({ count: i + 1, filename: `Downloading: ${downloadUrl}` });
      const file = await fetch(downloadUrl).then((res) => res.blob());
      const extension = extractExtension(downloadUrl);
      const fileNaming = S_NAMING || naming;
      const name = selectImageName(fileNaming, title, href, downloadUrl);
      const fileName = `${name}${fileNaming !== "Original" ? ` (${i + 1})` : ""}.${extension}`;
      zip.file(fileName, file);
      info +=
        [name, href, thumbUrl, originalHref, originalUrl, originalTitle].join(
          "\t",
        ) + "\n";
    } catch (e) {
      console.error(e);
    }
  }

  zip.file(`info.txt`, new Blob([info], { type: "text/plain" }));

  const zipData = await zip.generateAsync({
    type: "blob",
    streamFiles: true,
  });

  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(zipData);
  link.download = `${window.__PAGE_DATA.title}.zip`;
  link.click();

  updateTotalDownloadCount({ count: 0 });
}

function onShowingOriginalError (url, thumbUrl) {
  ORIGINAL_IMAGE_URL.textContent = url;
  ORIGINAL_IMAGE_URL.href = url;
  SMALL_THUMBNAIL.src = thumbUrl;
  DOWNLOAD_THUMBNAIL_BUTTON.dataset.thumbUrl = thumbUrl;
  NO_IMAGE_WARNING.classList.add("show");
}

function downloadThumbnail (e) {
  e.stopPropagation();
  const { title, href } = window.__PAGE_DATA;

  browser.runtime.sendMessage({
    type: MESSAGES.RECEIVE_ORIGINAL_URL,
    title,
    href,
    thumbUrl: e.target.dataset.thumbUrl,
    reason: EXTRACTION_REASON.DOWNLOAD,
  });
}

function openSettings () {
  browser.runtime.sendMessage({ type: MESSAGES.OPEN_SETTINGS });
}
