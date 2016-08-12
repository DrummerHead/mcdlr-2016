import ColorState from './modules/colorState';

window.addEventListener('load', () => {
  console.log('it loaded');
  const colorState = new ColorState({ deltaRatio: 3 / 7, window, document });
  colorState.init();
});
