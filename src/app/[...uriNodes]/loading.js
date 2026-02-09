import styles from '@/styles/pages/Loading.module.scss';

export default function Loading() {
  return (
    <div className={styles.loading}>
      <div className={styles.skeletonHeader} />
      <div className={styles.skeletonContent}>
        <div className={styles.skeletonText} />
        <div className={styles.skeletonText} />
        <div className={styles.skeletonText} />
        <div className={styles.skeletonText} />
        <div className={styles.skeletonText} />
      </div>
    </div>
  );
}
