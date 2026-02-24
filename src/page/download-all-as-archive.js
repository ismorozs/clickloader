const browser = require("webextension-polyfill/dist/browser-polyfill.min");
const JSZip = require("jszip");

import { getFileName, extractExtension } from "../shared/helpers";
import { DEBUG_FILENAME, DOWNLOAD_STATUS } from "../shared/consts";
import Logger from "../shared/logger";
import Popup from "./download-popup";

export async function downloadAllAsArchive(pageData) {
  const zip = new JSZip();
  const { originalUrls } = pageData;
  const { title } = originalUrls[0];

  for (let i = 0; i < originalUrls.length; i++) {
    if (!Popup.inProgress()) {
      return;
    }

    const idx = i + 1;
    const [fileName, downloadUrl] = getFileName(originalUrls[i], idx);
    const extension = extractExtension(downloadUrl);

    Logger.add(i)
    Logger.add(originalUrls[i]);
    Popup.update(idx, `${DOWNLOAD_STATUS.DOWNLAODING}${downloadUrl}`);

    try {
      const file = await fetch(downloadUrl).then((res) => res.arrayBuffer());
      zip.file(`${fileName}.${extension}`, file);
    } catch (e) {
      console.error(e);
      Logger.error(`${e} ${downloadUrl}`);
    }
  }

  zip.file(DEBUG_FILENAME, Logger.flush());

  const zipData = await zip.generateAsync({
    type: "blob",
    streamFiles: true,
  });

  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(zipData);
  link.download = `${title}.zip`;
  link.click();

  Popup.update(0);
}
