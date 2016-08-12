import throttle from 'lodash/throttle';

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

const changeColor = (articles, delta, lastArticle) => {
  const windowOffset = window.scrollY;
  for (const [i, article] of articles.entries()) {
    if (isScrollingOnTheArticle(i, articles, delta, windowOffset, lastArticle)) {
      lastArticle = article.id;
      console.log(`article.id: ${article.id}`);
      document.body.setAttribute('style', `background-color: ${article.color}`);
      break;
    }
  }
};

const colorState = () => {
  const articles = getArticlesPositions();
  const delta = Math.floor(window.innerHeight * (3 / 7));
  let lastArticle;

  // TODO: remove this for statement after done developing
  for (const article of articles) {
    const h2 = document.querySelector(`#${article.id} h2`);
    if (h2) {
      h2.setAttribute('style', `background-color: ${article.color}`);
    }
  }

  changeColor(articles, delta, lastArticle);

  window.addEventListener(
    'scroll',
    throttle(
      changeColor
        .bind(null, articles, delta, lastArticle),
      500,
      {
        leading: false,
        trailing: true,
      }
    )
  );
};

export default colorState;
