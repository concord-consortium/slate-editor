# Slate Editor

Rich text editor based on [Slate](https://slatejs.org) developed by [The Concord Consortium](http://concord.org/).

## Development

The setup of this project was patterned after [https://blog.harveydelaney.com/creating-your-own-react-component-library/](https://blog.harveydelaney.com/creating-your-own-react-component-library/), which contains additional details on working with the project.

### npm link

For development it's useful to link the library under development directly.

In `slate-editor` directory:
```
$ npm link # to make the module linkable
$ npm link ../client-app/node_modules/react # to avoid duplicate react warnings
```
See [Understanding npm-link](https://medium.com/dailyjs/how-to-use-npm-link-7375b6219557) and [Duplicate React when using npm link](https://reactjs.org/warnings/invalid-hook-call-warning.html#duplicate-react) for details.

In `client-app` directory (assuming the two directories are siblings):
```
$ npm link @concord-consortium/slate-editor # to link to the `slate-editor` library directly
```

## References

Slate: https://slatejs.org
Slate GitHub (0.47 branch): https://github.com/ianstormtaylor/slate/tree/v0.47
Project Configuration: https://blog.harveydelaney.com/creating-your-own-react-component-library/
ESLint/TypeScript Configuration: https://michelenasti.com/2019/06/27/typescript-babel-webpack-eslint-my-configuration.html
FontAwesome Icons: https://www.iconfinder.com/iconsets/font-awesome
SVG Conversion: https://react-svgr.com/playground/
