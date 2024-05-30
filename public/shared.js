var clients = [];
self.onconnect = function (e) {
    var port = e.ports[0];
    clients.push(port);
    port.addEventListener('message', function (e) {
        for (var i = 0; i < clients.length; i++) {
            var eElement = clients[i];
            eElement.postMessage('end1 data')
        }
    });
    port.start();
}