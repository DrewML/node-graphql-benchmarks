const app = require('express')();

app.post('/graphql', (_, res) => {
    res.send({"data":{"hello":{"value":"world"}}});
});

app.listen(4000, () => {
    console.log(`Server running at: http://127.0.0.1:4000`);
});