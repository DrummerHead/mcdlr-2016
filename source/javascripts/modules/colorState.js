const getRandomColor = () => {
  return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
};

const getArticlesPositions = () => {
  return Array.from(document.querySelectorAll('article'))
    .map((article) => {
      return {
        id: article.id,
        offset: article.offsetTop,
        color: getRandomColor()
      };
    })
    .concat(
      {
        id: 'bung',
        offset: document.body.scrollHeight,
        color: getRandomColor()
      }
    )
};

const colorState = () => {
  const articles = getArticlesPositions();
  const delta = Math.floor(window.innerHeight * (3/7));
  const body = document.body;
  let lastArticle;

  for(const article of articles){
    const h2 = document.querySelector(`#${article.id} h2`);
    h2 && h2.setAttribute('style', `background-color: ${article.color}`);
  }

  window.addEventListener('scroll', (event) => {
    const windowOffset = window.scrollY;
    for(const [i, article] of articles.entries()){
      if(articles[i].offset - delta < windowOffset && windowOffset < articles[i+1].offset - delta && lastArticle !== article.id){
        lastArticle = article.id;
        console.log('article.id: ' + article.id);
        body.setAttribute('style', `background-color: ${article.color}`);
        break;
      }
    }
  });
};

export default colorState;

