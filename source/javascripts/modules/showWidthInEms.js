const attachSign = () => {
  document.body.insertAdjacentHTML('beforeend', `
<div
  id='widthInEms'
  style='
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(255, 255, 255, 0.5);
    padding: 1em;
  '>
</div>`);
  return document.getElementById('widthInEms');
};

const updateOnResize = (widthInEms, window) => {
  widthInEms.textContent = window.innerWidth * 0.0625;
};

const init = (window) => {
  const widthInEms = attachSign();
  updateOnResize(widthInEms, window);
  window.addEventListener('resize', () => updateOnResize(widthInEms, window));
};

export default init;
