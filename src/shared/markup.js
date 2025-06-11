export function createElement(type, text, classNames = []) {
  const el = document.createElement(type);

  switch (type) {
    case "input":
      el.setAttribute("value", text);
      break;

    case "img":
      el.setAttribute("src", text);
      break;

    default:
      el.appendChild(document.createTextNode(text));
      break;
  }

  el.classList.add(...classNames);
  return el;
}

export function setupEventHandler (selector, event, callback) {
  const el = typeof selector === "string" ? document
    .querySelector(selector) : selector;

  el.addEventListener(event, (e) => callback(e));
}

export function createSelect (value, options, classes = []) {
  const select = document.createElement("select");

  options.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.text = value;
    select.appendChild(option);
  });

  select.setAttribute("value", value);
  select.value = value;
  select.classList.add(...classes)
  
  return select;
}

export function emptyNode(node) {
  while (node.hasChildNodes()) {
    node.removeChild(node.firstChild);
  }
}

export function hasClass (el, className) {
  return el.classList.contains(className);
}
