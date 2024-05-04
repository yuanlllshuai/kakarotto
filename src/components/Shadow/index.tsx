import { FC, ReactNode } from 'react';
import classNames from 'classnames'
import styles from './index.module.scss';

type IndexProps = {
    classname?: string,
    children?: ReactNode
}

const Index: FC<IndexProps> = ({ children, classname }) => {
    return (
        <div className={classNames(styles.shadow, classname)}>
            {children}
        </div>
    )
}

export default Index;