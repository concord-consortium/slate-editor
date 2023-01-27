import { registerColorMark } from "./color-plugin";
import { registerCoreBlocks } from "./core-blocks-plugin";
import { registerCoreInlines } from "./core-inlines-plugin";
import { registerCoreMarks } from "./core-marks-plugin";
import { registerImageInline } from "./image-plugin";
import { registerLinkInline } from "./link-plugin";
import { registerListBlocks } from "./list-plugin";

export function registerPlugins() {
  registerCoreMarks();
  registerColorMark();
  registerCoreBlocks();
  registerListBlocks();
  registerCoreInlines();
  registerImageInline();
  registerLinkInline();
}
