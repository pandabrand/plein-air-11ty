const { request, gql } = require('graphql-request');

module.exports = async function() {
  const pageQuery = gql`
      query statementQuery($uri: String!) {
        pageBy(uri: $uri) {
          content(format: RENDERED)
        }
      }
  `;

  const variables = { uri: 'artist-statement' };
  const endpoint = process.env.GRAPHQL_URL;

  try {
    const data = await request(endpoint, pageQuery, variables);

    return data.pageBy.content;

  } catch (error) {
    throw new Error( error );
  }
}
