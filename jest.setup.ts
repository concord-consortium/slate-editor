import "@testing-library/jest-dom";

// polyfill `TextEncoder` since it's not provided by JSDOM
// https://github.com/jsdom/jsdom/issues/2524
// https://github.com/inrupt/solid-client-authn-js/issues/1676#issuecomment-917016646
import { TextEncoder } from "util";
(globalThis as any).TextEncoder = TextEncoder;
