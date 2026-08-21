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
    return { statusCode: 400, headers, body: 'URL parameter required.' };
  }

  try {
    const fetchOptions = {
      method: event.httpMethod,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
        'Referer': 'https://www.visionplus.id/'
      }
    };

    if (event.httpMethod === 'POST' && event.body) {
      fetchOptions.body = event.isBase64Encoded 
        ? Buffer.from(event.body, 'base64') 
        : event.body;
    }

    const response = await fetch(targetUrl, fetchOptions);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return {
      statusCode: response.status,
      headers: {
        ...headers,
        'Content-Type': response.headers.get('content-type') || 'text/plain'
      },
      body: buffer.toString('base64'),
      isBase64Encoded: true
    };
  } catch (error) {
    return { statusCode: 500, headers, body: error.message };
  }
};
