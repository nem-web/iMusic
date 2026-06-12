const https = require('https');

const testQuery = (query) => {
  return new Promise((resolve) => {
    https.get(`https://saavn-api.vercel.app/search/songs?query=${query}`, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const parsed = JSON.parse(data);
        const titles = parsed.map(s => s.title);
        resolve(titles);
      });
    });
  });
};

async function run() {
  const p = await testQuery('punjabi');
  const a = await testQuery('arijit');
  console.log('Punjabi:', p.slice(0, 3));
  console.log('Arijit:', a.slice(0, 3));
}
run();
