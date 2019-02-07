(function () {
  if (window.hasRun) return;
  window.hasRun = true;


  browser.runtime.onMessage.addListener(onMessage);

  function onMessage (message) {
    if (message.senderId !== browser.runtime.id) {
      return;
    }

    switchClickHandler(message);
  }

  function switchClickHandler (data) {
    const operation = data.activate ? 'add' : 'remove';
    window[operation + 'EventListener']('contextmenu', sendImageUrl);
  }

  function sendImageUrl (e) {
    e.preventDefault();
    if (e.target.src) {
      browser.runtime.sendMessage({ imgUrl: e.target.src, senderId: browser.runtime.id });
    }
  }

})();
