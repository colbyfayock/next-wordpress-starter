const JSONLD = ({ data, metadata }) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'http://schema.org',
          ...data,
          publisher: {
            '@type': 'Organization',
            name: metadata.title,
            logo: {
              '@type': 'ImageObject',
              url: `${metadata.url}/icon.png`,
            },
          }
        })
      }}
    />
  )
  ;
};

export default JSONLD;
