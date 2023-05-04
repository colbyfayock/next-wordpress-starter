import Link from 'next/link';

import ClassName from 'models/classname';

import styles from './Breadcrumbs.module.scss';

const Breadcrumbs = ({ className, breadcrumbs }) => {
  const breadcrumbsClassName = new ClassName(styles.breadcrumbs);

  breadcrumbsClassName.addIf(className, className);

  return (
    <ul className={breadcrumbsClassName.toString()}>
      {breadcrumbs.map(({ id, title, uri }) => {
        return (
          <li key={id}>
            {!uri && title}
            {uri && <Link href={uri}>{title}</Link>}
          </li>
        );
      })}
    </ul>
  );
};

export default Breadcrumbs;
