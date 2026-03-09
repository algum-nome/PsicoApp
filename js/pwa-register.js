if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('PWA funcionando');
      })
      .catch(error => {
        console.log('Erro no PWA:', error);
      });
  });
}