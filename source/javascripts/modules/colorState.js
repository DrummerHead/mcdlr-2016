import { throttle } from 'lodash';

const getArticlesPositions = () => Array.from(document.querySelectorAll('article'))
  .map(article =>
    ({
      id: article.id,
      offset: article.offsetTop,
      color: article.dataset.color,
    })
  )
  .concat({
    id: 'bung',
    offset: document.body.scrollHeight,
    color: '#fff',
  });

const isScrollingOnTheArticle = (i, articles, delta, windowOffset, lastArticle) =>
  articles[i].offset - delta < windowOffset &&
  windowOffset < articles[i + 1].offset - delta &&
  lastArticle !== articles[i].id;

const colorState = () => {
  const articles = getArticlesPositions();
  const delta = Math.floor(window.innerHeight * (3 / 7));
  const body = document.body;
  let lastArticle;

  for (const article of articles) {
    const h2 = document.querySelector(`#${article.id} h2`);
    if (h2) {
      h2.setAttribute('style', `background-color: ${article.color}`);
    }
  }

  window.addEventListener('scroll', throttle(() => {
    const windowOffset = window.scrollY;
    for (const [i, article] of articles.entries()) {
      if (isScrollingOnTheArticle(i, articles, delta, windowOffset, lastArticle)) {
        lastArticle = article.id;
        console.log(`article.id: ${article.id}`);
        body.setAttribute('style', `background-color: ${article.color}`);
        break;
      }
    }
  }, 500, { leading: false, trailing: true }));
};

export default colorState;
