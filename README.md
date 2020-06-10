# Slate Editor

Rich text editor based on [Slate](https://slatejs.org) developed by [The Concord Consortium](http://concord.org/).

## Development

The setup of this project was patterned after [https://blog.harveydelaney.com/creating-your-own-react-component-library/](https://blog.harveydelaney.com/creating-your-own-react-component-library/), which contains additional details on working with the project.

### Local development/testing

For local library development we use [Storybook](https://storybook.js.org/) to organize and run test cases. To run the Storybook examples:

```
$ npm run lint        # run linter
$ npm run test        # run unit tests
$ npm run build       # perform build

$ npm run storybook   # launch storybook
```

### Client development/testing

For development in the context of a client application (such as CODAP) it's useful to link the library under development directly.

In `slate-editor` directory:
```
$ npm link # to make the module linkable
$ npm run link:react # to avoid duplicate react warnings when testing in CODAP
```
If testing in another application besides CODAP, adjust the path to the client application in the script appropriately. See [Understanding npm-link](https://medium.com/dailyjs/how-to-use-npm-link-7375b6219557) and [Duplicate React when using npm link](https://reactjs.org/warnings/invalid-hook-call-warning.html#duplicate-react) for details.

In client application directory:
```
$ npm link @concord-consortium/slate-editor # to link to the `slate-editor` library directly
```

Note that these links can be inadvertently undone when performing other npm tasks like npm install, so if things stop working you may need to refresh the links.

## Publishing

1. Verify that everything builds correctly
    - `npm run build`
1. Update the version number in `package.json` and `package-lock.json`
    - `npm version --no-git-tag-version [patch|minor|major]`
1. Update the `CHANGELOG.md` with a description of the new version
1. Commit and push the changes either directly or via Github pull request
1. Verify that everything still builds correctly
    - `npm run build`
1. Create/push a tag for the new version (e.g. v0.1.0) and a description (e.g. Release 0.1.0)
    - This can be done in a local git client or on the releases page of the Github repository
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

## References

- Slate: https://slatejs.org
- Slate GitHub (0.47 branch): https://github.com/ianstormtaylor/slate/tree/v0.47
- Project Configuration: https://blog.harveydelaney.com/creating-your-own-react-component-library/
- ESLint/TypeScript Configuration: https://michelenasti.com/2019/06/27/typescript-babel-webpack-eslint-my-configuration.html
- FontAwesome Icons: https://www.iconfinder.com/iconsets/font-awesome
- SVG Conversion: https://react-svgr.com/playground/
