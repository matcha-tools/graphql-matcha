const express = require("express");
const graphqlHTTP = require('express-graphql');
const matcha = require('../build/express-matcha');
const cors = require("cors");
const PORT = 3003;

const schema = require("./schema/schema");
const app = express();

app.use(cors());

app.use('/graphql', graphqlHTTP(() => ({ schema, graphiql: false })));
app.use('/matcha', matcha({endpoint: '/graphql'}))

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});


