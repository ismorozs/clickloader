const browser = require('webextension-polyfill');

import State from '../shared/state';
import {
  runUserScript
} from "./actions";

import { setupContextMenu, onContextMenuClicked } from './context-menu';
import { onMessage } from './onMessage';

function init () {
  browser.storage.onChanged.addListener(onStorageChange);
  browser.tabs.onRemoved.addListener(onTabRemoved);
  browser.tabs.onActivated.addListener(onTabActivated);
  browser.tabs.onUpdated.addListener(onTabUpdated);
  browser.runtime.onMessage.addListener(onMessage);
  browser.contextMenus.onClicked.addListener(onContextMenuClicked);

  State.loadSettings().then(setupContextMenu);
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
