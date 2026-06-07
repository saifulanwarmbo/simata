const http = require('http');
const data = JSON.stringify({ title: 'test', unitKerja: 'test' });
const req = http.request('http://localhost:3000/api/generate/job-description', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
}, (res) => {
    let body = '';
    res.on('data', c => body += c);
    res.on('end', () => console.log(res.statusCode, body));
});
req.on('error', console.error);
req.write(data);
req.end();
