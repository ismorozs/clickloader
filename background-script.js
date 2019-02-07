const CONTENT_SCRIPT_PATH = '/content_scripts/main.js';
const CONTENT_SCRIPT_ACTION = 'switchClickHandler';

let active = false;

browser.browserAction.setBadgeBackgroundColor({ color: 'green' });

browser.tabs.query({}).then((tabs) =>
  tabs.forEach((tab) =>
    browser.tabs.executeScript(tab.id, { file: CONTENT_SCRIPT_PATH })));

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.status === 'complete') {
    browser.tabs.executeScript(tab.id, { file: CONTENT_SCRIPT_PATH })
      .then(() => browser.tabs.sendMessage(tab.id, { action: CONTENT_SCRIPT_ACTION, senderId: browser.runtime.id, activate: active }));
  }
});

browser.runtime.onMessage.addListener((data) => {

  if (data.senderId === browser.runtime.id) {
    browser.downloads.download({ url: data.imgUrl, saveAs: false });
  }

});

browser.browserAction.onClicked.addListener(() => {

  switchIcon(active);
  switchClickHandler(active);

  active = !active;
});


function switchIcon (bool) {
  const status = bool ? 'inactive' : 'active';

  browser.browserAction.setBadgeText({ text: bool ? '' : 'A' });
  browser.browserAction.setTitle({ title: 'Clickloader (' + status + ')' });
}

function switchClickHandler (active) {
  browser.tabs.query({}).then((tabs) =>
      tabs.forEach((tab) =>
        browser.tabs.sendMessage(tab.id, { action: CONTENT_SCRIPT_ACTION, senderId: browser.runtime.id, activate: !active })));
}
