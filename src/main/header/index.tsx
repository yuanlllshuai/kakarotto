import { useNavigate } from "react-router-dom";
import Avatar from "@/components/Avatar";
import Shadow from "@/components/Shadow";
import Tree from "@/components/Tree";

import { navConfig } from "@/const";

import styles from "./index.module.scss";

const Index = () => {
  const navigate = useNavigate();
  const toSetting = () => {
    navigate("/settings");
  };

  const renderAvatar = () => {
    return (
      <div className={styles.avatar} onClick={toSetting}>
        <Avatar />
      </div>
    );
  };
  const renderNavLink = () => {
    return (
      <div className={styles.side_bar}>
        <Shadow classname={styles.side_bar_main}>
          {renderAvatar()}
          <Tree data={navConfig} />
        </Shadow>
      </div>
    );
  };
  return <>{renderNavLink()}</>;
};

export default Index;
