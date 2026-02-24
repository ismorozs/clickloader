const browser = require('webextension-polyfill');

import { COLLECTING_REASON } from '../shared/consts';
import State from '../shared/state';
import { runUserScript, openSettings } from "./actions";
import { prepareForGalleryPage } from "./actions/gallery";

const EVENT_MEANINGS = {
  contextmenu: 'Right-click',
  mousedown: 'Shift + Left-click',
  dblclick: 'Double-click',
};

const TRY_ORIGINAL_STATES = ['Disabled', 'Download original'];
const NAMING_STATES = ["Title", "URL", "Original"];
const DOWNLOAD_ALL_OPTIONS = ["Raw", "As archive"];

const CONTEXT_MENU = {
  MAIN: { ID: 'MAIN', TITLE: (isActive, tryOriginal) => {
      return `Save on Click ${isActive ? '(active)' : ''} ${tryOriginal ? '(+)' : ''}`
    }
  },
  SWITCH: { ID: 'S', TITLE: (bool) => bool ? 'Disable' : 'Enable' },
  FOLDER_SUBMENU: { ID: 'F', TITLE: (currentFolder) => 'Save folder: /' + currentFolder },
  MANAGE_FOLDERS: { ID: 'N', TITLE: 'Manage folders' },
  METHOD_SUBMENU: { ID: 'M', TITLE: (currentMethod) => 'Save method: ' + EVENT_MEANINGS[currentMethod] },
  NAMING_SUBMENU: { ID: 'G', TITLE: (currentNaming) => `Save naming: ${currentNaming}` },
  DOWNLOAD_ALL_SUBMENU: { ID: 'D', TITLE: "Download all from the page" },
  TRY_DOWNLOAD_ORIGINAL: { ID: 'O', TITLE: (currentTryOriginal) => buildTryOriginalTitle(currentTryOriginal) },
  SHOW_PICTURES_GALERY: { ID: 'P', TITLE: 'Show page pictures' },
  CUSTOMIZE: { ID: 'C', TITLE: 'Customize special rules' },
  SEPARATOR1: { ID: 'SEPARATOR1' },
  SEPARATOR2: { ID: 'SEPARATOR2' },
  SEPARATOR3: { ID: 'SEPARATOR3' },
  SEPARATOR4: { ID: 'SEPARATOR4' },
  SEPARATOR5: { ID: 'SEPARATOR5' },
};

function buildTryOriginalTitle (currentTryOriginal) {
  return `Try download original ${currentTryOriginal ? '(+)' : ''}`;
}

export function setupContextMenu ({ active, saveFolders, saveFolder, saveMethod, saveNaming, tryOriginal }) {
  browser.contextMenus.removeAll().then(() => {
    browser.contextMenus.create({ id: CONTEXT_MENU.MAIN.ID, title: CONTEXT_MENU.MAIN.TITLE(active, tryOriginal), contexts: ["all"] });
    browser.contextMenus.create({ id: CONTEXT_MENU.SWITCH.ID, parentId: CONTEXT_MENU.MAIN.ID, title: CONTEXT_MENU.SWITCH.TITLE(active), contexts: ["all"] });
    setupTryDownloadOrignalSubmenu(tryOriginal);
    
    browser.contextMenus.create({
      id: CONTEXT_MENU.SEPARATOR5.ID,
      parentId: CONTEXT_MENU.MAIN.ID,
      type: "separator",
    });

    browser.contextMenus.create({ id: CONTEXT_MENU.SEPARATOR4.ID, parentId: CONTEXT_MENU.MAIN.ID, type: 'separator' });

    setupFolderSubmenu(saveFolders, saveFolder);
    setupMethodSubmenu(saveMethod);
    setupNamingSubmnenu(saveNaming);

    browser.contextMenus.create({
      id: CONTEXT_MENU.SEPARATOR1.ID,
      parentId: CONTEXT_MENU.MAIN.ID,
      type: "separator",
    });

    setupDownloadAllSubmenu();

    browser.contextMenus.create({
      id: CONTEXT_MENU.SHOW_PICTURES_GALERY.ID,
      parentId: CONTEXT_MENU.MAIN.ID,
      title: CONTEXT_MENU.SHOW_PICTURES_GALERY.TITLE,
      contexts: ["all"],
    });
    browser.contextMenus.create({
      id: CONTEXT_MENU.SEPARATOR2.ID,
      parentId: CONTEXT_MENU.MAIN.ID,
      type: "separator",
    });
    browser.contextMenus.create({
      id: CONTEXT_MENU.CUSTOMIZE.ID,
      parentId: CONTEXT_MENU.MAIN.ID,
      title: CONTEXT_MENU.CUSTOMIZE.TITLE,
      contexts: ["all"],
    });
  });
}

