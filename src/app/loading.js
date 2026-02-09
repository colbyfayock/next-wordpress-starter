import styles from '@/styles/pages/Loading.module.scss';

export default function Loading() {
  return (
    <div className={styles.loading}>
      <div className={styles.skeletonHeader} />
      <div className={styles.skeletonContent}>
        <div className={styles.skeletonTitle} />
        <div className={styles.skeletonCards}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={styles.skeletonCard}>
              <div className={styles.skeletonCardTitle} />
              <div className={styles.skeletonCardMeta} />
              <div className={styles.skeletonCardExcerpt} />
              <div className={styles.skeletonCardExcerpt} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
