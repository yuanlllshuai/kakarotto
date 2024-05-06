import { useRef, useEffect } from 'react';

type Size = {
    width: number,
    height: number
}
type Ref = {
    current: Element
}
type IndexProps = {
    cb: (size: Size) => void,
    container: Ref,
    once?: boolean
}
const Index = ({ cb, container, once = false }: IndexProps) => {
    const init = useRef<boolean>(false);
    useEffect(() => {
        const resizeObserver = new ResizeObserver((entries: any) => {
            const { contentBoxSize } = entries[0] as any;
            const { blockSize, inlineSize } = contentBoxSize[0];
            if (once) {
                if (!init.current) {
                    cb({ width: inlineSize, height: blockSize });
                    init.current = true;
                    resizeObserver.disconnect();
                }
            } else {
                cb({ width: inlineSize, height: blockSize });
            }

        });
        resizeObserver.observe(container.current);
    }, []);
}

export default Index;