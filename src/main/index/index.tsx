import { Outlet } from "react-router-dom";
import styles from './index.module.scss';
import Bg from '@/components/Bg';
import Header from '../header';

function App() {

    return (
        <Bg>
            <div className={styles.app}>
                <Header />
                <div>
                    <Outlet />
                </div>
            </div>
        </Bg>
    )
}

export default App
