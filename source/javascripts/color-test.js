import * as d3Color from 'd3-color';

let allColors;

for (const li of document.querySelectorAll('#color-test li')) {
  const color = d3Color.cubehelix(li.dataset.colorSeed);
  const newColor = color;
  newColor.s = 1;
  newColor.l = 0.95;

  allColors +=
  `
  id: ${li.id}
  color:
    seed: '${li.dataset.colorSeed}'
    value: '${newColor.rgb().toString()}'
  `;

  const data = `<ul class='color-data'>
    <li>id: ${li.id}</li>
    <li>original: ${li.dataset.colorSeed}</li>
    <li>rgb: ${newColor.rgb()}</li>
    <li>h: ${newColor.h}</li>
    <li>areEqual: ${newColor.rgb().toString() === li.dataset.colorValue}</li>
  </ul>`;

  li.insertAdjacentHTML('beforeend', data);

  li.setAttribute('style', `background-color: ${newColor.rgb()}`);
}

window.allColors = allColors;
