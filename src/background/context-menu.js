const browser = require('webextension-polyfill');

import State from './state';
import { runUserScript } from './actions';

const SETTINGS_PAGE_URL = '/options/options.html';

const EVENT_MEANINGS = {
  contextmenu: 'Right-click',
  mousedown: 'Shift + Left-click',
  dblclick: 'Double-click',
};

const CONTEXT_MENU = {
  MAIN: { ID: 'MAIN', TITLE: (bool) => 'Save on Click' + (bool ? ' (active)' : '') },
  SWITCH: { ID: 'S', TITLE: (bool) => bool ? 'Disable' : 'Enable' },
  FOLDER_SUBMENU: { ID: 'F', TITLE: (currentFolder) => 'Save folder: /' + currentFolder },
  MANAGE_FOLDERS: { ID: 'N', TITLE: 'Manage folders' },
  METHOD_SUBMENU: { ID: 'M', TITLE: (currentMethod) => 'Save method: ' + EVENT_MEANINGS[currentMethod] },
};

export function setupContextMenu ({ active, saveFolders, saveFolder, saveMethod }) {
  browser.contextMenus.removeAll().then(() => {
    browser.contextMenus.create({ id: CONTEXT_MENU.MAIN.ID, title: CONTEXT_MENU.MAIN.TITLE(active), contexts: ["all"] });
    browser.contextMenus.create({ id: CONTEXT_MENU.SWITCH.ID, parentId: CONTEXT_MENU.MAIN.ID, title: CONTEXT_MENU.SWITCH.TITLE(active), contexts: ["all"] });
    browser.contextMenus.create({ parentId: CONTEXT_MENU.MAIN.ID, type: 'separator' });

    setupFolderSubmenu(saveFolders, saveFolder);
    setupMethodSubmenu(saveMethod);
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

function setupFolderSubmenu (saveFolders, currentSaveFolder) {
  browser.contextMenus.create({ id: CONTEXT_MENU.FOLDER_SUBMENU.ID, parentId: CONTEXT_MENU.MAIN.ID, title: CONTEXT_MENU.FOLDER_SUBMENU.TITLE(currentSaveFolder), contexts: ["all"] });

  browser.contextMenus.create({ id: CONTEXT_MENU.MANAGE_FOLDERS.ID, parentId: CONTEXT_MENU.FOLDER_SUBMENU.ID, title: CONTEXT_MENU.MANAGE_FOLDERS.TITLE, contexts: ["all"] });
  browser.contextMenus.create({ parentId: CONTEXT_MENU.FOLDER_SUBMENU.ID, type: 'separator' });
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

    case CONTEXT_MENU.MANAGE_FOLDERS.ID:
      openSettings();
      return

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

function changeSaveMethod (methodIdx) {
  const saveMethod = Object.keys(EVENT_MEANINGS)[ methodIdx ];
  browser.storage.local.set({ saveMethod });
  runUserScript(State.active(), saveMethod);
}

function openSettings () {
  browser.tabs.create({ active: true, url: SETTINGS_PAGE_URL });
}

function changeSaveFolder (folderIdx) {
  browser.storage.local.set({ saveFolder: State.saveFolders()[ folderIdx ] });
}
