import Head from 'next/head'
import { gql, useQuery } from '@apollo/client'
import links from '../data/links'

const AllLinksQuery = gql`
  query {
    links(first: 10) {
      edges {
        node {
          id
          title
          url
          description
          imageUrl
          category
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`

export default function Home() {
  let { data, loading, error } = useQuery(AllLinksQuery)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Oh no... {error.message}</p>
  if (!data && !data.links)  {
    data = { links: {edges: links}}
  }

  return (
    <div>
      <Head>
        <title>Awesome Links</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container mx-auto max-w-5xl my-20">
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.links.edges.map(({node: link}) => (
            <li key={link.id} className="shadow  max-w-md  rounded">
              <div className="p-5 flex flex-col space-y-2">
                <p className="text-sm text-blue-500">{link.category}</p>
                <p className="text-lg font-medium">{link.title}</p>
                <p className="text-gray-600">{link.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
