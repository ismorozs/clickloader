const browser = require('webextension-polyfill');

import State from '../shared/state';
import { createSafeFolderName } from '../shared/helpers';
import {
  createElement,
  createSelect,
  emptyNode,
  hasClass,
  setupEventHandler,
  downloadFile,
} from "../shared/markup";

const NEW_FOLDER_INPUT = document.querySelector('.newFolder');
const FOLDERS_LIST = document.querySelector('.saveFoldersList');
const SPECIAL_RULES_LIST = document.querySelector('.specialRulesList');
const UPLOAD_RULES_INPUT = document.querySelector(".uploadRulesInput");

const RULES_KEYS = ['url', 'thumbImg', 'image', 'naming', 'folder'];
const NAMING_OPTIONS = ['Title', 'URL', 'Original'];

function init () {
  setupEventHandler(FOLDERS_LIST, 'click', handleFolder);
  setupEventHandler(SPECIAL_RULES_LIST, 'click', handleSpecialRules);
  setupEventHandler('.addNew', 'click', saveNewFolder);
  setupEventHandler(".saveRulesButton", "click", saveSpecialRules);
  setupEventHandler(".downloadRules", "click", downloadSpecialRules);
  setupEventHandler(".uploadRulesButton", "click", () => UPLOAD_RULES_INPUT.click());
  setupEventHandler(UPLOAD_RULES_INPUT, "change", uploadSpecialRules);

  browser.storage.onChanged.addListener(onStorageChange);

  State.loadSettings().then(setupOptions);
}

async function setupOptions ({ saveFolders, specialRules }) {
  await setupFoldersList(saveFolders);
  await setupSpecialRules(specialRules);
}

async function setupSpecialRules (specialRules) {
  emptyNode(SPECIAL_RULES_LIST);

  specialRules.forEach((params, rowIdx) => {
    const row = createElement("tr", "");
    
    params.forEach((value, i) => {
      const name = RULES_KEYS[i];
      let input;

      switch (name) {
        case "naming":
          input = createSelect(value, NAMING_OPTIONS, [name]);
          break;
        default:
          input = createElement("input", value, [name]);
          break;
      }

      const cell = document.createElement("td");
      cell.appendChild(input);

      row.appendChild(cell);
    });

    if (rowIdx !== specialRules.length - 1) {
      const removeButton = createElement("button", "Remove", [
        "remove",
        "attentionButton",
      ]);
      removeButton.dataset.index = rowIdx;
      row.appendChild(removeButton);
    }

    SPECIAL_RULES_LIST.appendChild(row);
  });
}

async function setupFoldersList(saveFolders) {
  emptyNode(FOLDERS_LIST);

  saveFolders.forEach((folder, i) => {
    if (!i) {
      return;
    }

    const item = document.createElement('li');
    const folderPath = createElement('span', '/' + folder, ['folderPath']);
    const editButton = createElement('button', 'Edit', ['edit']);
    editButton.dataset.folder = folder;
    const removeButton = createElement('button', 'Forget', ['remove', 'attentionButton']);
    removeButton.dataset.folder = folder;
    item.appendChild(folderPath);
    item.appendChild(editButton);
    item.appendChild(removeButton);

    FOLDERS_LIST.appendChild(item);
  });
}

function saveNewFolder () {
  const newFolder = createSafeFolderName(NEW_FOLDER_INPUT.value);

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

function handleSpecialRules (e) {
  const el = e.target;

  if (el.classList.contains("remove")) {
    removeRule(el.dataset.index);
  }
}

function removeRule (index) {
  const specialRules = State.specialRules();

  specialRules.splice(index, 1);

  browser.storage.local.set({ specialRules });
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

function saveSpecialRules () {
  const newSpecialRules = [];

  Array.from(SPECIAL_RULES_LIST.children).forEach((rulesRow) => {
    const newRules = [];

    Array.from(rulesRow.children).forEach((ruleCell) => {
      const input = ruleCell.querySelector("[value]");

      if (!input) {
        return;
      }

      if (hasClass(input, "folder")) {
        newRules.push(createSafeFolderName(input.value));
        return;
      }

      newRules.push(input.value);
    });

    newSpecialRules.push(newRules);
  });

  if (newSpecialRules[newSpecialRules.length - 1][0]) {
    newSpecialRules.push(["", "", "", "", ""]);
  }

  browser.storage.local.set({ specialRules: newSpecialRules });

  return newSpecialRules;
}

function downloadSpecialRules () {
  const newSpecialRules = saveSpecialRules();

  const text = newSpecialRules.reduce(
    (a, str) => a + str.join("\t") + "\n",
    "",
  );

  downloadFile(text, "text/plain", "Save on Click Rules.txt");
}

function uploadSpecialRules (e) {
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    const specialRules = reader.result.split("\n").map((str) => str.split("\t"));
    specialRules.pop();
    browser.storage.local.set({ specialRules });
  });

  if (e.target.files.length) {
    const text = e.target.files[0];
    reader.readAsText(text);
  }
}

function onStorageChange (changes) {
  for (let key in changes) {
    State[key](changes[key].newValue);
    if (key === 'saveFolders') {
      setupFoldersList(changes[key].newValue);
    }
    if (key === "specialRules") {
      setupSpecialRules(changes[key].newValue);
    }
  }
}

export default init;