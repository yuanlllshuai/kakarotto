import {
  Outlet,
  // Form,
  // useLoaderData,
  // useNavigation
} from "react-router-dom";
import styles from "./index.module.scss";
import Bg from "@/components/Bg";
import Header from "../header";

export const Component = () => {
  // const data: any = useLoaderData();
  // const navigation = useNavigation();

  // useEffect(() => {
  //     console.log('data', data)
  // }, [data])
  // useEffect(() => {
  //     console.log('navigation', navigation)
  // }, [navigation])

  return (
    <Bg>
      <div className={styles.app}>
        <Header />
        {/* <div style={{ border: '1px solid red' }}>
                    {navigation.state}
                </div>
                <Form method="post" action='/'>
                    <input
                        placeholder="First"
                        aria-label="First name"
                        type="text"
                        name="first"
                    />
                    <button type="submit">New</button>
                </Form> */}
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </Bg>
  );
};
