const browser = require("webextension-polyfill/dist/browser-polyfill.min");

import { EXTRACTION_REASON, MESSAGES } from "../shared/consts";
import { createElement, emptyNode, hasClass, setupEventHandler } from "../shared/markup";
import { isVideo } from "../shared/helpers";

const PAGE_TITLE = document.querySelector(".pageTitle");
const PAGE_URL = document.querySelector(".pageUrl");
const IMAGES_COUNT = document.querySelector('.totalCount');
const DOWNLOAD_ALL = document.querySelector('.downloadAll');
const IMAGES = document.querySelector(".images");
const LAYOVER = document.querySelector(".layover");
const BIG_IMAGE = document.querySelector(".bigImage");
const POPUP_CONTAINER = document.querySelector(".popupContainer");
const DOWNLOAD_PROGRESS = document.querySelector(".downloadProgress");
const DOWNLOAD_LEFT = document.querySelector(".downloadLeft");
const TOTAL_DOWNLOAD_COUNT = document.querySelector(".totalDownloadCount");
const STOP_DOWNLOADING_BUTTON = document.querySelector(".stopDownloading");

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
  }
}

setupEventHandler(IMAGES, "click", handleImage);
setupEventHandler(LAYOVER, "click", switchLayover);
setupEventHandler(BIG_IMAGE, "click", switchLayover);
setupEventHandler(BIG_IMAGE, "load", () => BIG_IMAGE.classList.add("show"));
setupEventHandler(DOWNLOAD_ALL, "click", downloadAllImages);
setupEventHandler(STOP_DOWNLOADING_BUTTON, "click", stopDownloading);

function buildPage (message) {
  window.__PAGE_DATA = message;
  emptyNode(IMAGES);
  const { title, url, urls } = message;
  document.title = `All images for ${title}`;
  PAGE_TITLE.textContent = title;
  PAGE_URL.textContent = url;
  IMAGES_COUNT.textContent = message.urls.length;
  TOTAL_DOWNLOAD_COUNT.textContent = message.urls.length;

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
  const { href, url, title, originalPictureHref } = e.target.dataset;
  const { isPreloaded, originalUrl } = getOriginalUrl(url);

  browser.runtime.sendMessage({
    type: MESSAGES.RECEIVE_ORIGINAL_URL,
    title,
    originalPictureHref,
    href,
    isFromGallery: true,
    url: isPreloaded ? originalUrl : url,
    isPreloaded,
    reason: EXTRACTION_REASON.DOWNLOAD,
  });
}

async function showOriginal(e) {
  switchLayover(e);

  const { title, url } = window.__PAGE_DATA;
  const { originalPictureHref } = e.target.dataset;
  const { isPreloaded, originalUrl } = getOriginalUrl(e.target.src);

  if (isPreloaded) {
    updateBigPicture(originalUrl);
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
    isPreloaded: e.target.src === originalPictureHref,
    reason: EXTRACTION_REASON.FOR_GALLERY,
  });
}

async function downloadAllImages () {
  const { title, url, urls, tabId } = window.__PAGE_DATA;

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
}

function updateOriginalUrl (message) {
  const item = window.__PAGE_DATA.urls.find((el) => el.originalUrl === message.href);
  item.originalUrl = message.originalUrl;
  item.isPreloaded = true;
  updateBigPicture(message.originalUrl);
}

function updateBigPicture (src) {
  BIG_IMAGE.style.maxHeight = `${window.innerHeight}px`;
  BIG_IMAGE.src = src;
}
function getOriginalUrl (thumbUrl) {
  const item = window.__PAGE_DATA.urls.find((url) => url.thumbUrl === thumbUrl);

  return item || {};
}

function updateTotalDownloadCount ({ count }) {
  if (count) {
    DOWNLOAD_LEFT.textContent = count;
    return;
  }

  switchDownloadPanel();
}

function switchDownloadPanel () {
  DOWNLOAD_ALL.classList.toggle("show");
  STOP_DOWNLOADING_BUTTON.classList.toggle("show");
  DOWNLOAD_PROGRESS.classList.toggle("show");
}

function stopDownloading () {
  browser.runtime.sendMessage({
    type: MESSAGES.STOP_DOWNLOADING
  }); 
}