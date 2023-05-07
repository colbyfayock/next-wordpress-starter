const JSONLD = ({ }) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({})
      }}
    />
  )
  ;
};

export default JSONLD;
