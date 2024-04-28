import styles from './App.module.scss';
import Bg from './components/bg';

function App() {

  return (
    <Bg>
      <div className={styles.app}>
        <h1>Kakarotto</h1>
      </div>
    </Bg>
  )
}

export default App
