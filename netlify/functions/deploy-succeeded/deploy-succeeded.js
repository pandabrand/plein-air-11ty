const axios = require('axios')
const indexing = require('algolia-indexing');
const algCredentials = {
  appId: process.env.ALG_APP_ID,
  apiKey: process.env.ALG_ADMIN_KEY,
  indexName: 'plein-air-index'
};

const handler = async function () {
  try {
    const response = await axios({
      url: 'https://pleinairarchive.com/search-index.json',
      method: 'get',
      headers: { Accept: 'application/json' },
    })

    // const response = await fetch('https://pleinairarchive.com/search-index.json', {
    //   headers: { Accept: 'application/json' },
    // })
    if (!response.status >= 200 && !response.status < 300) {
      // NOT res.status >= 200 && res.status < 300
      return { statusCode: response.status, body: response.statusText }
    }
    const data = await response.data

    indexing.verbose();

    const settings = {};

    try {
      await indexing.fullAtomic(algCredentials, data, settings);
    } catch (e) {
      console.error('error in fullAtomic', e);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ msg: 'Atomic Indexed!' }),
    }
  } catch (error) {
    // output to netlify function log
    console.log(error)
    return {
      statusCode: 500,
      // Could be a custom message or object i.e. JSON.stringify(err)
      body: JSON.stringify({ msg: error.message }),
    }
  }
}

module.exports = { handler }
