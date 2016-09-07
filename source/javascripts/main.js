import ColorState from './modules/colorState';
// import showWidthInEms from './modules/showWidthInEms';

// showWidthInEms(window);


window.addEventListener('load', () => {
  const colorState = new ColorState({ deltaRatio: 2 / 5, window, document });
  colorState.init();


  const header = document.querySelector("[itemtype='https://schema.org/WPHeader']");

  setTimeout(() => {
    header.classList.add('welcome-animation');
  }, 500);

  header.querySelector('svg').addEventListener('animationend', () => {
    colorState.updateLayoutData();
    header.classList.add('endstate-animation');
    header.classList.remove('welcome-animation');
  });
});
