const fetch = require('node-fetch');

exports.handler = async function (event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': '*'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const targetUrl = event.queryStringParameters ? event.queryStringParameters.url : null;
  if (!targetUrl) {
    return { statusCode: 400, headers, body: 'URL Required' };
  }

  try {
    const fetchOptions = {
      method: event.httpMethod,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://rtmklik.rtm.gov.my/',
        'Origin': 'https://rtmklik.rtm.gov.my/'
      }
    };

    const response = await fetch(targetUrl, fetchOptions);
    const buffer = await response.buffer();

    return {
      statusCode: response.status,
      headers: {
        ...headers,
        'Content-Type': response.headers.get('content-type') || 'application/x-mpegURL'
      },
      body: buffer.toString('base64'),
      isBase64Encoded: true
    };
  } catch (error) {
    return { statusCode: 500, headers, body: error.message };
  }
};
