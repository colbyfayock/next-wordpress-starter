import ClassName from 'models/classname';

import Image from 'components/Image';

import styles from './FeaturedImage.module.scss';

const FeaturedImage = ({ className, ...rest }) => {
  const featuredImageClassName = new ClassName(styles.featuredImage);

  featuredImageClassName.addIf(className, className);

  return <Image className={featuredImageClassName} {...rest} />;
};

export default FeaturedImage;
