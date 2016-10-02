const googleAnalytics = (trackingID) => {
  window.ga = window.ga || function ga(...args) {
    (window.ga.q = window.ga.q || []).push(args);
  };
  window.ga.l = +new Date;

  window.ga('create', trackingID, 'auto');
  window.ga('send', 'pageview');
};

export default googleAnalytics;
