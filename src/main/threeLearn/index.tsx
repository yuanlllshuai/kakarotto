import { useRef, useEffect } from 'react';
import { Line } from '@/utils/threes';
import styles from './index.module.scss';

const Index = () => {
    const domRef = useRef<any>(null);
    const lineRef = useRef<any>(null);
    const init = useRef<boolean>(false);

    useEffect(() => {
        const resizeObserver = new ResizeObserver((entries: any) => {
            if (!init.current) {
                const { contentBoxSize } = entries[0] as any;
                const { blockSize, inlineSize } = contentBoxSize[0];
                // console.log(blockSize, inlineSize);
                lineRef.current = new Line({ id: 'threeLine', size: { width: inlineSize, height: blockSize } });
                lineRef.current.render();
                init.current = true;
                resizeObserver.disconnect();
            }
        });
        resizeObserver.observe(domRef.current);
    }, []);

    return (
        <>
            <div id="threeLine" className={styles.container} ref={domRef}></div>
        </>
    )
}

export default Index;