import { useRef } from 'react';
import { Line } from '@/utils/threes';
import { useResize } from '@/utils/hooks';
import styles from './index.module.scss';

const Index = () => {
    const domRef = useRef<any>(null);
    const lineRef = useRef<any>(null);

    const load = (size: any) => {
        lineRef.current = new Line({ id: 'threeLine', size, axesHelper: true });
        lineRef.current.render();
    };

    useResize({
        once: true,
        container: domRef,
        cb: load
    });

    return (
        <>
            <div id="threeLine" className={styles.container} ref={domRef}></div>
        </>
    )
}

export default Index;