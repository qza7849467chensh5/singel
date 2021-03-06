// @flow
import { all as cssProps } from "known-css-properties";
import voidElements from "void-elements";
import { spy } from "sinon";
import { camelCase, intersection, difference } from "lodash";
import {
  getElementProps,
  getEventProps,
  getGlobalProps
} from "react-known-props";

const reducer = (acc, key) => ({ ...acc, [key]: key });

export const findHTMLTags = (wrapper: Object): Object =>
  wrapper.findWhere(el => typeof el.type() === "string");

export const findHTMLTag = (wrapper: Object): Object =>
  findHTMLTags(wrapper).first();

export const getHTMLTag = (wrapper: Object): string | void => {
  const tag = findHTMLTag(wrapper);
  return tag.length ? tag.type() : undefined;
};

export const getStyleProps = (): Object =>
  cssProps
    .filter(prop => !/^-/.test(prop))
    .map(camelCase)
    .reduce(reducer, {});

export const getReactProps = (type?: string): Object => {
  const excludeProps = ["style", "className", "dangerouslySetInnerHTML"];
  const excludePropsRegex = new RegExp(`^${excludeProps.join("|")}$`);
  const props = type ? getElementProps(type) : getGlobalProps();

  return props
    .filter(prop => !excludePropsRegex.test(prop))
    .reduce(reducer, {});
};

export const getReactEventHandlers = (): Object =>
  getEventProps().reduce((acc, key) => ({ ...acc, [key]: spy() }), {});

export const getEventName = (prop: string = ""): string => {
  const eventName = prop.replace(/^on/, "");
  return eventName.charAt(0).toLowerCase() + eventName.slice(1);
};

export const isVoidElement = (wrapper: Object): boolean =>
  !!voidElements[getHTMLTag(wrapper)];

export const getMissingClassName = (
  originalClassName: string = "",
  renderedClassName: string = ""
): string => {
  const originalArray = originalClassName.split(" ");
  const renderedArray = renderedClassName.split(" ");
  const intersectionArray = intersection(originalArray, renderedArray);
  const differenceArray = difference(originalArray, intersectionArray);
  return differenceArray.filter(c => c !== "undefined").join(" ");
};
