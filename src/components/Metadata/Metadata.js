import { format } from 'date-fns';

import ClassName from 'models/classname';

import styles from './Metadata.module.scss';

const Metadata = ({ className, date }) => {
  const metadataClassName = new ClassName(styles.metadata);

  metadataClassName.addIf(className, className);

  return (
    <ul className={metadataClassName.toString()}>
      <time dateTime={date}>{format(new Date(date), 'PPP')}</time>
    </ul>
  );
};

export default Metadata;
