import { useEffect, useRef } from 'react'

const Index = () => {

    const broadcastChannel = useRef<any>(null);
    const webWorker = useRef<any>(null);
    const sharedWorker = useRef<any>(null);

    useEffect(() => {
        broadcastChannel.current = new BroadcastChannel('broadcast')
        broadcastChannel.current.onmessage = handleMessage

        webWorker.current = new Worker("worker.js");
        webWorker.current.onmessage = handleMessage;

        sharedWorker.current = new SharedWorker("shared.js");
        sharedWorker.current.port.start();
        sharedWorker.current.port.onmessage = handleMessage;
    });
    const sendMessage = (key: any) => {
        key.current.postMessage('start data')
    }
    const sendSharedMessage = (key: any) => {
        key.current.port.postMessage('start data')
    }
    const handleMessage = (event: any) => {
        console.log('接收到 data', event.data)
    }

    return (
        <>
            <button onClick={() => sendMessage(broadcastChannel)}>BroadcastChannel</button>
            <button onClick={() => sendMessage(webWorker)}>WebWorker</button>
            <button onClick={() => sendSharedMessage(sharedWorker)}>SharedWorker</button>
        </>
    )
}

export default Index;