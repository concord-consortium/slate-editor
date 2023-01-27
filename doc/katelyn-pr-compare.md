Notes on differences between [Katelyn's update branch](https://github.com/concord-consortium/slate-editor/pull/75) (KM) and [Kirk's update branch](https://github.com/concord-consortium/slate-editor/pull/69) (KS).

`assets/*`
- asset icon components removed/not present

`common`
- `create-editor.ts` KM moved from top-level to `common/create-editor.ts`
- `custom-hooks.ts` (`usePrevious`, `useRefState`) KM removed/not present
- `custom-types.ts` KM not present (contents in `slate-types.ts`)
- `slate-types.ts`
  - added `variable` to `EFormat` list
  - `variable = "variable" // FIXME: This should be provided via plugin registration`
  - includes types from `custom-types.ts`
  - adds `VariableElement` type which shouldn't really be in the library
- `slate-utils.ts` KM combined with `slate-editor/slate-utils.ts`

`editor-toolbar`
- `editor-toolbar.stories.tsx` not present
- `editor-toolbar.tsx` no significant differences
- `toolbar-button.tsx` differences don't seem significant, but seems less current

`hooks`
- `use-serializing.ts` no significant differences

`index.tsx` comments out a number of types that are no longer exported

`modal-dialog/*`
- most of these files are not present or have been removed
- `modal-dialog.ts` no useful changes
- `modal-dialog.scss` changes `z-index` for dialogs from 100 to 1000 with comment "Make sure the dialog is above slate elements"

`plugin-examples`
- `icon-variable.tsx` not present/removed
- `plugin-examples.stories.tsx` - KS commented out; KM enabled
- `variable-plugin.scss` - KM removed/missing?
- `variable-plugin.tsx` - KC commented out; KM enabled

`plugins`
- `color-plugin.tsx` - KM tweaked rendering for serialization
- `core-blocks-plugin.tsx` - KS commented out; KM removed/missing
- `core-inlines-plugin.tsx` - KS commented out; KM enabled but unchanged using old plugin model
- `core-marks-plugin.tsx` - KS commented out; KM removed/missing
- `editor-history.tsx` - KS commented out; KM enabled but unchanged using old plugin model
- `emitter-plugin.tsx` - no significant differences
- `font-size-plugin.tsx` - KS commented out; KM commented out
- `html-serializable-plugin.tsx` - KS commented out; KM commented in but not used
- `image-plugin.scss` - KM removed/missing styles for `.ccrte-image-node` and `.ccrte-inline-block`
- `image-plugin.tsx` - minimal differences, but KM adds isSerializing render customization
- `link-plugin.tsx` - no significant differences
- `list-plugin.tsx` - KS commented out; KM removed/missing
- `on-load-plugin.tsx` - KS commented out; KM enabled but unchanged using old plugin model
- `table-plugin.tsx` - KS commented out; KM enabled but unchanged using old plugin model

`serialization`
- `html-serializer.test.tsx` - KS commented out; KM enabled first two tests and commented out the rest
- `html-serializer.tsx` - KS commented out; KM enabled using a variation of slate sample code from https://docs.slatejs.org/concepts/10-serializing#html and https://docs.slatejs.org/concepts/10-serializing#deserializing
- `html-utils.test.ts` - KS commented out; KM enabled
- `html-utils.ts` - KS commented out; KM mostly enabled (not `getRenderAttributesFromNode`)
- `lara-fixtures.stories.ts` - KS commented out; KM enabled
- `lara-fixterus.ts` - KM missing/enabled?
- `legacy-serialization.test.ts` - KS/KM commented out
- `legacy-serialization.ts` - no significant differences
- `serialization-stories.scss` - KM removed/missing
- `serialization-stories.tsx` - KS commented out; KM partially enabled
- `serialization.test.ts` - KS/KM commented out
- `serialization.ts` - KM adds `*JSON = any` types for use in legacy conversion
- `slate-json-conversion.test.ts` - KM added to test legacy conversion; possibly based on tests originally in `serialization.test.ts`
- `slate-json-conversion.ts` - KM implements legacy conversion largely based on serialization code originally in `serialization.ts` (since legacy `slate-editor` library was pre-converting to 0.50+ format for serialization purposes)

`slate-container`
- `slate-container.scss` - KM removed/missing
- `slate-container.stories.tsx` - no significant differences
- `slate-container.tsx` - KM some minor refactoring worth considering further

`slate-editor`
- `element.tsx` - no relevant differences
- `example-components.tsx` = KM removed/missing
- `rich-text-example.stories.tsx` = KM removed/missing
- `rich-text-example.tsx` - KM removed/missing
- `slate-editor.scss`
  - KM block quote color #888 to #aaa
  - KM `.ccrte-text-color` => `.text-color`
- `slate-editor.stories.tsx` - no significant differences
- `slate-editor.test.tsx` - KS enabled, KM commented out
- `slate-editor.tsx` - KM looks more complete (adds additional props, etc.)

`slate-toolbar`
- `slate-dialog.stories.tsx` - KM removed/missing
- `slate-toolbar-portal.tsx` - KM removed/missing
- `slate-toolbar.stories.tsx` - no significant differences
- `slate-toolbar.tsx` - no significant differences
