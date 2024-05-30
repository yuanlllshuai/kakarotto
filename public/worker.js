self.onmessage = (e) => {
    console.log('compute web worker', e.data);
    postMessage([{ a: 2 }]);
};