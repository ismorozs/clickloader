const browser = require('webextension-polyfill');

export function removeForbiddenCharacters (str, isFileName) {
  const regexpStr = [
    '[\\\\\?%*:|"<>',
    isFileName ? '\\/' : '\\.',
    ']'
  ].join('');

  const regexp = new RegExp(regexpStr, 'g');
  return str.replace(regexp, '_');
}

export function getCurrentTab () {
  return browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => tabs[0]);
}

export function isHTTPUrl (url) {
  return url.indexOf('http') === 0;
}
