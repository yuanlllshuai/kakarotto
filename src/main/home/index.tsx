import { useEffect } from 'react';
// import { Box, Line } from '@/utils/threes';
import GitHubCalendar from 'react-github-calendar';
// import axios from 'axios';
import styles from './index.module.scss';

const Index = () => {
    // const boxRef = useRef<any>(null);
    // const lineRef = useRef<any>(null);

    useEffect(() => {
        // axios.get('/api/v1/user/getChannel')
        //     .then(response => {
        //         console.log(response.data);
        //     })
        //     .catch(error => {
        //         console.error(error);
        //     });
    }, [])

    // useEffect(() => {
    //     boxRef.current = new Box({ id: 'threeBox' });
    //     // lineRef.current = new Line({ id: 'threeLine' });
    //     // animate(boxRef.current);
    //     boxRef.current.render();
    //     // lineRef.current.render();
    // }, []);

    // const animate = (ins: any) => {
    //     const cube = ins.getCube();
    //     cube.rotation.x += 0.01;
    //     cube.rotation.y += 0.01;
    //     requestAnimationFrame(() => animate(ins));
    //     ins.render();
    // }

    return (
        <>
            {/* <div id="threeBox"></div> */}
            {/* <div id="threeLine"></div> */}
            <div className={styles.github_calendar}>
                <div>
                    <div className={styles.github_calendar_title}>@yuanlllshuai on GitHub</div>
                    <GitHubCalendar username={'yuanlllshuai'} fontSize={14} />
                </div>
            </div>
        </>
    )
}

export default Index;