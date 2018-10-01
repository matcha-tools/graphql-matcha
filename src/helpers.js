// /**
//  * This GraphiQL example illustrates how to use some of GraphiQL's props
//  * in order to enable reading and updating the URL parameters, making
//  * link sharing of queries a little bit easier.
//  *
//  * This is only one example of this kind of feature, GraphiQL exposes
//  * various React params to enable interesting integrations.
//  */

// Parse the search string to get url parameters.

const search = window.location.search;
export const parameters = {};
search
  .substr(1)
  .split("&")
  .forEach(function(entry) {
    var eq = entry.indexOf("=");
    if (eq >= 0) {
      parameters[decodeURIComponent(entry.slice(0, eq))] = decodeURIComponent(
        entry.slice(eq + 1)
      );
    }
  });

// if variables was provided, try to format it.
if (parameters.variables) {
  try {
    parameters.variables = JSON.stringify(
      JSON.parse(parameters.variables),
      null,
      2
    );
  } catch (e) {
    // Do nothing, we want to display the invalid JSON as a string, rather
    // than present an error.
  }
}

// When the query and variables string is edited, update the URL bar so
// that it can be easily shared
export function onEditQuery(newQuery) {
  parameters.query = newQuery;
  updateURL();
}

export function onEditVariables(newVariables) {
  parameters.variables = newVariables;
  updateURL();
}

export function onEditOperationName(newOperationName) {
  parameters.operationName = newOperationName;
  updateURL();
}

export function updateURL() {
  var newSearch =
    "?" +
    Object.keys(parameters)
      .filter(function(key) {
        return Boolean(parameters[key]);
      })
      .map(function(key) {
        return (
          encodeURIComponent(key) + "=" + encodeURIComponent(parameters[key])
        );
      })
      .join("&");
  history.replaceState(null, null, newSearch);
}

// Defines a GraphQL fetcher using the fetch API. You're not required to
// use fetch, and could instead implement graphQLFetcher however you like,
// as long as it returns a Promise or Observable.
export function graphQLFetcher(graphQLParams) {
  // This example expects a GraphQL server at the path /graphql.
  // Change this to point wherever you host your GraphQL server.
  return fetch("http://localhost:3000/graphql", {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(graphQLParams),
  })
    .then(function(response) {
      return response.text();
    })
    .then(function(responseBody) {
      try {
        return JSON.parse(responseBody);
      } catch (error) {
        return responseBody;
      }
    });
  }

  
 
