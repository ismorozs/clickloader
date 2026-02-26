import { CHARACTERS, LOADING_ERROR_ADVICE } from "./consts";

const { TAB, NL } = CHARACTERS;

let logText = "";

export const LOGGING_HEADERS = ["title", "href", "naming", "imageSelector"];
export const LOGGING_IMAGE_DATA = ["thumbUrl", "originalHref", "originalUrl", "originalTitle"];

export default {
  addHeaders: (data, headers) => {
    const text = Object.keys(data).filter((k) => headers.includes(k)).map((k) => `${k}: ${data[k]}`).join(NL);
    logText += text + NL + NL;
  },
  add: (text) => {
    if (Array.isArray(text)) {
      logText += text.join(TAB);
    } else if (typeof text === "object") {
      logText += Object.keys(text).map((k) => `${k}: ${text[k]}`).join(NL) + NL;
    } else {
      logText += text;
    }

    logText += NL;
  },
  error: (text) => {
    logText += `${text}${NL}${NL}`
  },
  flush: () => {
    const temp = logText;
    logText = "";
    return temp;
  }
}