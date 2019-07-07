const SETTINGS = {
  saveFolder: {
    default: 'Clickloader/',
    prepare: (val) => {
      let saveFolder = val.replace(/[\.\\?%*:|"<>]/g, '_').replace(/\/+/g, '/').replace(/\/$/, '');

      if (saveFolder.length) {
        saveFolder += '/';
      }

      return saveFolder;
    }
  },
  saveMethod: { default: 'contextmenu', prepare: (val) => val },
};

browser.storage.onChanged.addListener((changes) => {
  for (let key in changes) {
    if (SETTINGS[key]) {
      document.querySelector('.' + key).value = changes[key].newValue;
    }
  }
});

function setupInterface () {
  const settingsKeys = Object.keys(SETTINGS);

  browser.storage.local.get(settingsKeys)
    .then((values) => {
      for (let key in values) {
        document.querySelector('.' + key).value = values[key];
      }
    });
}

document.addEventListener('DOMContentLoaded', () => {
  setupInterface();

  document.querySelector('.save').addEventListener('click', (e) => saveSettings(e));
  document.querySelector('.defaults').addEventListener('click', resetToDefaults);

});

function saveSettings (e) {
  e.preventDefault();

  const form = document.querySelector('.form');

  const NEW_SETTINGS = {};
  for (let key in SETTINGS) {
    const newValue = SETTINGS[key].prepare( form.elements[key].value );
    NEW_SETTINGS[key] =  newValue;
  }

  browser.storage.local.set(NEW_SETTINGS);
}

function resetToDefaults () {
  const DEFAULT_SETTINGS = {};
  for (let key in SETTINGS) {
    DEFAULT_SETTINGS[key] = SETTINGS[key].default;
  }

  browser.storage.local.set(DEFAULT_SETTINGS);
}
