const browser = require('webextension-polyfill');

const EXTENSION_NAME = 'Save on Click';

const DEFAULT_SETTINGS = {
  saveFolder: EXTENSION_NAME + '/',
  saveMethod: 'contextmenu',
  saveFolders: ['', EXTENSION_NAME + '/']
};

const STATE = {
  tabs: {},
  active: false,
  saveFolders: [],
  saveFolder: "",
  saveMethod: "",
  tryOriginal: false,
  savedOriginalUrls: [],
  specialRules: [
    ["", "", "", "", ""],
  ],
};

const contextMenuKeys = [
  "active",
  "saveFolders",
  "saveFolder",
  "saveMethod",
  "tryOriginal",
  "galleryImagesTab",
  "galleryImagesUrls",
  "specialRules",
  "savedOriginalUrls",
  "isGalleryImagesSpecialRule",
  "thumbsCount",
  "isNoThumbCase",
];

const accessors = {};

contextMenuKeys.forEach((stateName) => {

  accessors[stateName] = (value) => {
    if (typeof value !== 'undefined') {
      STATE[stateName] = value;
    }
  
    return STATE[stateName];
  };

});

accessors.tabState = tabState;

function tabState (tabId, tab) {
  if (typeof tab !== 'undefined') {
    STATE.tabs[tabId] = tab;
  }

  return STATE.tabs[tabId];
}

function get (keys) {
  const values = {};

  keys.forEach((key) => {
    values[key] = accessors[key]();
  });

  return values;
}

function getContextMenuState () {
  return get(contextMenuKeys);
}

function rootFolder () {
  return DEFAULT_SETTINGS.saveFolders[0];
}

async function loadSettings () {
  const savedOptions = await browser.storage.local.get();
  
  for (let key in DEFAULT_SETTINGS) {
    if (typeof savedOptions[key] === 'undefined') {
      savedOptions[key] = DEFAULT_SETTINGS[key];
    }
  }

  Object.assign(STATE, savedOptions);
  return STATE;
}

function updateFromStorage (storageChanges) {
  for (let key in storageChanges) {
    STATE[key] = storageChanges[key].newValue;
  }
}

export default {
  ...accessors,
  loadSettings,
  getContextMenuState,
  rootFolder,
  updateFromStorage,
};
