const browser = require('webextension-polyfill');

import { removeForbiddenCharacters } from './helpers';

import {
  EXTENSION_NAME,
  DEFAULT_SETTINGS,
  EVENT_MEANINGS,
} from './values';

const STATE = {
  active: false,
};

const STATES_ON_TABS = {};

browser.browserAction.setBadgeBackgroundColor({ color: 'green' });
browser.storage.onChanged.addListener(onStorageChange);
browser.tabs.onRemoved.addListener(onTabRemoved);
browser.tabs.onActivated.addListener(onTabActivated);
browser.tabs.onUpdated.addListener(onTabUpdated);
browser.runtime.onMessage.addListener(onMessage);
browser.browserAction.onClicked.addListener(onClicked);

loadSettings();

function loadSettings () {
  return browser.storage.local.get().then((savedOptions) => {

    for (let key in DEFAULT_SETTINGS) {
      if (typeof savedOptions[key] === 'undefined') {
        savedOptions[key] = DEFAULT_SETTINGS[key];
        browser.storage.local.set({ [key]: savedOptions[key] });
      }
    }

    Object.assign(STATE, savedOptions);
  });
}

function onTabActivated (data) {
  const tabData = STATES_ON_TABS[ data.tabId ];
  let getTab = Promise.resolve(tabData);

  if (!tabData) {
    getTab = getCurrentTab();
  }

  getTab.then((tab) => runUserScript(tab, STATE.active, STATE.saveMethod));
}

function onTabUpdated (tabId, changeInfo, tab) {
  if (tab.active && tab.status === 'complete') {
    runUserScript(tab, STATE.active, STATE.saveMethod);
  }
}

function onTabRemoved (tabId) {
  STATES_ON_TABS[tabId] = undefined;
}

function runUserScript (tab, active, saveMethod) {
  if (tab.url.indexOf('http') !== 0) {
    return !active;
  }

  let executeScript = Promise.resolve();
  let sendMessage = () => {};

  const stateOnTab = STATES_ON_TABS[tab.id];
  if (!stateOnTab || stateOnTab.url !== tab.url) {

    if (!STATE.active && !active) {
      return !active;
    }

    executeScript = browser.tabs.executeScript(tab.id, { file: '/page-script.js' });
  }

  if (!stateOnTab || stateOnTab.url !== tab.url || stateOnTab.active !== active || stateOnTab.saveMethod !== saveMethod) {
    sendMessage = () => browser.tabs.sendMessage(tab.id, { action: 'switchClickHandler', active, saveMethod });
  }

  STATES_ON_TABS[tab.id] = { id: tab.id, active, saveMethod, url: tab.url };

  executeScript.then(sendMessage);
  return active;
}

function onMessage (data) {
  const imgName = removeForbiddenCharacters(data.src.split('//')[1], true);
  browser.downloads.download({
    url: data.src,
    saveAs: false,
    filename: STATE.saveFolder + imgName + data.extension
  });
}

function getCurrentTab () {
  return browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => tabs[0]);
}

function onClicked () {
  getCurrentTab()
    .then((tab) => {
      const active = runUserScript(tab, !STATE.active, STATE.saveMethod);
      STATE.active = active;
      switchIcon(active);
    });
}

function switchIcon (active) {
  browser.browserAction.setBadgeText({ text: active ? 'A' : '' });

  const status = active ? 'active' : 'inactive';
  const title = [ EXTENSION_NAME + ' (' + status + ')' ];

  if (active) {
    title.push(
      'Save folder: ' + STATE.saveFolder,
      'Save method: ' + EVENT_MEANINGS[ STATE.saveMethod ],
    );
  }
  
  browser.browserAction.setTitle({ title: title.join('\n') });
}

function onStorageChange (changes) {
  for (let key in changes) {
    STATE[key] = changes[key].newValue;
  }

  switchIcon(STATE.active);
}
