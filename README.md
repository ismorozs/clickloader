# Clickloader
This repository contains source code for [Firefox browser extension](https://addons.mozilla.org/en-US/firefox/addon/clickloader/).


For Chromium-based browsers (Chromium, Chrome, Opera, etc)  installation can be done manually with such steps:
1. Download the repository
2. Navigate to ``chrome://extensions`` in your browser
3. Click ``Load unpacked`` button and select ``./extension`` folder of the downloaded repository in the opened window

## Developing and reviewing
To start developing or recreate the current extension build
```sh
npm install
```
and then
```sh
npm start
```
in the root folder of the repository.

---
All the files for the extension that are actually loaded into the browser are stored in ``./extension`` folder.
