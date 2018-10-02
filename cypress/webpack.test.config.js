const config = require("../build/webpack.config.js");
const root = require("../build/helpers").root;
config.target = "node";
// delete config.output;
config.output = {
  path: root("cypress/integration"),
  filename: "unit.built.test.js"
};
// delete config.plugins;
module.exports = config;
