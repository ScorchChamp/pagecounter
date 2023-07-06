// Server API server where it only returns the amount of times the endpoint has been called

const express = require('express');
const app = express();
const fs = require('fs');
const cors = require('cors');

const persistentStorage = process.argv[3];

if (persistentStorage == null) {
    console.log("No persistent storage provided");
    process.exit(1);
}
if (!fs.existsSync(persistentStorage)) {
    fs.writeFileSync(persistentStorage, JSON.stringify({}));
}


generateBasicSVG = (count) => {
    let scale = Math.max(60 + String(count).length*7);
    return `
        <svg xmlns="http://www.w3.org/2000/svg" width="${scale}" height="20">
            <rect width="100" height="20" fill="#555"/>
            <rect x="50" y="0" width="500" height="20" fill="#4c1"/>
            <path d="${scale} 0h4v20h-4z" fill="#4c1"/>
            <g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">
                <text x="25" y="15" fill="#010101" fill-opacity=".3">Visits</text>
                <text x="25" y="14">Visits</text>
                <text x="${(scale/2) + 25}" y="15" fill="#010101" fill-opacity=".3">${count}</text>
                <text x="${(scale/2) + 25}" y="14">${count}</text>
            </g>
        </svg>`
}


app.use(cors());    

app.get('/counter', (req, res) => {
    const username = req.query.username;
    if (username == null) return res.send("No ''username'' provided");
    const counter = JSON.parse(fs.readFileSync(persistentStorage));
    counter[username] = counter[username] == null ? 0 : counter[username] + 1;
    fs.writeFileSync(persistentStorage, JSON.stringify(counter));
    res.writeHead(200, {'Content-Type': 'image/svg+xml',
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
        'Vary': 'Accept-Encoding'});
    res.write(generateBasicSVG(counter[username]));
    res.end();
});

app.listen(3000, () => console.log('Server running on port 3000'));