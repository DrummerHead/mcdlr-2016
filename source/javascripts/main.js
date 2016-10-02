import ColorState from './modules/colorState';
import Quip from './modules/quips';
import ga from './modules/googleAnalytics';
// import showWidthInEms from './modules/showWidthInEms';

// showWidthInEms(window);


window.addEventListener('load', () => {
  const colorState = new ColorState({ deltaRatio: 2 / 5, window, document });
  const quip = new Quip();

  const header = document.querySelector("[itemtype='https://schema.org/WPHeader']");

  colorState.init();

  setTimeout(() => {
    header.classList.add('welcome-animation');
  }, 500);

  header.querySelector('svg').addEventListener('animationend', () => {
    quip.tellQuipAt(header);
    colorState.updateLayoutData();
    header.classList.add('endstate-animation');
    header.classList.remove('welcome-animation');
  });
});

ga('UA-1030009-5');
