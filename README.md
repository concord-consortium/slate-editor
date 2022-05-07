# Slate Editor

Rich text editor based on [Slate](https://slatejs.org) developed by [The Concord Consortium](http://concord.org/). It is published to npm as [@concord-consortium/slate-editor](https://www.npmjs.com/package/@concord-consortium/slate-editor). Storybook examples can be viewed at https://slate-editor.concord.org.

## Introduction

CC's use of [Slate](https://slatejs.org) began with the [CLUE](https://github.com/concord-consortium/collaborative-learning) project in the fall of 2018 when Slate was at version 0.40.0. In CLUE, the editor was student-facing and quite limited in functionality. In early 2020, to meet the needs of the [CODAP](https://github.com/concord-consortium/codap) project for a user-facing rich text editor, the `slate-editor` library project began as a means to share editor functionality across CC projects. At this point it is also being used for authoring in the [question-interactives](https://github.com/concord-consortium/question-interactives) project and efforts are underway to use it in [LARA](https://github.com/concord-consortium/lara) project authoring as well.

In late 2019 Slate released its 0.50 version, which was a major backwards-incompatible release with substantial architectural changes. In the process, [Android support](https://docs.slatejs.org/general/faq#what-browsers-and-devices-does-slate-support) was dropped (presumably temporarily) along with weakening of support for some browser versions. Ideally, this library will adopt the later Slate versions once these support issues are ironed out. In the meantime, we (and others) continue to use the Slate 0.47 release.

## Development

The setup of this project was patterned after [https://blog.harveydelaney.com/creating-your-own-react-component-library/](https://blog.harveydelaney.com/creating-your-own-react-component-library/), which contains additional details on working with the project.

### Local development/testing

There are npm scripts to handle the basics of development:

```
$ npm run lint      # run linter
$ npm run test      # run unit tests
$ npm run build     # perform build
```

For local library development we use [Storybook](https://storybook.js.org/) to organize and run test cases. To run the Storybook examples:

```
$ npm start         # launch storybook
```

With the storybook server running, examples can be viewed in a browser at http://localhost:6006.

### Client development/testing

#### Using npm link

For development in the context of a client application (such as CODAP) it's useful to link the library under development directly.

In the `slate-editor` project directory:
```
$ npm link              # to make the module linkable
$ npm run link:react    # to avoid duplicate react warnings when testing in CODAP
```
If testing in another application besides CODAP, adjust the path to the client application in the script appropriately. See [Understanding npm-link](https://medium.com/dailyjs/how-to-use-npm-link-7375b6219557) and [Duplicate React when using npm link](https://reactjs.org/warnings/invalid-hook-call-warning.html#duplicate-react) for details.

In client project directory:
```
$ npm link @concord-consortium/slate-editor # to link to the `slate-editor` library directly
```

Note that these links can be inadvertently undone when performing other npm tasks like npm install, so if things stop working you may need to refresh the links.

#### Using yalc (instead of npm link)

[yalc](https://www.npmjs.com/package/yalc) provides an alternative to `npm link`. It acts as a very simple local repository for locally developed packages that can be shared across a local environment. It provides a better workflow than `npm | yarn link` for package authors. There are scripts in package.json to make this easier. 

To publish an in-development version of the slate-editor library, in the root directory of the slate-editor project:
```
$ npm run yalc:publish
```

To consume an in-development version of the slate-editor library, in the root directory of the client project:
```
$ npx yalc add @concord-consortium/slate-editor
```

To update all clients that are using the in-development version of slate-editor, in the slate-editor project:
```
$ npm run yalc:publish
```

`yalc` modifies the `package.json` of the client project with a link to the local `yalc` repository. _This is a good thing!_ as it makes it obvious when you're using an in-development version of a library and serves as a reminder to install a fully published version before pushing to GitHub, etc. It also means that running `npm install` in the client project will not break the setup.

### @concord-consortium/slate

The `slate-editor` library makes use of a local fork of the [slate](https://github.com/ianstormtaylor/slate) GitHub repository at [@concord-consortium/slate](https://github.com/concord-consortium/slate). As of this writing the only package that has been modified is `slate-react` which has been published as [@concord-consortium/slate-react](https://www.npmjs.com/package/@concord-consortium/slate-react).

## Deployment

The storybook examples for the slate-editor library are automatically deployed by Travis CI. The main production deploy URL is https://slate-editor.concord.org. Branch builds are deployed to https://slate-editor.concord.org/branch/{branch-name}/ (the trailing `/` is required), e.g. the most recent contents of the `master` branch can be tested at https://slate-editor.concord.org/branch/master/.

## Publishing

1. Update the `CHANGELOG.md` with a description of the new version
1. Update the version number in `package.json` and `package-lock.json`
    - `npm version --no-git-tag-version [patch|minor|major]`
1. Verify that everything builds correctly
    - `npm run lint && npm run test && npm run build`
1. Commit and push the changes either directly or via GitHub pull request
1. Create/push a tag for the new version (e.g. v0.5.0) and a description (e.g. Release 0.5.0)
    - This can be done in a local git client or on the releases page of the GitHub repository
1. Publish new release on releases page of GitHub repository
1. Test a dry-run of publishing the package to the npm repository
    - `npm publish --access public --dry-run`
1. Publish the package to the npm repository
    - `npm publish --access public`

## Serialization and import/export

Editor content can be serialized to/from JSON, HTML, or plain text (lossy).

#### JSON

- `deserializeValue(value: SlateExchangeValue): EditorValue`
- `serializeValue(value: EditorValue): SlateExchangeValue`
- `deserializeDocument(document: SlateDocument): DocumentJSON`
- `serializeDocument(document: DocumentJSON): SlateDocument`

#### HTML

- `htmlToSlate(html: string): EditorValue`
- `slateToHtml(value: EditorValue): string`

#### Text (lossy)

- `textToSlate(text: string): EditorValue`
- `slateToText(value: EditorValue): string`

### JSON Documentation

The best way to understand the JSON serialization format is to play with the [serialization](https://slate-editor.concord.org/?path=/story/serialization--serialization) storybook example which provides an active editor session on the left and a live-updating view of the serialized JSON on the right. See Slate's [Data Model](https://docs.slatejs.org/v/v0.47/guides/data-model) documentation for a high-level description of the organization of the editor content. Slate doesn't proscribe the set of block/inline nodes or marks that are supported by a particular editor built with Slate, however. One final wrinkle is that one of the changes introduced by the 0.50 version of Slate is a simpler, less deeply-nested JSON serialization format. With an eye toward easing an eventual migration to the latest Slate version, this library adopts aspects of that simpler, less deeply-nested format for its own JSON serialization.

#### Marks

>Marks are how Slate represents formatting data that is attached to the characters in the text itself.

All of the characters in a text node must have the same marks (character-level formatting), so as formatting is applied the text is broken up into nodes with common formatting. A TypeScript definition of a text node would look like:

```typescript
interface TextNode {
  text: string;             // the text of the node
  bold?: boolean;           // <strong>
  italic?: boolean;         // <em>
  underlined?: boolean;     // <u>
  deleted?: boolean;        // <del> (strikethrough)
  color?: string;           // <span color="#rrggbb">
  code?: boolean;           // <code>
  subscript?: boolean;      // <sub>
  superscript?: boolean;    // <sup>
}
```

#### Inlines

>Inlines can only contain inline or text nodes.

Inline nodes are rendered inline with text nodes (as their name would suggest), but can contain more elaborate representations and can (in theory) contain other nodes. There are currently two types of inlines supported by the `slate-editor` library:

```typescript
interface LinkNode {
  type: "link";             // <a>
  children: TextNode[];     // link text
  href: string;             // link url
}

interface ImageNode {
  type: "image";            // <img>
  src: string;              // image url
  alt?: string;             // alt/title text
  width?: number;
  height?: number;
  constrain?: boolean;      // whether to constrain to original aspect ratio (default true)
  float?: "left" | "right"  // whether/how to float the image (defaults to inline, i.e. not floated)
  children: TextNode[];     // not used, but an empty text node is required for normalization
}

type InlineNode = ImageNode | LinkNode;
```

#### Blocks

>Blocks may contain either only block nodes, or a combination of inline and text nodes.

Essentially, each block corresponds to a block-level HTML tag:

```typescript
interface ParagraphNode {
  type: "paragraph";                    // <p>
  children: (InlineNode | TextNode)[];
}

interface HeadingNode {
  type: "heading1" | ... | "heading6";  // <h1> ... <h6>
  children: (InlineNode | TextNode)[];
}

interface BlockQuoteNode {
  type: "block-quote";                  // <blockquote>
  children: (InlineNode | TextNode)[];
}

interface BulletedListNode {
  type: "bulleted-list";                // <ul>
  children: ListItemNode[];
}

interface OrderedListNode {
  type: "ordered-list";                 // <ol>
  children: ListItemNode[];
}

interface ListItemNode {
  type: "list-item";                    // <li>
  children: (InlineNode | TextNode)[];
}

type BlockNode = ParagraphNode | HeadingNode | BlockQuoteNode |
                BulletedListNode | OrderedListNode | ListItemNode;
```

#### Editor Document

The document contains a list of block nodes:

```typescript
interface EditorDocument {
  children: BlockNode[];
  // mapping from node type to block/inline; the need for this may be removed at some point
  objTypes: Record<string, "block" | "inline">
}
```

#### Editor Value

The editor value also includes document-wide settings, e.g. `fontSize` (which is really a font scale factor):

```typescript
interface DocumentSettings {
    fontSize: number;           // scale factor, e.g. 1.1 = +10%
}

interface EditorValue {
  object: "value";
  data: DocumentSettings;
  document: EditorDocument;
}
```

## References

- slate-editor storybook examples: https://slate-editor.concord.org
- Slate: https://slatejs.org
- Slate Documentation (0.47): https://docs.slatejs.org/v/v0.47/
- Slate GitHub (0.47 branch): https://github.com/ianstormtaylor/slate/tree/v0.47
- @CC/slate GitHub (cc-master branch): https://github.com/concord-consortium/slate/tree/cc-master
- Project Configuration: https://blog.harveydelaney.com/creating-your-own-react-component-library/
- ESLint/TypeScript Configuration: https://michelenasti.com/2019/06/27/typescript-babel-webpack-eslint-my-configuration.html
- FontAwesome Icons: https://www.iconfinder.com/iconsets/font-awesome
- SVG Conversion: https://react-svgr.com/playground/
