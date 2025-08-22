import avatarImg from "../../assets/avatar.png";
import styles from "./index.module.scss";

const Index = () => {
  return (
    <>
      <img src={avatarImg} className={styles.img} />
    </>
  );
};

export default Index;
