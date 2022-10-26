const express = require('express');

const app = express();

const PORT = process.env.PORT || 80;

app.get('/', function (req, res) {
    res.send({ ok: true }).status(200);
});

app.listen(PORT, () => console.log(`Listening in port ${PORT}`));