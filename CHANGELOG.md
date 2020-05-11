# Changelog

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
