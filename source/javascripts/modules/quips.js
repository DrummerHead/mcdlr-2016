import quipsContent from './quipsContent';

class Quips {
  constructor() {
    this.quips = quipsContent;
    this.length = this.quips.length;
  }

  randomQuip() {
    return this.quips[Math.floor(Math.random() * this.length)];
  }

  tellQuipAt(hostElement) {
    hostElement.insertAdjacentHTML('beforeend', `<div class='quip'>${this.randomQuip()}</div>`);
  }
}

export default Quips;
