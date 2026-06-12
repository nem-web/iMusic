const https = require('https');

const urls = [
  'https://saavn.dev/api/search/songs?query=punjabi',
  'https://saavn.me/search/songs?query=punjabi',
  'https://jiosaavn-api-privatecvc2.vercel.app/search/songs?query=punjabi',
  'https://saavn-api.vercel.app/search/songs?query=punjabi',
  'https://jiosaavn-api-v3.vercel.app/api/search/songs?query=punjabi',
  'https://jiosaavn-api-ts.vercel.app/api/search/songs?query=punjabi',
  'https://saavn-api-sumit.vercel.app/api/search/songs?query=punjabi'
];

urls.forEach(url => {
  https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        console.log(`[SUCCESS] ${url} - Status: ${res.statusCode} - Data length: ${JSON.stringify(parsed).length}`);
      } catch(e) {
        console.log(`[FAIL-PARSE] ${url} - Status: ${res.statusCode}`);
      }
    });
  }).on('error', err => {
    console.log(`[ERROR] ${url} - ${err.message}`);
  });
});
