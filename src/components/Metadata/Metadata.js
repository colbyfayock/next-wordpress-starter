import Link from 'next/link';
import { format } from 'date-fns';

import { categoryPathBySlug } from 'lib/categories';
import { authorPathBySlug } from 'lib/users';
import ClassName from 'models/classname';

import styles from './Metadata.module.scss';

const Metadata = ({ className, author, date, categories }) => {
  const metadataClassName = new ClassName(styles.metadata);

  metadataClassName.addIf(className, className);

  return (
    <ul className={metadataClassName.toString()}>
      {author && (
        <li className={styles.metadataAuthor}>
          <address>
            <img
              width={author.avatar.width}
              height={author.avatar.height}
              src={author.avatar.url}
              alt="Author Avatar"
            />
            By{' '}
            <Link href={authorPathBySlug(author.slug)}>
              <a rel="author">{author.name}</a>
            </Link>
          </address>
        </li>
      )}
      {date && (
        <li>
          <time pubdate="pubdate" dateTime={date}>
            {format(new Date(date), 'PPP')}
          </time>
        </li>
      )}
      {Array.isArray(categories) && (
        <li>
          <p title={categories.map(({ name }) => name).join(', ')}>
            <Link href={categoryPathBySlug(categories[0].slug)}>
              <a>{categories[0].name}</a>
            </Link>
            {categories.length > 1 && ' and more'}
          </p>
        </li>
      )}
    </ul>
  );
};

export default Metadata;
