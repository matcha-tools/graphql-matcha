//TODO readability
import { forEachRight } from 'lodash';

export function parseQueryArray(queryArray) {
  if(queryArray.length === 0) return;
  let queryString = "";
  let newQueryArray;
  const wrap = (string) => "{" + string + "}";
  if (Array.isArray(queryArray[queryArray.length - 1])){
    (queryArray[queryArray.length - 1].length === 0) ? (queryString = wrap("id")) : (queryString = wrap(queryArray[queryArray.length - 1].join(" ")));
    newQueryArray = queryArray.slice(0, queryArray.length -1);
  } else {
   queryString = "{FIELDS}";
   newQueryArray = queryArray; 
  }
  forEachRight(newQueryArray, (current) => {
    (Array.isArray(current)) ? (queryString = wrap(current.join(" ") + queryString)) : (queryString = wrap(current + queryString));
  });
  return queryString;
}
