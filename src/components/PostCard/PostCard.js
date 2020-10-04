import ClassName from 'models/classname';
import { sanitizeExcerpt } from 'lib/posts';

import Metadata from 'components/Metadata';

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
        <Metadata className={styles.postCardMetadata} date={date} />
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
