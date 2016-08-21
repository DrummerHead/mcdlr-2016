import * as d3Color from 'd3-color';

let allColors;

// color.h is hue, from 0 to 360
// color.s is saturation, from 0.0 to 2.0
// color.l is lightness, from 0.0 to 1.0

const colorTest = ({element, saturation, lightness}) => {
  const color = d3Color.cubehelix(element.dataset.colorSeed);
  let newColor = color;
  newColor.s = saturation;
  newColor.l = lightness;

  allColors +=
  `
  id: ${element.id}
  color:
    seed: '${element.dataset.colorSeed}'
    value: '${newColor.rgb().toString()}'
  `;

  const data = `<ul class='color-data'>
    <li>id: ${element.id}</li>
    <li>original: ${element.dataset.colorSeed}</li>
    <li>rgb: ${newColor.rgb()}</li>
    <li>h: ${newColor.h}</li>
    <li>areEqual: ${newColor.rgb().toString() === element.dataset.colorValue}</li>
  </ul>`;

  element.insertAdjacentHTML('beforeend', data);

  element.setAttribute('style', `background-color: ${newColor.rgb()}`);
}

for (const li of document.querySelectorAll('.site-colors')) {
  colorTest({element: li, saturation: 1, lightness: 0.5});
}

for (const li of document.querySelectorAll('.article-colors')) {
  colorTest({element: li, saturation: 1, lightness: 0.95});
}

document.querySelector('#link-color .color-data').setAttribute('style', `color: ${(() => {let c = d3Color.cubehelix("rgb(0,0,255)"); c.s = 1; c.l = .95; return c.rgb().toString()})()}`);

// So from the console you `copy(allColors)`
window.allColors = allColors;

