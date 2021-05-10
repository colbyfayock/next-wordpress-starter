import ClassName from 'models/classname';

import styles from './Content.module.scss';

const Content = ({ children, className }) => {
  const contentClassName = new ClassName(styles.content);

  contentClassName.addIf(className, className);

  return <div className={contentClassName.toString()}>{children}</div>;
};

export default Content;
