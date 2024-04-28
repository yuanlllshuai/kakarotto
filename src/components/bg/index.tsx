import { FC, ReactNode } from 'react';
import styles from './styles.module.scss';

type IndexProps = {
    children: ReactNode
};

const Index: FC<IndexProps> = ({ children }) => {
    return (
        <div className={styles.container}>
            <div className={styles.layer1}></div>
            <div className={styles.layer2}></div>
            <div className={styles.layer3}></div>
            <div className={styles.layer4}></div>
            <div className={styles.layer5}></div>
            {children}
        </div>
    )
}

export default Index;