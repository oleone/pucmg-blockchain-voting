const express = require('express');

const app = express();

app.get('/', function (req, res) {
    res.send({ ok: true }).status(200);
});

app.listen(8080, () => console.log(`Listening in port ${8080}`));