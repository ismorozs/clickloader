browser.storage.onChanged.addListener((changes) =>
  document.querySelector('#saveFolder').value = changes.saveFolder.newValue
);

document.addEventListener('DOMContentLoaded', () => {

  browser.storage.local.get().then((values) => {
    document.querySelector('#saveFolder').value = values.saveFolder;
  });

  document.querySelector('#save').addEventListener('click', (e) => {
    e.preventDefault();

    const form = document.querySelector('#form');

    let saveFolder = form.elements['saveFolder'].value || 'Clickloader';
    saveFolder = saveFolder.replace(/[\./\\?%*:|"<>]/g, '_');
    
    browser.storage.local.set({ saveFolder });
  });

  document.querySelector('#defaults').addEventListener('click', (e) => browser.storage.local.set({ saveFolder: 'Clickloader' }))

});
