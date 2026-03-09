const https = require('https');

const url = 'https://source.unsplash.com/bfOQSDwEFg4/1200x800';

https.get(url, (res) => {
  console.log('status', res.statusCode);
  console.log('content-type', res.headers['content-type']);
  console.log('final url', res.responseUrl || res.headers.location || url);
  res.resume();
}).on('error', (e) => {
  console.error('ERROR', e.message);
});
