import * as d3Color from 'd3-color'

for(const li of document.querySelectorAll('#color-test li')){
  const color = d3Color.cubehelix(li.dataset.color)
  const newColor = color;
  newColor.s = 1.4;
  newColor.l = 0.9;

  const data = `<ul class='color-data'>
    <li>rgb: ${newColor.rgb()}</li>
    <li>h: ${newColor.h}</li>
    <li>s: ${newColor.s}</li>
    <li>l: ${newColor.l}</li>
  </ul>`

  li.insertAdjacentHTML('beforeend', data);

  li.setAttribute('style', `background-color: ${newColor.rgb()}`);

  console.log(li.id)
}
