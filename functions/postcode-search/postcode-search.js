const fetch = require('node-fetch');

const { REACT_APP_GEONAMES_USER } = process.env;

exports.handler = async function(event, context) {
  const { country, city, zip } = event.queryStringParameters;
  const query = [
    `username=${REACT_APP_GEONAMES_USER}`,
    'style=SHORT',
    `country=${country}`,
    `placename_startsWith=${city}`,
    zip && `postalcode_startsWith=${zip}`,
  ]
    .filter(Boolean)
    .join('&');

  let endpoint = 'http://api.geonames.org/postalCodeSearchJSON?' + query;
  // TODO: Figure out why we're having to do this. I'm guessing it's an
  // issue with `netlify dev` and the `index.html` redirectin in `netlify.toml`
  endpoint = endpoint.replace(/\%2Fin(.+)$/, '');

  try {
    const response = await fetch(endpoint, {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      return { statusCode: response.status, body: response.statusText };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ data }),
    };
  } catch (error) {
    // output to netlify function log
    console.log(error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: { message: error.toString() } }),
    };
  }
};
