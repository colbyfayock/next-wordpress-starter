import styles from './Main.module.scss';

const Main = ({ children }) => {
  return <div className={styles.main}>{children}</div>;
};

export default Main;
