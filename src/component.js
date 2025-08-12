export default (text = "Hello world") => {
  const element = document.createElement("div");
  element.innerText = text;
  return element;
};
