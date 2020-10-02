import { format } from 'date-fns';

import ClassName from 'models/classname';
import { sanitizeExcerpt } from 'lib/posts';

import styles from './PostCard.module.scss';

const PostCard = ({ post }) => {
  const { id, title, excerpt, slug, date } = post;

  return (
    <div className={styles.postCard}>
      <a href={`/posts/${slug}`}>
        <h3
          className={styles.postCardTitle}
          dangerouslySetInnerHTML={{
            __html: title?.rendered,
          }}
        />
        <ul className={styles.postCardMetadata}>
          <time dateTime={date}>{format(new Date(date), 'PPP')}</time>
        </ul>
        <div
          className={styles.postCardContent}
          dangerouslySetInnerHTML={{
            __html: excerpt && sanitizeExcerpt(excerpt.rendered),
          }}
        />
      </a>
    </div>
  );
};

export default PostCard;
