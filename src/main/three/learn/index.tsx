import { useRef } from 'react';
import { Box } from '@/utils/threes';
import { useResize } from '@/utils/hooks';
import styles from './index.module.scss';

const Index = () => {
    const domRef = useRef<any>(null);
    const lineRef = useRef<any>(null);

    const load = (size: any) => {
        lineRef.current = new Box({ id: 'threeBox', size, axesHelper: true, light: true });
        lineRef.current.start({ animateHandle });
    };

    const animateHandle = (time: number, ins: any) => {
        time *= 0.001;
        ins.cube.rotation.x = time;
        ins.cube.rotation.y = time;
    }

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