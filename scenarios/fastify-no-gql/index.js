const fastify = require('fastify')();

fastify.post('/graphql', async () => {
    return {"data":{"hello":{"value":"world"}}};
});

fastify.listen(4000).then(() => {
    const { address, port } = fastify.server.address();
    console.log(`Server running at: http://${address}:${port}`);
}).catch(err => {
    console.error(err);
    process.exit();
});