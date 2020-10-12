import ClassName from 'models/classname';
import { postPathBySlug, sanitizeExcerpt } from 'lib/posts';

import Metadata from 'components/Metadata';

import styles from './PostCard.module.scss';

const PostCard = ({ post }) => {
  const { id, title, excerpt, slug, date } = post;

  return (
    <div className={styles.postCard}>
      <a href={postPathBySlug(slug)}>
        <h3
          className={styles.postCardTitle}
          dangerouslySetInnerHTML={{
            __html: title,
          }}
        />
        <Metadata className={styles.postCardMetadata} date={date} />
        {excerpt && (
          <div
            className={styles.postCardContent}
            dangerouslySetInnerHTML={{
              __html: sanitizeExcerpt(excerpt),
            }}
          />
        )}
      </a>
    </div>
  );
};

export default PostCard;
