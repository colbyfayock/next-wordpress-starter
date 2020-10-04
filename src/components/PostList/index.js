import { gql, useQuery, NetworkStatus } from '@apollo/client';
import path from 'path';
import useSite from 'hooks/use-site';
import Link from 'next/link';
export const ALL_POSTS_QUERY = gql`
  query allPosts {
    posts(first: 100) {
      nodes {
        title
        uri
        date
        excerpt
      }
    }
  }
`;

export default function PostList() {
  const { homepage } = useSite();

  const { loading, error, data, networkStatus } = useQuery(ALL_POSTS_QUERY, {
    // Setting this value to true will make the component rerender when
    // the "networkStatus" changes, so we are able to know if it is fetching
    // more data
    notifyOnNetworkStatusChange: true,
  });

  if (error) return <div>Error loading posts.</div>;
  if (loading) return <div>Loading</div>;

  const {
    posts: { nodes },
  } = data;

  return (
    <section>
      <ul>
        {nodes.map((post, index) => (
          <li key={`post.id-${index}`}>
            <div>
              <span>{index + 1}. </span>
              <Link href={`/postsql${post.uri}`}>{post.title}</Link>
            </div>
          </li>
        ))}
      </ul>
      <style jsx>{`
        section {
          padding-bottom: 20px;
        }
        li {
          display: block;
          margin-bottom: 10px;
        }
        div {
          align-items: center;
          display: flex;
        }
        a {
          font-size: 14px;
          margin-right: 10px;
          text-decoration: none;
          padding-bottom: 0;
          border: 0;
        }
        span {
          font-size: 14px;
          margin-right: 5px;
        }
        ul {
          margin: 0;
          padding: 0;
        }
        button:before {
          align-self: center;
          border-style: solid;
          border-width: 6px 4px 0 4px;
          border-color: #ffffff transparent transparent transparent;
          content: '';
          height: 0;
          margin-right: 5px;
          width: 0;
        }
      `}</style>
    </section>
  );
}