function setupMethodSubmenu (currentSaveMethod) {
  browser.contextMenus.create({ id: CONTEXT_MENU.METHOD_SUBMENU.ID, parentId: CONTEXT_MENU.MAIN.ID, title: CONTEXT_MENU.METHOD_SUBMENU.TITLE(currentSaveMethod), contexts: ["all"] });

  Object.keys(EVENT_MEANINGS).forEach((method, i) => {
    const title = EVENT_MEANINGS[method];
    const isActive = method === currentSaveMethod;
    browser.contextMenus.create({ id: CONTEXT_MENU.METHOD_SUBMENU.ID + i, parentId: CONTEXT_MENU.METHOD_SUBMENU.ID, title, contexts: ["all"], type: 'radio', checked: isActive });
  }); 
}

function setupNamingSubmnenu (currentNaming) {
  browser.contextMenus.create({
    id: CONTEXT_MENU.NAMING_SUBMENU.ID,
    parentId: CONTEXT_MENU.MAIN.ID,
    title: CONTEXT_MENU.NAMING_SUBMENU.TITLE(currentNaming),
    contexts: ["all"],
  });

  NAMING_STATES.forEach((naming, i) => {

    const isActive = naming === currentNaming;
    browser.contextMenus.create({
      id: CONTEXT_MENU.NAMING_SUBMENU.ID + i,
      parentId: CONTEXT_MENU.NAMING_SUBMENU.ID,
      title: naming,
      contexts: ["all"],
      type: "radio",
      checked: isActive,
    });
  }); 
}

function setupDownloadAllSubmenu () {
  browser.contextMenus.create({
    id: CONTEXT_MENU.DOWNLOAD_ALL_SUBMENU.ID,
    parentId: CONTEXT_MENU.MAIN.ID,
    title: CONTEXT_MENU.DOWNLOAD_ALL_SUBMENU.TITLE,
    contexts: ["all"],
  });

  DOWNLOAD_ALL_OPTIONS.forEach((title, i) => {
    browser.contextMenus.create({
      id: CONTEXT_MENU.DOWNLOAD_ALL_SUBMENU.ID + i,
      parentId: CONTEXT_MENU.DOWNLOAD_ALL_SUBMENU.ID,
      title,
      contexts: ["all"],
    });
  });
}

function setupTryDownloadOrignalSubmenu (currentTryOriginal) {
  browser.contextMenus.create({
    id: CONTEXT_MENU.TRY_DOWNLOAD_ORIGINAL.ID,
    parentId: CONTEXT_MENU.MAIN.ID,
    title: buildTryOriginalTitle(currentTryOriginal),
    contexts: ["all"],
  });

  TRY_ORIGINAL_STATES.forEach((title, i) => {
    const checked = i === 0 && !currentTryOriginal || i === 1 && currentTryOriginal;

    browser.contextMenus.create({
      id: CONTEXT_MENU.TRY_DOWNLOAD_ORIGINAL.ID + i,
      parentId: CONTEXT_MENU.TRY_DOWNLOAD_ORIGINAL.ID,
      title,
      contexts: ["all"],
      type: "radio",
      checked,
    });
  });
}

