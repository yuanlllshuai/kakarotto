import styles from './App.module.scss';
import Bg from './components/Bg';
import Avatar from './components/Avatar';

function App() {

  return (
    <Bg>
      <div className={styles.app}>
        <Avatar />
      </div>
    </Bg>
  )
}

export default App
