import throttle from 'lodash/throttle';

class ColorState {

  constructor({ deltaRatio = 3 / 7, window, document }) {
    this.window = window;
    this.document = document;
    this.articles = [];
    this.lastArticle = null;
    this.deltaRatio = deltaRatio;
    this.delta = 0;
  }

  setArticlesPositions() {
    this.articles = Array.from(this.document.querySelectorAll('article'))
      .map(article =>
        ({
          id: article.id,
          offset: article.offsetTop,
          color: article.dataset.color,
        })
      )
      .concat({
        id: 'bung',
        offset: this.document.body.scrollHeight,
        color: '#fff',
      });
  }

  setDelta() {
    this.delta = Math.floor(this.window.innerHeight * this.deltaRatio);
  }

  isScrollingOnTheArticle(i, viewportYPosition) {
    return this.articles[i].offset - this.delta < viewportYPosition &&
      viewportYPosition < this.articles[i + 1].offset - this.delta &&
      this.lastArticle !== this.articles[i].id;
  }

  changeColor() {
    const viewportYPosition = this.window.scrollY;
    for (const [i, article] of this.articles.entries()) {
      if (this.isScrollingOnTheArticle(i, viewportYPosition)) {
        this.lastArticle = article.id;
        this.document.body.setAttribute('style', `background-color: ${article.color}`);
        break;
      }
    }
  }

  updateLayoutData() {
    this.setArticlesPositions();
    this.setDelta();
    this.changeColor();
  }

  init() {
    this.updateLayoutData();

    this.window.addEventListener(
      'scroll',
      throttle(
        this.changeColor
          .bind(this),
        512,
        {
          leading: false,
          trailing: true,
        }
      )
    );

    this.window.addEventListener(
      'resize',
      throttle(
        this.updateLayoutData
          .bind(this),
        512,
        {
          leading: false,
          trailing: true,
        }
      )
    );
  }

}


export default ColorState;
