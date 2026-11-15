import ClassName from 'models/classname';

import styles from './Section.module.css';

const Section = ({ children, className, ...rest }) => {
  const sectionClassName = new ClassName(styles.section);

  sectionClassName.addIf(className, className);

  return (
    <section className={sectionClassName.toString()} {...rest}>
      {children}
    </section>
  );
};

export default Section;
