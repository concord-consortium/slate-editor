import React, { ReactNode } from "react";
import findLast from "lodash/findLast";
import { Block, Mark } from "slate";
import { RenderAttributes, RenderMarkProps } from "slate-react";
import { EFormat } from "../common/slate-types";
import { renderColorMark } from "../plugins/color-plugin";

// These renderers are used by the Slate editor to translate a mark or block
// into its HTML representation.

const markLayers: Record<string, number> = {
  "deleted": -1,
  "color": 1
};

export function renderOneSlateMark(mark: Mark, attributes: RenderAttributes, children: ReactNode) {
  const { type } = mark;
  switch (type) {
    case "bold":
      return (<strong {...attributes}>{children}</strong>);
    case "code":
      return (<code {...attributes}>{children}</code>);
    case "italic":
      return (<em {...attributes}>{children}</em>);
    case "underlined":
      return (<u {...attributes}>{children}</u>);
    case "deleted":
      return (<del {...attributes}>{children}</del>);
    case "inserted":
      return (<mark {...attributes}>{children}</mark>);
    case "superscript":
      return (<sup {...attributes}>{children}</sup>);
    case "subscript":
      return (<sub {...attributes}>{children}</sub>);
    case "color": {
      // we can't move this into the plugin due to the ordering issues described below
      return renderColorMark(mark, attributes, children);
    }
    default:
      return (<span {...attributes}>{children}</span>);
  }
}

// By default, marks are rendered in the order in which they're stored in the model,
// which is the order in which they're added by the user. In some cases, however,
// there are ordering dependencies in the rendering of the marks, notably that a
// text color mark must wrap a strikethrough mark for the strikethrough to be
// rendered in the correct color. Therefore, we play a bit of sleight-of-hand by
// rendering the mark that should be rendered at the appropriate mark render index
// rather than rendering the mark that slate actually asked us to render.
export function renderSlateMark(props: RenderMarkProps) {
  const { mark, marks: originalMarks } = props;
  const marks: Mark[] = originalMarks.toArray();
  const requestedIndex = marks.findIndex(_mark => _mark.type === mark.type);
  const textColorMark = findLast(marks, _mark => _mark.type === EFormat.color);
  const orderedMarks = marks.filter(_mark => _mark.type !== EFormat.color);
  orderedMarks.sort((a: Mark, b: Mark) => (markLayers[a.type] || 0) - (markLayers[b.type] || 0));
  textColorMark && orderedMarks.push(textColorMark);
  if (requestedIndex < orderedMarks.length) {
    return renderOneSlateMark(orderedMarks[requestedIndex], props.attributes, props.children);
  }
}

export function renderSlateBlock(block: Block, attributes: RenderAttributes, children: ReactNode) {
  switch (block.type) {
    case "heading1":
      return (<h1 {...attributes}>{children}</h1>);
    case "heading2":
      return (<h2 {...attributes}>{children}</h2>);
    case "heading3":
      return (<h3 {...attributes}>{children}</h3>);
    case "heading4":
      return (<h4 {...attributes}>{children}</h4>);
    case "heading5":
      return (<h5 {...attributes}>{children}</h5>);
    case "heading6":
      return (<h6 {...attributes}>{children}</h6>);
    case "code":
      return (<code {...attributes}>{children}</code>);
    case "ordered-list":
      return (<ol {...attributes}>{children}</ol>);
    case "bulleted-list":
    case "todo-list":
      return (<ul {...attributes}>{children}</ul>);
    case "list-item":
      return (<li {...attributes}>{children}</li>);
    case "horizontal-rule":
      return (<hr {...attributes}/>);

    // Note: Tables, as implemented in the current de-serializer, do not
    // nest a <tbody> element within the <table>. A new rule could easily
    // be added that would handle this case and bring the DOM in alignment
    // with the slate model.
    //
    // TODO: Add rule for <tbody>.

    case "table":
      return (<table {...attributes}>{children}</table>);
    case "table-row":
      return (<tr {...attributes}>{children}</tr>);
    case "table-head":
      return (<th {...attributes}>{children}</th>);
    case "table-cell":
      return (<td {...attributes}>{children}</td>);
    case "block-quote":
      return (<blockquote {...attributes}>{children}</blockquote>);
    // case "link":   // TODO: This is broken.
    //   return (<a href={href} {...attributes}>{children}</a>);

    case "paragraph":
    default:
      return (<p {...attributes}>{children}</p>);
  }
}
