if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/service-worker.js')
            .then(function (registration) {
                console.log('Service Worker registrado com sucesso:', registration);
            })
            .catch(function (error) {
                console.log('Falha ao registrar o Service Worker:', error);
            });
    });
}
