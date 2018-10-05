import { isEmpty, last as lastElementOf, map } from "lodash";
import {getNameFromFieldId} from "../components/visualizer/introspection/utils"


export function parseQueryStack(queryArray: Array<any>): string {
  if (queryArray.length === 0) return '';
  let newQueryArray = appendFragmentIfNoFields(queryArray.slice())
  let queryStr = braceLastElementOf(newQueryArray);
  queryStr = braceRemainingElements(newQueryArray, queryStr);
  
  //TODO use prettier for production, not dev
  // const prettier = require("prettier/standalone");
  // const plugins = [require("prettier/parser-graphql")];
  // const formattedQstr = prettier.format(queryString, { parser: "graphql", plugins });
  return queryStr;
}

function appendFragmentIfNoFields(queryArray: Array<any>): Array<any>{
  const lastEle = lastElementOf(queryArray);
  if (isEmpty(lastEle))
    queryArray[queryArray.length-1] = '...fields';
  else if (typeof lastEle === 'string') {
    queryArray.push('...fields');
  }
  return queryArray;
}

function brace(string: string) {
  return `{${string}}`;
}

function braceLastElementOf(array: Array<any>): string{
  const lastEle = lastElementOf(array);
  let result = '';
  if (areFields(lastEle)){
    const fieldNames = map(lastEle,getNameFromFieldId);
    result = brace(fieldNames.join(" "));
  }
  else
    result = brace(lastEle);
  return result;
}

const areFields = Array.isArray;

function braceRemainingElements(array:Array<any>, queryStr:string): string {
  const secondToLastIdx = array.length - 2;
  for (let i = secondToLastIdx; i >=0; i--) {
    let element = array[i];
    let nextEle = array[i-1];
    let fields = [];
    queryStr = areFields(element)
    ? (fields = map(element, getNameFromFieldId), brace(fields.join(" ") + queryStr))
    : !areFields(nextEle)
      ? brace(element + queryStr)
      : ' ' + element + queryStr;
  }
  return queryStr;
}


