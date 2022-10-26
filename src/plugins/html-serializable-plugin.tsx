//import { Plugin } from "slate-react";
//import { Rule } from "slate-html-serializer";

export interface HtmlSerializationRule {
  deserialize? : (html: any) => any; // FIXME: this is probably the wrong place for this
  serialize?: (obj: any, children: any) => string; // FIXME: this is probably the wrong place for this.
  postSerialize?: (html: string) => string;
}