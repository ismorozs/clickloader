const browser = require('webextension-polyfill');

import { removeForbiddenCharacters } from './helpers';
import { EVENT_MEANINGS, DEFAULT_SETTINGS } from './values';

const FIELDS = {
  saveFolder: {
    prepare: (val) => {
      let saveFolder = removeForbiddenCharacters(val).replace(/\/+/g, '/').replace(/\/$/, '');

      if (saveFolder.length) {
        saveFolder += '/';
      }

      return saveFolder;
    }
  },
  saveMethod: { prepare: (val) => val, options: EVENT_MEANINGS },
};

browser.storage.onChanged.addListener((changes) => {
  for (let key in changes) {
    if (FIELDS[key]) {
      document.querySelector('.' + key).value = changes[key].newValue;
    }
  }
});

function setupInterface () {
  const settingsKeys = Object.keys(FIELDS);

  browser.storage.local.get(settingsKeys)
    .then((values) => {
      for (let key in values) {
        const field = FIELDS[key];
        const el = document.querySelector('.' + key);

        if (field.options) {
          appendOptions(el, field.options);
        }
        
        field.default = DEFAULT_SETTINGS[key].default;
        el.value = values[key];
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
  for (let key in FIELDS) {
    const newValue = FIELDS[key].prepare( form.elements[key].value );
    NEW_SETTINGS[key] =  newValue;
  }

  browser.storage.local.set(NEW_SETTINGS);
}

function resetToDefaults () {
  browser.storage.local.set(DEFAULT_SETTINGS);
}

function appendOptions (select, options) {
  for (let value in options) {
    const option = document.createElement('option');
    option.value = value;
    option.appendChild( document.createTextNode(options[value]) );
    select.appendChild(option);
  }
}
