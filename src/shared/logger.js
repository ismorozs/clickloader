import { CHARACTERS } from "./consts";

const { TAB, NL } = CHARACTERS;

let logText = "";

export default {
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
    logText += text + NL + NL
  },
  flush: () => {
    const temp = logText;
    logText = "";
    return temp;
  }
}