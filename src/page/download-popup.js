const browser = require("webextension-polyfill/dist/browser-polyfill.min");

import { EXTENSION_NAME, MESSAGES } from "../shared/consts";
import { createElement, downloadFile } from "../shared/markup";

const CLASSES = {
  ANIMATION: "ANIMATION",
  CONTAINER: "CONTAINER",
  STOP_BUTTON: "STOP_BUTTON",
  PROGRESS_CONTAINER: "PROGRESS_CONTAINER",
  DOWNLOADING_FILE: "DOWNLOADING_FILE",
  PROGRESS_SPINNER: "PROGRESS_SPINER",
  DOWNLOAD_LEFT: "DOWNLOAD_LEFT",
  DOWNLOAD_TOTAL: "DOWNLOAD_TOTAL",
};

const Popup = {
  container: null,
  styles: null,
  downloadLeft: null,
  downloadingFile: null,
  inProgress: false,
};

export default {
  build: buildPopup,
  update: updatePopup,
  inProgress: () => Popup.inProgress,
}

function buildPopup (totalCount) {
  const uid = Date.now();

  const container = createElement("div", "", [
    prefixClassName(uid, CLASSES.CONTAINER),
  ]);
  const stopDownloadingButton = createElement("button", "Stop", [
    prefixClassName(uid, CLASSES.STOP_BUTTON),
  ]);
  stopDownloadingButton.onclick = removePopup;
  const progressContainer = createElement("div", "", [
    prefixClassName(uid, CLASSES.PROGRESS_CONTAINER),
  ]);
  const downloadingFile = createElement("p", "", [
    prefixClassName(uid, CLASSES.DOWNLOADING_FILE),
  ]);
  const progressSpinner = createElement("div", "", [
    prefixClassName(uid, CLASSES.PROGRESS_SPINNER),
  ]);
  const progressNumbers = createElement("div", "");
  const downloadLeft = createElement("span", 10, [
    prefixClassName(uid, CLASSES.DOWNLOAD_LEFT),
  ]);
  const downloadTotal = createElement("span", ` / ${totalCount}`, [
    prefixClassName(uid, CLASSES.DOWNLOAD_TOTAL),
  ]);

  progressNumbers.appendChild(downloadLeft);
  progressNumbers.appendChild(downloadTotal);

  progressContainer.appendChild(downloadingFile);
  progressContainer.appendChild(progressSpinner);
  progressContainer.appendChild(progressNumbers);

  container.appendChild(stopDownloadingButton);
  container.appendChild(progressContainer);

  const styles = createStyles(uid);

  window.addEventListener("beforeunload", removePopup);

  document.body.appendChild(styles);
  document.body.appendChild(container);

  Popup.container = container;
  Popup.styles = styles;
  Popup.downloadLeft = downloadLeft;
  Popup.downloadingFile = downloadingFile;
  Popup.inProgress = true;
}

function removePopup() {
  if (!Popup.container) {
    return;
  }

  browser.runtime.sendMessage({
    type: MESSAGES.STOP_DOWNLOADING,
  });
  Popup.downloadLeft = null;
  Popup.downloadingFile = null;
  document.body.removeChild(Popup.container);
  document.body.removeChild(Popup.styles);
  Popup.container = null;
  Popup.styles = null;
  Popup.inProgress = false;
  window.removeEventListener("beforeunload", removePopup);
}

function updatePopup(count, filename) {
  if (count) {
    setText(Popup.downloadLeft, count);
  }

  if (filename) {
    setText(Popup.downloadingFile, filename);
  }

  if (count === 0) {
    removePopup();
  }
}

function setText(domNode, text) {
  domNode.textContent = text;
}

function prefixClassName(uid, className) {
  return `${EXTENSION_NAME}${uid}${className}`;
}

function createStyles(uid) {
  const styles = document.createElement("style");
  styles.textContent = `
    @keyframes ${prefixClassName(uid, CLASSES.ANIMATION)} {
      to{
        transform: rotate(1turn)
      }
    }

    .${prefixClassName(uid, CLASSES.CONTAINER)} {
      position: fixed;
      z-index: 9999;
      top: 20px;
      right: 20px;
      text-align: left;
      display: flex;
      flex-direction: column;
      background: white;
      padding: 20px;
      padding-bottom: 10px;
      gap: 5px;
      border-radius: 20px;
      border: 5px solid rgb(254, 119, 9);
    }

    .${prefixClassName(uid, CLASSES.STOP_BUTTON)} {
      display: inline-block;
      text-align: center;
      background: none;
      font-size: 20px;
      min-width: 68px;
      box-sizing: border-box;
      padding: 10px 18px;
      vertical-align: bottom;
      width: 250px;
      align-self: end;
      background-color: white;
      border: 2px solid black;
    }

    .${prefixClassName(uid, CLASSES.STOP_BUTTON)}:hover {
      border-color: #dc0000;
      color: #dc0000;
    }

    .${prefixClassName(uid, CLASSES.PROGRESS_CONTAINER)} {
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-right: 3px;
      gap: 15px;
    }

    .${prefixClassName(uid, CLASSES.PROGRESS_SPINNER)} {
      margin-top: 5px;
      width: 20px;
      padding: 8px;
      aspect-ratio: 1;
      border-radius: 50%;
      background: rgb(254, 119, 9);
      --_m: 
        conic-gradient(#0000 10%,#000),
        linear-gradient(#000 0 0) content-box;
      -webkit-mask: var(--_m);
              mask: var(--_m);
      -webkit-mask-composite: source-out;
              mask-composite: subtract;
      animation: ${prefixClassName(uid, CLASSES.ANIMATION)} 1.5s infinite linear;
    }
  `;

  return styles;
}
