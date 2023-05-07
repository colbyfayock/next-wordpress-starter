import ClassName from 'models/classname';

import styles from './Section.module.scss';

const Section = ({ children, ...props }) => {
  let className = styles.section;

  if ( props.className ) {
    className.concat(' ', props.className);
  }

  return (
    <section className={styles.section} {...props}>
      {children}
    </section>
  );
};

export default Section;
