import Link from 'next/link';

const NavListItem = ({ className, item }) => {
  const nestedItems = item.children?.map((item) => {
    return <NavListItem key={item.key} item={item} />;
  });

  return (
    <li>
      {!item.uri.startsWith('http') && !item.target && (
        <Link href={item.uri} title={item.title}>
          {item.title}
        </Link>
      )}

      {item.uri.startsWith('http') && (
        <a href={item.uri} title={item.title} target={item.target}>
          {item.title}
        </a>
      )}

      {nestedItems?.length > 0 && <ul className={className}>{nestedItems}</ul>}
    </li>
  );
};

export default NavListItem;
