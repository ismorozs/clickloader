const browser = require('webextension-polyfill');

import State from './background/state';
import { removeForbiddenCharacters } from './helpers';

const NEW_FOLDER_INPUT = document.querySelector('.newFolder');
const FOLDERS_LIST = document.querySelector('.saveFolders');

FOLDERS_LIST.addEventListener('click', (e) => handleFolder(e));
document.querySelector('.addNew').addEventListener('click', (e) => saveNewFolder(e));

browser.storage.onChanged.addListener(onStorageChange);

State.loadSettings().then(setupFoldersList);

async function setupFoldersList({ saveFolders }) {
  emptyNode(FOLDERS_LIST);

  saveFolders.forEach((folder, i) => {
    if (!i) {
      return;
    }

    const item = document.createElement('li');
    const folderPath = createElement('span', '/' + folder, ['folderPath']);
    const editButton = createElement('button', 'Edit', ['edit']);
    editButton.dataset.folder = folder;
    const removeButton = createElement('button', 'Forget', ['remove']);
    removeButton.dataset.folder = folder;
    item.appendChild(folderPath);
    item.appendChild(editButton);
    item.appendChild(removeButton);

    FOLDERS_LIST.appendChild(item);
  });
}

function createElement (type, text, classNames) {
  const button = document.createElement(type);
  button.appendChild( document.createTextNode(text) );
  button.classList.add(...classNames);
  return button;
}

function emptyNode (node) {
  while (node.hasChildNodes()) {
    node.removeChild(node.firstChild);
  }
}

function saveNewFolder () {
  let newFolder = NEW_FOLDER_INPUT.value;
  newFolder = removeForbiddenCharacters(newFolder).replace(/\/+/g, '/').replace(/^\/|\/$/g, '');

  if (newFolder.length) {
    newFolder += '/';
  }

  const saveFolders = State.saveFolders();

  if (!saveFolders.includes(newFolder)) {
    saveFolders.push(newFolder);
    saveFolders.sort();
  }

  browser.storage.local.set({ saveFolders, saveFolder: newFolder });

  NEW_FOLDER_INPUT.value = '';
}

function handleFolder (e) {
  const el = e.target;

  if (el.classList.contains('edit')) {
    editFolder( el.dataset.folder );
    return;
  }

  if (el.classList.contains('remove')) {
    removeFolder( el.dataset.folder );
  }
}

function editFolder (folder) {
  NEW_FOLDER_INPUT.value = folder;
  setTimeout(() => NEW_FOLDER_INPUT.focus());
}

function removeFolder (folder) {
  const saveFolders = State.saveFolders();
  saveFolders.splice( saveFolders.indexOf(folder), 1 );

  const saveFolder = folder === State.saveFolder() ? State.rootFolder() : State.saveFolder();
  
  browser.storage.local.set({ saveFolders, saveFolder });
}

function onStorageChange (changes) {
  for (let key in changes) {
    State[key](changes[key].newValue);
    if (key === 'saveFolders') {
      setupFoldersList({ saveFolders: changes[key].newValue });
    }
  }
}
