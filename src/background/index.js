const browser = require('webextension-polyfill');

import { EXTRACTION_REASON, MESSAGES } from '../shared/consts';
import State from '../shared/state';
import { runUserScript, saveContent, createImagesPage, sendImagesUrls, saveOriginalUrl, saveAllContent, getOriginalImageUrlForGallery, sendOriginalImageUrltoGallery, stopDownloading } from './actions';
import { setupContextMenu, onContextMenuClicked } from './context-menu';

function init () {
  browser.storage.onChanged.addListener(onStorageChange);
  browser.tabs.onRemoved.addListener(onTabRemoved);
  browser.tabs.onActivated.addListener(onTabActivated);
  browser.tabs.onUpdated.addListener(onTabUpdated);
  browser.runtime.onMessage.addListener(onMessage);
  browser.contextMenus.onClicked.addListener(onContextMenuClicked);

  State.loadSettings().then(setupContextMenu);
}

async function onMessage (message) {
  switch (message.type) {

    case MESSAGES.RECEIVE_ORIGINAL_URL:
      if (message.tabWithOriginId) {
        browser.tabs.remove([message.tabWithOriginId]);
      }

      switch (message.reason) {
        case EXTRACTION_REASON.DOWNLOAD:
          saveContent(message);
          break;
        case EXTRACTION_REASON.NO_THUMB:
          saveOriginalUrl(message);
          break;
        case EXTRACTION_REASON.FOR_GALLERY:
          sendOriginalImageUrltoGallery(message);
          break;
      }
      break;

    case MESSAGES.SAVE_ALL_CONTENT:
      saveAllContent(message);
      break;

    case MESSAGES.RECEIVE_IMAGES_URLS:
      createImagesPage(message);
      break;

    case MESSAGES.GET_IMAGE_URL_FOR_GALLERY:
      getOriginalImageUrlForGallery(message);
      break;

    case MESSAGES.IMAGES_GALLERY_COMPLETED:
      sendImagesUrls();
      break;

    case MESSAGES.STOP_DOWNLOADING:
      stopDownloading();
      break;
  }
}

function onTabActivated (data) {
  const tabData = State.tabState(data.tabId);
  runUserScript(State.active(), State.saveMethod(), tabData);
}

function onTabUpdated (tabId, changeInfo, tab) {
  if (tab.active && tab.status === 'complete') {
    runUserScript(State.active(), State.saveMethod(), tab);
  }
}

function onTabRemoved (tabId) {
  State.tabState(tabId, undefined);
}

function onStorageChange (changes) {
  State.updateFromStorage(changes);
  
  setupContextMenu( State.getContextMenuState() );
}

export default init;
