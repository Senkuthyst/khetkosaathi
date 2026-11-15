const fs = require('fs');
const https = require('https');

const env = fs.readFileSync('.env', 'utf8');

function getVal(key) {
  const line = env.split(/\r?\n/).find(l => l.startsWith(key + '='));
  if (!line) return '';
  return line.split('=').slice(1).join('=').trim().replace(/^["']|["']$/g, '');
}

const user = getVal('NASA_EARTHDATA_USERNAME');
const pass = getVal('NASA_EARTHDATA_PASSWORD');

console.log('Username provided:', !!user, 'Password provided:', !!pass);

const auth = Buffer.from(user + ':' + pass).toString('base64');
const req = https.request('https://appeears.earthdatacloud.nasa.gov/api/login', {
  method: 'POST',
  headers: {
    'Authorization': 'Basic ' + auth,
    'Content-Length': '0'
  }
}, (res) => {
  console.log('AppEEARS login HTTP Status:', res.statusCode);
  let b = '';
  res.on('data', c => b += c);
  res.on('end', () => {
    try {
      const data = JSON.parse(b);
      console.log('AppEEARS Token success:', !!data.token, 'Expires:', data.expiration);
    } catch(e) {
      console.log('AppEEARS Response body:', b.slice(0, 200));
    }
  });
});

req.on('error', e => console.log('Req error:', e.message));
req.end();
