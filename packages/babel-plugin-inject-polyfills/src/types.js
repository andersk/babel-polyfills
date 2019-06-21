// @flow

import type { NodePath } from "@babel/traverse";
import { types as t } from "@babel/core";

export type Options = {
  method: MethodString,
  providers: Array<string | [string] | [string, ProviderOptions]>,
  targets?: { browsers: string | string[], [target: string]: string | number },
  ignoreBrowserslistConfig?: boolean,
  configPath?: string,
};

export type ProviderOptions = {
  include?: string[],
  exclude?: string[],
};

export type PolyfillProvider<Opts: ProviderOptions = ProviderOptions> = (
  api: ProviderApi,
  options: Opts,
) => ProviderResult;

export type MethodString = "entry-global" | "usage-global" | "usage-pure";

export type Targets = {
  [target: string]: string,
};

export type ProviderApi = {|
  method: MethodString,
  targets: Targets,
  include: Set<string>,
  exclude: Set<string>,
  getUtils(path: NodePath): Utils,
  filterPolyfills(
    list: { [feature: string]: Targets },
    defaultIncludes?: Array<string>,
    defaultExcludes?: Array<string>,
  ): Set<string>,
  isPolyfillRequired(supportedEnvironments: Targets): boolean,
|};

export type Utils = {|
  injectGlobalImport(url: string): void,
  injectNamedImport(url: string, name: string, hint?: string): t.Identifier,
  injectDefaultImport(url: string, hint?: string): t.Identifier,
|};

export type ProviderResult = {|
  name: string,
  entryGlobal?: (meta: MetaDescriptor, utils: Utils, path: NodePath) => void,
  usageGlobal?: (meta: MetaDescriptor, utils: Utils, path: NodePath) => void,
  usagePure?: (meta: MetaDescriptor, utils: Utils, path: NodePath) => void,
  visitor: Object,
|};

export type MetaDescriptor =
  | {| kind: "import", source: string |}
  | {| kind: "global", name: string |}
  | {|
      kind: "property",
      placement: ?("static" | "prototype"),
      object: ?string,
      key: string,
    |}
  | {|
      kind: "in",
      placement: ?("static" | "prototype"),
      object: ?string,
      key: string,
    |};