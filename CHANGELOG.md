# Changelog

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
