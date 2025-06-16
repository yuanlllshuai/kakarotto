import { FC, useEffect, useState, useRef } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import classNames from 'classnames';
import styles from './index.module.scss';
import Icon from '@/components/Icon';

type IndexProps = {
    data: any[]
}

const Index: FC<IndexProps> = ({ data }) => {

    const [routes, setRoutes] = useState<string[]>([]);
    const { pathname } = useLocation();
    const init = useRef<boolean>(false);

    useEffect(() => {
        if (!init.current) {
            const curr = data.find((i: any) => i.paths?.includes(pathname));
            if (curr) {
                setRoutes([curr.key])
            }
            init.current = true;
        }
    }, [pathname])

    const renderTree = (data: any, level: number, parentKey: string) => {
        const l = level + 1;
        return data.map((i: any) => {
            return (
                <>
                    {renderItem(i, l, routes.includes(parentKey) ? styles.item_node_active : styles.item_node)}
                    {
                        i.children && (
                            <div className={styles.children_container}>
                                {renderTree(i.children, l, i.key)}
                            </div>
                        )
                    }
                </>
            )
        })
    }

    const openHandle = (key: string) => {
        const newRoutes = [...routes];
        if (newRoutes.includes(key)) {
            const index = newRoutes.indexOf(key);
            newRoutes.splice(index, 1);
        } else {
            newRoutes.push(key);
        }
        setRoutes(newRoutes);
    }

    const renderItem = (item: any, level: number, nodeClassName: string) => {
        const { label, key } = item;
        const isLevel0 = level === 0;
        const haveChildren = !!item.children;
        const content = (
            <>
                <div className={styles.item_left}>
                    {item.icon && <Icon name={item.icon} size="18" />}
                    <span className={haveChildren || isLevel0 ? styles.title : ''}>{label}</span>
                </div>
                {
                    haveChildren && (
                        routes.includes(key) ? <Icon name='shangup' size="16" /> : <Icon name='xiadown' size="16" />
                    )
                }
            </>
        )
        // 一级节点没有子节点
        if (isLevel0 && !haveChildren) {
            return (
                <NavLink
                    to={item.path}
                    className={({ isActive }: any) => classNames(
                        styles.item,
                        styles.item_hover,
                        isActive && styles.item_active
                    )}
                >
                    {content}
                </NavLink>
            )
        }
        // 有子节点
        if (haveChildren) {
            return (
                <div
                    className={classNames(
                        styles.item,
                        styles.item_hover2,
                        item.paths?.includes(pathname) && styles.item_active2,
                    )}
                    onClick={() => openHandle(key)}
                >
                    {content}
                </div>
            )
        }
        // 叶子节点
        return (
            <div className={classNames(!isLevel0 && nodeClassName)}>
                <NavLink
                    to={item.path}
                    className={({ isActive }: any) => classNames(
                        styles.item,
                        styles.item_hover,
                        isActive && styles.item_active,
                    )}
                    style={{ height: '100%', padding: '0 16px' }}
                >
                    {content}
                </NavLink>
            </div>
        )
    }

    return (
        <div className={styles.main}>
            {renderTree(data, -1, '')}
        </div>
    )
}

export default Index;