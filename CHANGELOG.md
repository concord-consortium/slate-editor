# Changelog

## Version 0.12.0 - September 26, 2025
- [Breaking] Minimum React version is 18
- Improved support for external toolbars
- Updated many dependencies
- Fixed rendering of selected colored text

## Version 0.11.0 - September 26, 2025 (prepared August 2024)

### Features/Improvements
- [Breaking] Plugin architecture improvements
- [Breaking] Update minimum React version to 17

## Version 0.10.1 - July 24, 2024

### Features/Improvements
- Export `isCustomElement()` function

### Bugs Fixed
- Fix bug in `ReactEditor.focus()` by downgrading to `slate-react` 0.98.4

## Version 0.10.0 - July 24, 2024

### Features/Improvements
- Update `slate` to 0.103.0, `slate-react` to 0.99.0, `storybook` to 8.2.5 among other dependencies

### Bugs Fixed
- Reduce bundle size (eliminate redundant lodash import)

## Version 0.9.1 - March 13, 2023

### Bugs Fixed
- Wrap free text nodes when importing HTML

## Version 0.9.0 - March 10, 2023

### Features/Improvements
- Major update to `slate` 0.86.0 and `slate-react` 0.86.0

## Version 0.8.2 - September 26, 2022

### Bugs Fixed
- Fix chrome 105 issues

## Version 0.8.1 - July 7, 2022

### Features/Improvements
- Show toolbar buttons as disabled when appropriate [#173421926] #70
- Update dependencies

### Bugs Fixed
- Fix `peerDependencies` for `slate-react` (=> `@concord-consortium/slate-react`)
- Fix `peerDependencies` for `slate-react-placeholder` (=> `@concord-consortium/slate-react-placeholder`)

## Version 0.8.0 - May 7, 2022

### Features/Improvements
- Update dependencies
- Bundle types into one file
- Support registering custom Mark, Block, and Inline formats
- Export more types, util functions, and objects to support external plugins and
  external dialog implementations
- Refactor the dialog so it is easier to use just parts of it
- Add a unique prefix to all css classes so they can be imported without conflicts
- Add custom plugin example `plugin-examples/variable-plugin`

### Bugs Fixed
- Enable cut/copy/paste for image-only selections [#181315816]

## Version 0.7.3 - December 17, 2021

### Features/Improvements
- Update dependencies

### Bugs Fixed
- Fix bugs with multiple editor instances on a page [#180648279]

## Version 0.7.2 - February 26, 2021

- Convert/strip `className` property on import/export
- Update dependencies

## Version 0.7.1 - February 11, 2021

- Support legacy `line` block type (synonym for `paragraph`)

## Version 0.7.0 - February 11, 2021

- Support `placeholder` editor prop
- Support `readOnly` editor prop
- `<a>` tags specify `target="_blank"` by default
- Export additional TypeScript types (`EditorRange`, `EFormat`, etc.)
- Update dependencies

## Version 0.6.0 - August 26, 2020

- Fix bug which prevented editing of some blocks imported from HTML
- Prevent duplicate class names being applied to `<img>` tags
- Update dependencies
- [BREAKING] Normalized more CSS class names for consistency/uniqueness
  - `.slate-container` => `.ccrte-container`

## Version 0.5.0 - July 22, 2020

- Image dialog supports alt text, sizing, float left|right, etc.
- Support toolbar placeholders
- [BREAKING] Normalized some CSS class names for consistency/uniqueness
  - `.slate-editor` => `.ccrte-editor`
  - `.slate-toolbar` => `.ccrte-toolbar`
  - `.modal-dialog` => `.ccrte-modal-dialog`
  - `.modal-cover` => `.ccrte-modal-cover`

## Version 0.4.3 - July 17, 2020

- Auto-scroll to selection after toolbar clicks

## Version 0.4.2 - July 16, 2020

- Fix dialog text color

## Version 0.4.1 - July 16, 2020

- Support `themeColor` prop for toolbar (used for dialog color)
- Fix IME bugs (improve Chinese/Japanese/etc. keyboard support)
- Update dependencies

## Version 0.4.0 - July 16, 2020 [abandoned]

## Version 0.3.0 - June 30, 2020

- Improve focus/blur handling
- Add onLoad callback to assist clients with sizing of images

## Version 0.2.1 - June 26, 2020

- [really] Fix behavior of marks imported via `htmlToSlate()`
- [really] BREAKING: `onContentChange()` argument is now a raw `EditorValue` rather than a serialized JSON value so that clients can choose a serialization model.

Note: Previous version failed to include a necessary PR.

## Version 0.2.0 - June 25, 2020

- Fix behavior of marks imported via `htmlToSlate()`
- BREAKING: `onContentChange()` argument is now a raw `EditorValue` rather than a serialized JSON value so that clients can choose a serialization model.
- add `getContentHeight()` function
- fix style-handling bug in `SlateEditor`
- Update dependencies

## Version 0.1.1 - June 9, 2020

- Update README
- Export additional symbols

## Version 0.1.0 - June 9, 2020

- Support import/export of HTML content
- Support import/export of HTML tables
- All content handling moved into plugins

## Version 0.0.9 - May 27, 2020

- Support client-specified tooltips for toolbar buttons
- Don't allow inlines to wrap other inlines
- Add `serializeSelection()` with storybook example
- Fix lint scripts on Windows

## Version 0.0.8 - May 12, 2020

- Open link on double-click
- Fix serialization of font size
- Use pointer cursor over links and toolbar buttons
- Client can remove tools from toolbar
- Add onDidInvokeTool callback

## Version 0.0.7 - May 11, 2020

- Built-in modal dialog replaces system alert usage
- Client configuration of undo/redo
- Selecting black clears selected color

## Version 0.0.6 - May 7, 2020

- Toolbar tweaks

## Version 0.0.5 - May 7, 2020

- Add support for inline images
- Improve behavior of text color button
- Block quotes are no longer italicized by default

## Version 0.0.4 - May 6, 2020

- Add font increase and decrease to toolbar
- Support setting fill and background colors of toolbar buttons
- Support client-ordering of toolbar buttons
- Support vertical scrolling

## Version 0.0.3 - May 5, 2020

- Support client-provided editor plugins
- Improved handling of focus/blur
- Support wrapping of toolbar onto multiple rows/columns
- Toolbar buttons preserve focus/selection (required after recent focus/blur changes)

## Version 0.0.2 - April 29, 2020

Serialization support plus
- `SlateEditor` is always controlled (client maintains value)
- `SlateEditor.onContentChange` serializes to Slate 0.50+ format
- `text-color` mark renamed `color`
- Storybook examples updated
- Toolbar background renders correctly
- `textToSlate()` specifies default block of "paragraph"

## Version 0.0.1

Initial release
