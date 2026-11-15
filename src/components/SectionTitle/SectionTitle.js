import styles from './SectionTitle.module.css';

const SectionTitle = ({ children }) => {
  return <h2 className={styles.sectionTitle}>{children}</h2>;
};

export default SectionTitle;
