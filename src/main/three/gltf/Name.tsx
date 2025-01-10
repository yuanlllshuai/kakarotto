import { Html } from '@react-three/drei';
import style from './style.module.css';

const PointLabel = () => {

  return (
    <>
      <Html
        position={[-4, 0, 10]}
        rotation-y={-Math.PI / 8}
        transform={true}
        style={{}}
        className={style.reflect}
      >
        <div>河南省</div>
        <div style={{fontSize:16}}>HENANSHENG</div>
      </Html>
    </>
  );
};

export default PointLabel;