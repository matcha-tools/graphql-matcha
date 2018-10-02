import * as _ from "lodash";

export function stringifyWrappers(wrappers: Array<any>): Array<any> {
  return _.reduce(
    wrappers.reverse(),
    ([left, right], wrapper) => {
      switch (wrapper) {
        case "NON_NULL":
          return [left, right + "!"];
        case "LIST":
          return ["[" + left, right + "]"];
        default:
          return [];
      }
    },
    ["", ""]
  );
}
export function getNameFromFieldId(fieldId: string): string {
  return fieldId.slice(fieldId.lastIndexOf("::") + 2);
}
export function buildId(...parts: Array<any>): string {
  return parts.join("::");
}

export function typeNameToId(name: string): string {
  return buildId("TYPE", name);
}

export function extractTypeId(id: string): string {
  let [, type] = id.split("::");
  return buildId("TYPE", type);
}

export function isSystemType(type: any): boolean {
  return _.startsWith(type.name, "__");
}

export function isBuiltInScalarType(type: any): boolean {
  return ["Int", "Float", "String", "Boolean", "ID"].indexOf(type.name) !== -1;
}

export function isScalarType(type: any): boolean {
  return type.kind === "SCALAR" || type.kind === "ENUM";
}

export function isObjectType(type: any): boolean {
  return type.kind === "OBJECT";
}

export function isInputObjectType(type: any): boolean {
  return type.kind === "INPUT_OBJECT";
}
