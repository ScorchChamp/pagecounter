// Server API server where it only returns the amount of times the endpoint has been called

const express = require('express');
const app = express();
const fs = require('fs');

app.get('/counter', (req, res) => {
    const username = req.query.username;
    if (username == null) {
        res.send("No ''username'' provided");
    } else {
        const data = fs.readFileSync('counter.json');
        const counter = JSON.parse(data);
        if (counter[username] == null) {
            counter[username] = 0;
        }
        counter[username] += 1;
        fs.writeFileSync('counter.json', JSON.stringify(counter));
        res.send(counter[username].toString());
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));