import styles from './Section.module.scss';

const Section = ({ children, ...props }) => {
  let className = styles.section;

  if (props.className) {
    className = `${className} ${props.className}`;
  }

  return <section className={className}>{children}</section>;
};

export default Section;
