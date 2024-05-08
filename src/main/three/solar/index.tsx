import { useRef } from 'react';
import { SolarSystem } from '@/utils/threes';
import { useResize } from '@/utils/hooks';
import styles from './index.module.scss';

const Index = () => {
    const domRef = useRef<any>(null);
    const lineRef = useRef<any>(null);

    const load = (size: any) => {
        lineRef.current = new SolarSystem({ id: 'threeSolar', size, axesHelper: true });
        lineRef.current.start({ animateHandle });
    };

    const animateHandle = (time: number, ins: any) => {
        time *= 0.001;
        ins.objects.forEach((i: any) => {
            i.rotation.y = time;
        });
    }

    useResize({
        once: true,
        container: domRef,
        cb: load
    });

    return (
        <>
            <canvas id="threeSolar" className={styles.container} ref={domRef} />
        </>
    )
}

export default Index;