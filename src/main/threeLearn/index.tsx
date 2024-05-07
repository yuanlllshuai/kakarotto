import { useRef } from 'react';
import { Box } from '@/utils/threes';
import { useResize } from '@/utils/hooks';
import styles from './index.module.scss';

const Index = () => {
    const domRef = useRef<any>(null);
    const lineRef = useRef<any>(null);

    const load = (size: any) => {
        lineRef.current = new Box({ id: 'threeBox', size, axesHelper: true });
        lineRef.current.start({ animate: false });
    };

    useResize({
        once: true,
        container: domRef,
        cb: load
    });

    return (
        <>
            <canvas id="threeBox" className={styles.container} ref={domRef} />
        </>
    )
}

export default Index;