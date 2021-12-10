/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />
/// <reference types="styled-jsx" />

declare module "*.svg" {
  import * as React from "react";

  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & {title?: string}
  >;

  const src: string;
  export default src;
}
