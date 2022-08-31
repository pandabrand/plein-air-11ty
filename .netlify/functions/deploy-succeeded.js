const algoliasearch = require("algoliasearch");
const dotenv = require("dotenv");
const axios = require('axios')

dotenv.config();

const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID;
const ALGOLIA_API_KEY = process.env.ALGOLIA_API_KEY;
const ALGOLIA_INDEX_NAME = process.env.ALGOLIA_INDEX_NAME;
// Start the API client
// https://www.algolia.com/doc/api-client/getting-started/instantiate-client-index/
const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);

// Create an index (or connect to it, if an index with the name `ALGOLIA_INDEX_NAME` already exists)
// https://www.algolia.com/doc/api-client/getting-started/instantiate-client-index/#initialize-an-index
const index = client.initIndex(ALGOLIA_INDEX_NAME);

// Add new objects to the index
// https://www.algolia.com/doc/api-reference/api-methods/add-objects/
axios.get('./search-index.json')
    .then((response) => {
        index
          .saveObjects(response)
          // Wait for the indexing task to complete
          // https://www.algolia.com/doc/api-reference/api-methods/wait-task/
          .wait()
          .then((response) => {
            console.log(response);
            // Search the index for "Fo"
            // https://www.algolia.com/doc/api-reference/api-methods/search/
            index.search("Fo").then((objects) => console.log(objects)).catch();
          }) ;
    })
