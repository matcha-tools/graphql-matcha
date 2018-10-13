const express = require("express");
const graphqlHTTP = require('express-graphql');
const matcha = require('./express-matcha');
const cors = require("cors");
const PORT = 3000;

const schema = require("./schema/schema");
const app = express();

app.use(cors());

app.use('/graphql', graphqlHTTP(() => ({ schema, graphiql: false })));
app.use('/matcha', matcha())

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});


