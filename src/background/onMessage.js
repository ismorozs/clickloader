const browser = require("webextension-polyfill");

import { EXTRACTION_REASON, MESSAGES } from "../shared/consts";

import {
  saveContent,
  saveAllOriginalImagesRaw,
  stopDownloading,
  openSettings,
} from "./actions";
import {
  createGalleryPage,
  sendImagesUrlsToGallery,
  saveOriginalUrl,
  getOriginalImageUrlForPreview,
  sendOriginalImageUrlForPreview,
  collectAllOriginalImageUrls,
} from "./actions/gallery";

export async function onMessage(message) {
  switch (message.type) {
    case MESSAGES.RECEIVE_ORIGINAL_URL:
      if (message.tabWithOriginId) {
        browser.tabs.remove([message.tabWithOriginId]);
      }

      switch (message.reason) {
        case EXTRACTION_REASON.DOWNLOAD:
          saveContent(message);
          break;
        case EXTRACTION_REASON.GET_ORIGINAL_URL:
          sendOriginalImageUrlForPreview(message);
          break;
        case EXTRACTION_REASON.COLLECT_ORIGINAL_URLS:
          saveOriginalUrl(message);
          break;
      }
      break;

    case MESSAGES.SAVE_ALL_CONTENT_RAW:
      saveAllOriginalImagesRaw(message);
      break;

    case MESSAGES.RECEIVE_IMAGES_URLS:
      createGalleryPage(message);
      break;

    case MESSAGES.GET_IMAGE_URL_FOR_GALLERY:
      getOriginalImageUrlForPreview(message);
      break;

    case MESSAGES.GET_ALL_IMAGES_URLS_FOR_GALLERY:
      collectAllOriginalImageUrls(message);
      break;

    case MESSAGES.IMAGES_GALLERY_COMPLETED:
      sendImagesUrlsToGallery();
      break;

    case MESSAGES.STOP_DOWNLOADING:
      stopDownloading();
      break;

    case MESSAGES.OPEN_SETTINGS:
      openSettings();
      break;
  }
}