function setupFolderSubmenu (saveFolders, currentSaveFolder) {
  browser.contextMenus.create({ id: CONTEXT_MENU.FOLDER_SUBMENU.ID, parentId: CONTEXT_MENU.MAIN.ID, title: CONTEXT_MENU.FOLDER_SUBMENU.TITLE(currentSaveFolder), contexts: ["all"] });

  browser.contextMenus.create({ id: CONTEXT_MENU.MANAGE_FOLDERS.ID, parentId: CONTEXT_MENU.FOLDER_SUBMENU.ID, title: CONTEXT_MENU.MANAGE_FOLDERS.TITLE, contexts: ["all"] });
  browser.contextMenus.create({
    id: CONTEXT_MENU.SEPARATOR3.ID,
    parentId: CONTEXT_MENU.FOLDER_SUBMENU.ID,
    type: "separator",
  });
  saveFolders.forEach((folder, i) => {
    const isActive = folder === currentSaveFolder;
    browser.contextMenus.create({ id: CONTEXT_MENU.FOLDER_SUBMENU.ID + i, parentId: CONTEXT_MENU.FOLDER_SUBMENU.ID, title: '/' + folder, contexts: ["all"], type: 'radio', checked: isActive });
  });
}

export function onContextMenuClicked (info) {
  switch (info.menuItemId[0]) {
    case CONTEXT_MENU.SWITCH.ID:
      onSwitchClicked();
      return;

    case CONTEXT_MENU.METHOD_SUBMENU.ID:
      changeSaveMethod(info.menuItemId[1]);
      return;

    case CONTEXT_MENU.NAMING_SUBMENU.ID:
      changeSaveNaming(info.menuItemId[1]);
      break;

    case CONTEXT_MENU.DOWNLOAD_ALL_SUBMENU.ID:
      downloadAll(info.menuItemId[1]);
      break;

    case CONTEXT_MENU.MANAGE_FOLDERS.ID:
      openSettings();
      return;

    case CONTEXT_MENU.CUSTOMIZE.ID:
      openSettings();
      return;

    case CONTEXT_MENU.TRY_DOWNLOAD_ORIGINAL.ID:
      changeTryDownloadOriginal(info.menuItemId[1]);
      return;

    case CONTEXT_MENU.SHOW_PICTURES_GALERY.ID:
      openPagePictures();
      return;

    case CONTEXT_MENU.FOLDER_SUBMENU.ID:
      changeSaveFolder(info.menuItemId[1]);
      return;
  }
}

async function onSwitchClicked () {
  const active = await runUserScript(!State.active(), State.saveMethod());
  State.active(active);
  setupContextMenu( State.getContextMenuState() );
}

function changeTryDownloadOriginal (tryOriginal) {
  browser.storage.local.set({ tryOriginal: Boolean(+tryOriginal) });
}

function changeSaveMethod (methodIdx) {
  const saveMethod = Object.keys(EVENT_MEANINGS)[ methodIdx ];
  browser.storage.local.set({ saveMethod });
  runUserScript(State.active(), saveMethod);
}

function changeSaveNaming (methodIdx) {
  browser.storage.local.set({ saveNaming: NAMING_STATES[methodIdx] });
}

async function openPagePictures () {
  prepareForGalleryPage(COLLECTING_REASON.FOR_GALLERY);
}

function changeSaveFolder (folderIdx) {
  browser.storage.local.set({ saveFolder: State.saveFolders()[ folderIdx ] });
}

function downloadAll (downloadIdx) {
  downloadIdx == 1
    ? prepareForGalleryPage(COLLECTING_REASON.DOWNLOAD_ON_SITE_AS_ARCHIVE)
    : prepareForGalleryPage(COLLECTING_REASON.DOWNLOAD_ON_SITE_RAW);
}
