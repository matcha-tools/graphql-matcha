//TODO adds an extra
import { forEachRight, isEmpty, last as lastElementOf } from "lodash";
import { format } from "prettier";

export function parseQueryArray(queryArray: Array<any>) {
  if (queryArray.length === 0) return;
  let queryString = "";
  let newQueryArray = queryArray.slice();

  if (lastElementIsArray(queryArray)) {
    queryString = isEmpty(lastElementOf(queryArray))
      ? wrapWithBraces("...fields")
      : wrapWithBraces(lastElementOf(queryArray).join(" "));
    newQueryArray.pop();
  } else {
    queryString = "{...fields}";
  }
  forEachRight(newQueryArray, element => {
    queryString = Array.isArray(element)
      ? wrapWithBraces(element.join(" ") + queryString)
      : wrapWithBraces(element + queryString);
  });

  const formattedQstr = format(queryString, { parser: "graphql" });
  return formattedQstr;
}

function wrapWithBraces(string: string) {
  return `{${string}}`;
}

function lastElementIsArray(array: Array<any>) {
  return Array.isArray(lastElementOf(array));
}
