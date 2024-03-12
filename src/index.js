import _ from 'lodash';
import './style.css';
import image from './assets/image.png';
import notes from './assets/data.csv';
import data from './assets/data.xml';

import toml from './assets/data.toml';
import yaml from './assets/data.yaml';
import json from './assets/data.json5';

console.log(toml.title); // output `TOML Example`
console.log(toml.owner.name); // output `Tom Preston-Werner`

console.log(yaml.title); // output `YAML Example`
console.log(yaml.owner.name); // output `Tom Preston-Werner`

console.log(json.title); // output `JSON5 Example`
console.log(json.owner.name); // output `Tom Preston-Werner`

function component() {
  const element = document.createElement('div');

  // Lodash, currently included via a script, is required for this line to work
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  element.classList.add('hello');

  const myIcon = new Image();
  myIcon.src = image;
  element.appendChild(myIcon);

  console.log(notes);
  console.log(data);
  return element;
}

document.body.appendChild(component());