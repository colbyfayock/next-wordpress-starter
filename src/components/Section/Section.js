import Head from 'next/head';
import styles from './Section.module.scss';

const Section = ({ children }) => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>{ children }</div>
    </section>
  )
}

export default Section;