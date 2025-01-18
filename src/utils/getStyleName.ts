// import classNames from "classnames";

const basePrefix = "erc";
export default (prefix) => {
  return (classname = "") =>
    `${basePrefix}-${prefix}` + (classname ? `-${classname}` : "");
};
