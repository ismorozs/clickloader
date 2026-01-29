const browser = require("webextension-polyfill/dist/browser-polyfill.min");
const JSZip = require("jszip");

import { EXTRACTION_REASON, MESSAGES, MAX_FILE_NAME } from "../shared/consts";
import { createElement, emptyNode, hasClass, setupEventHandler } from "../shared/markup";
import { extractExtension, isMediaResource, isVideo, removeForbiddenCharacters } from "../shared/helpers";

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
      updateOriginalUrls(message);
      break;
  }
}

setupEventHandler(IMAGES, "click", handleImage);
setupEventHandler(LAYOVER, "click", switchLayover);
setupEventHandler(BIG_IMAGE, "click", switchLayover);
setupEventHandler(BIG_IMAGE, "load", () => BIG_IMAGE.classList.add("show"));
setupEventHandler(DOWNLOAD_ALL, "click", downloadAllImages);
setupEventHandler(DOWNLOAD_ALL_AS_ARCHIVE, "click", downloadAllAsArchive);
setupEventHandler(STOP_DOWNLOADING_BUTTON, "click", stopDownloading);
setupEventHandler(DOWNLOAD_THUMBNAIL_BUTTON, "click", downloadThumbnail);
setupEventHandler(OPEN_SETTINGS_BUTTON, "click", openSettings);
setupEventHandler(window, 'beforeunload', stopDownloading);

function buildPage (message) {
  window.__PAGE_DATA = message;
  NO_THUMB_WARNING.classList.remove("show");
  emptyNode(IMAGES);
  const { title, url, urls, isNoThumbs } = message;
  document.title = `All images for ${title}`;
  PAGE_TITLE.textContent = title;
  PAGE_URL.textContent = url;
  IMAGES_COUNT.textContent = message.urls.length;
  TOTAL_DOWNLOAD_COUNT.textContent = `/${message.urls.length}`;

  if (isNoThumbs) {
    NO_THUMB_WARNING.classList.add("show");
    return;
  }

  urls.forEach(({ thumbUrl, originalUrl }) => {
    const card = createElement("div", "", ["card"]);
    const img = createElement("img", thumbUrl, ["image"]);
    img.dataset.originalPictureHref = originalUrl;

    if (originalUrl && isVideo(originalUrl)) {
      img.classList.add("video");
    } 

    const downloadButton = createElement("button", "", ["download"]);
    downloadButton.title = "Download";
    downloadButton.dataset.originalPictureHref = originalUrl;
    downloadButton.dataset.title = message.title;
    downloadButton.dataset.href = message.url;
    downloadButton.dataset.url = thumbUrl;

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
  const { href, url, title, originalPictureHref } = e.target.dataset;
  const { isPreloaded, originalUrl, thumbUrl } = getOriginalUrl(url);

  if (originalUrl && !isMediaResource(originalUrl, specialRule[0]) && isPreloaded) {
    switchLayover();
    onShowingOriginalError(originalUrl, thumbUrl);
    return;
  }

  browser.runtime.sendMessage({
    type: MESSAGES.RECEIVE_ORIGINAL_URL,
    title,
    originalPictureHref,
    href,
    isFromGallery: true,
    url: isPreloaded && originalUrl !== null ? originalUrl : url,
    isPreloaded,
    reason: EXTRACTION_REASON.DOWNLOAD,
  });
}

async function showOriginal(e) {
  switchLayover(e);

  const { title, url } = window.__PAGE_DATA;
  const { originalPictureHref } = e.target.dataset;
  const { isPreloaded, originalUrl, thumbUrl } = getOriginalUrl(e.target.src);

  if (isPreloaded) {
    updateBigPicture(originalUrl, thumbUrl);
    return;
  }

  browser.runtime.sendMessage({
    type: MESSAGES.GET_IMAGE_URL_FOR_GALLERY,
    tabId: window.__PAGE_DATA.tabId,
    title,
    originalPictureHref,
    href: url,
    isFromGallery: true,
    url: e.target.src,
    reason: EXTRACTION_REASON.FOR_GALLERY,
  });
}

async function downloadAllImages () {
  const { title, url, urls, tabId } = window.__PAGE_DATA;

  TOTAL_DOWNLOAD_COUNT.classList.add("show");
  DOWNLOAD_LEFT.textContent = 0;
  switchDownloadPanel();

  browser.runtime.sendMessage({
    type: MESSAGES.SAVE_ALL_CONTENT,
    title,
    href: url,
    isFromGallery: true,
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
  const item = window.__PAGE_DATA.urls.find((el) => el.originalUrl === message.href);
  item.originalUrl = message.originalUrl;
  item.isPreloaded = true;
  updateBigPicture(message.originalUrl, item.thumbUrl);
}

function updateBigPicture (src, thumbUrl) {
  const { specialRule } = window.__PAGE_DATA;
  BIG_IMAGE.style.maxHeight = `${window.innerHeight}px`;
  BIG_IMAGE.src = src && isMediaResource(src, specialRule[0]) ? src : thumbUrl;
}
function getOriginalUrl (thumbUrl) {
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

async function downloadAllAsArchive () {
  const { title, url, urls, tabId } = window.__PAGE_DATA;

  switchDownloadPanel();

  browser.runtime.sendMessage({
    type: MESSAGES.GET_ALL_IMAGES_URLS_FOR_GALLERY,
    title,
    href: url,
    isFromGallery: true,
    urls,
    tabId,
  });
}

async function updateOriginalUrls (message) {
  const zip = new JSZip();
  const { urls, url: pageUrl, title, specialRule } = window.__PAGE_DATA;

  window.__PAGE_DATA.isDownloading = true;
  let info = DOWNLOAD_INFO_HEADRERS.join("\t") + "\n";

  for (let i = 0; i < urls.length; i++) {
    if (!window.__PAGE_DATA.isDownloading) {
      updateTotalDownloadCount({ count: 0 });
      return;
    }

    const url = window.__PAGE_DATA.urls[i];
    const newUrlData = message.originalUrls.find(
      ({ href }) => href === url.originalUrl || href && href.startsWith(url.originalUrl)
    );
    url.originalUrl = newUrlData.url;
    url.title = newUrlData.title;
    url.isPreloaded = true;

    try {
      const downloadUrl = url.originalUrl && isMediaResource(url.originalUrl, specialRule[0]) ? url.originalUrl : url.thumbUrl;
      updateTotalDownloadCount({ count: i + 1, filename: `Downloading: ${downloadUrl}` });
      const file = await fetch(downloadUrl).then((res) => res.blob());
      const extension = extractExtension(downloadUrl);
      const shortTitle = title.substring(0, MAX_FILE_NAME);
      const rawName = specialRule[3] === "URL" ? pageUrl : shortTitle;
      const name = `${removeForbiddenCharacters(rawName)} (${i + 1})`;
      zip.file(`${name}.${extension}`, file);
      info +=
        [shortTitle, pageUrl, url.thumbUrl, url.originalUrl, url.title].join(
          "\t",
        ) + "\n";
    } catch (e) {
      console.log(e)
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
  const { title, url: href } = window.__PAGE_DATA;
  const url = e.target.dataset.thumbUrl;

  browser.runtime.sendMessage({
    type: MESSAGES.RECEIVE_ORIGINAL_URL,
    title,
    originalPictureHref: url,
    href,
    isFromGallery: true,
    url,
    isPreloaded: false,
    reason: EXTRACTION_REASON.DOWNLOAD,
  });
}

function openSettings () {
  browser.runtime.sendMessage({ type: MESSAGES.OPEN_SETTINGS });
}
