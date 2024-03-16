import _ from 'lodash';
import Print from './print';

function component() {
  const element = document.createElement('div');

  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  btn.onclick = Print.bind(null, 'Hello webpack!');

  return element;
}

document.body.appendChild(component());