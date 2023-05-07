import Image from 'next/image';

import styles from './FeaturedImage.module.scss';

const FeaturedImage = ({ data, ...props }) => {
  let className = styles.featuredImage;

  if (props.className) {
    className = `${className} ${props.className}`;
  }

  return (
    <span className={className}>
      <Image
        width={data.mediaDetails.width}
        height={data.mediaDetails.height}
        alt={data.altText}
        src={data.sourceUrl}
        sizes={data.sizes}
        {...props}
      />
    </span>
  );
};

export default FeaturedImage;
