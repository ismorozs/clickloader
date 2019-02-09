const CONTENT_SCRIPT_PATH = '/content_scripts/main.js';
const CONTENT_SCRIPT_ACTION = 'switchClickHandler';
const DOWNLOAD_NOTIFICATION_PREFIX = '_dn';
const EXTENSION_NAME = 'Clickloader';

const STATE = {
  active: false,
  saveFolder: EXTENSION_NAME
};

browser.browserAction.setBadgeBackgroundColor({ color: 'green' });
browser.storage.onChanged.addListener(onStorageChange);
browser.tabs.onUpdated.addListener(onTabsUpdate);
browser.runtime.onMessage.addListener(onMessage);
browser.browserAction.onClicked.addListener(onClicked);

loadSettings().then(() => {
  browser.tabs.query({}).then((tabs) =>
    tabs.forEach((tab) =>
      browser.tabs.executeScript(tab.id, { file: CONTENT_SCRIPT_PATH })));
});

function loadSettings () {
  return browser.storage.local.get().then((values) => {

    if (typeof values.saveFolder === 'undefined') {
      values.saveFolder = EXTENSION_NAME;
      browser.storage.local.set({ saveFolder: values.saveFolder });
    }

    STATE.saveFolder = values.saveFolder;
  });
}

function onTabsUpdate (tabId, changeInfo, tab) {
  if (tab.status === 'complete') {
    browser.tabs.executeScript(tab.id, { file: CONTENT_SCRIPT_PATH })
      .then(() => browser.tabs.sendMessage(tab.id, { action: CONTENT_SCRIPT_ACTION, senderId: browser.runtime.id, activate: STATE.active }));
  }
}

function onMessage (data) {
  if (data.senderId === browser.runtime.id) {
    const imgName = data.src.split('//')[1].replace(/[/\\?%*:|"<>]/g, '_');
    browser.downloads.download({
      url: data.src,
      saveAs: false,
      filename: STATE.saveFolder + '/' + imgName + data.extension
    });
  }
}

function onClicked () {
  switchIcon(STATE.active);
  switchClickHandler(STATE.active);
  STATE.active = !STATE.active;
}

function switchIcon (bool) {
  const status = bool ? 'inactive' : 'active';

  browser.browserAction.setBadgeText({ text: bool ? '' : 'A' });
  browser.browserAction.setTitle({ title: EXTENSION_NAME + ' (' + status + ')' });
}

function switchClickHandler (active) {
  browser.tabs.query({}).then((tabs) =>
      tabs.forEach((tab) =>
        browser.tabs.sendMessage(tab.id, { action: CONTENT_SCRIPT_ACTION, senderId: browser.runtime.id, activate: !active })));
}

function onStorageChange (changes) {
  for (let key in changes) {
    STATE[key] = changes[key].newValue;
  }
}
