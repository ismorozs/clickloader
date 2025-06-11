const browser = require('webextension-polyfill');

import State from '../shared/state';
import { getCurrentTab, isHTTPUrl, removeForbiddenCharacters } from '../shared/helpers';

const MAX_FILE_NAME = 200;

export async function runUserScript (newActiveState, newSaveMethod, tab) {
  if (!tab) {
    tab = await getCurrentTab();
  }
  
  if (!isHTTPUrl(tab.url)) {
    return !newActiveState;
  }

  let executeScript = Promise.resolve();
  let sendMessage = () => {};

  const stateOnTab = State.tabState(tab.id);
  if (!stateOnTab || stateOnTab.url !== tab.url) {

    if (!State.active() && !newActiveState) {
      return false;
    }

    executeScript = browser.tabs.executeScript(tab.id, { file: '/page-script.js' });
  }

  if (!stateOnTab || stateOnTab.url !== tab.url || stateOnTab.active !== newActiveState || stateOnTab.saveMethod !== newSaveMethod) {
    sendMessage = () => browser.tabs.sendMessage(tab.id, { action: 'switchClickHandler', active: newActiveState, saveMethod: newSaveMethod });
  }

  State.tabState(tab.id, { id: tab.id, active: newActiveState, saveMethod: newSaveMethod, url: tab.url });

  executeScript.then(sendMessage);
  return newActiveState;
}

export function saveContent ({ name, src, extension }) {
  const sourceExtension = src
    .split(".")
    .slice(-1)[0]
    .split("?")[0]
    .split("/")[0];
  const handledName = removeForbiddenCharacters(name, true).substring(0, MAX_FILE_NAME);
  browser.downloads.download({
    url: src,
    saveAs: false,
    filename: `${State.saveFolder()}${handledName}.${sourceExtension}${extension}`,
  });
}
