import React, { useCallback, useEffect, useRef, useState } from "react";
import pretty from "pretty";

import { CustomEditor } from "../common/custom-types";
import { SlateContainer } from "../slate-container/slate-container";
import { EditorValue, textToSlate } from "../common/slate-types";
import { htmlToSlate, slateToHtml } from "./html-serializer";
import { serializeSelection, serializeValue, SlateExchangeValue } from "./serialization";
import "./serialization.stories.scss";

export default {
  title: "Serialization"
};

interface ISerializationStoryProps {
  convertContent: (content: EditorValue) => any;
  convertInitialContent: (content: string) => EditorValue;
  initialContent: string;
  outputName: string;
  prettyOutput: (output: any) => string;
}
const SerializationStory = (
  { convertContent, convertInitialContent, initialContent, outputName, prettyOutput }: ISerializationStoryProps
) => {
  const [content, setContent] = useState("");
  // Initial content isn't defined until after the slate editor is initialized so html -> slate will convert properly.
  useEffect(
    () => setContent(convertContent(convertInitialContent(initialContent))),
    [convertContent, convertInitialContent, initialContent]
  );

  const handleChange = useCallback(function handleChange(children: EditorValue) {
    setContent(convertContent(children));
  }, [convertContent]);

  return (
    <div className="serialization-container">
      <div className="panel">
        <SlateContainer
          onChange={handleChange}
          // Initial content isn't converted until after the slate editor is initialized
          value={() => convertInitialContent(initialContent)}
        />
      </div>
      <div className="panel output">
        <h3>{outputName}</h3>
        <pre>{prettyOutput(content)}</pre>
      </div>
    </div>
  );
};

const serializationText = "This example shows the serialized editor content.";
const prettySerialization = (content: SlateExchangeValue) => JSON.stringify(content, null, 2);

export const Serialization = () => (
  <SerializationStory
    convertContent={serializeValue}
    convertInitialContent={textToSlate}
    initialContent={serializationText}
    outputName="Serialized Content"
    prettyOutput={prettySerialization}
  />
);

const selectionSerializationText = "This example shows the serialized selection content determined by calling getDescendantsAtRange().";

export const SelectionSerialization = () => {
  const [content, setContent] = useState(textToSlate(selectionSerializationText));
  const editorRef = useRef<CustomEditor>();

  const handleChange = useCallback(function handleChange(children: EditorValue) {
    if (editorRef.current) {
      setContent(serializeSelection(editorRef.current));
    }
  }, []);

  const handleInitEditor = useCallback(function handleInitEditor(editor: CustomEditor) {
    return editorRef.current = editor;
  }, []);

  return (
    <div className="serialization-container">
      <div className="panel">
        <SlateContainer
          onChange={handleChange}
          value={textToSlate(selectionSerializationText)}
          onInitEditor={handleInitEditor}
        />
      </div>
      <div className="panel output">
        <h3>Serialized Selection</h3>
        <pre>{JSON.stringify(content, null, 2)}</pre>
      </div>
    </div>
  );
};

const htmlSerializationText = "This example shows the editor content serialized as HTML.";

export const HtmlSerialization = () => (
  <SerializationStory
    convertContent={slateToHtml}
    convertInitialContent={textToSlate}
    initialContent={htmlSerializationText}
    outputName="Serialized HTML"
    prettyOutput={pretty}
  />
);

const clueSerializationText = "This example shows the editor content serialized in CLUE text tile importable JSON.";

function slateToClueTile(value: EditorValue) {
  const outHtml = slateToHtml(value)
                    .split("\n")
                    .map((line, i, arr) => `    "${line.replace(/"/g, "\\\"")}"${i < arr.length - 1 ? "," : ""}`);
  return [
    `{`,
    `  "type": "Text",`,
    `  "format": "html",`,
    `  "text": [`,
    ...outHtml,
    `  ]`,
    `}`
  ].join("\n");
}

export const ClueSerialization = () => (
  <SerializationStory
    convertContent={slateToClueTile}
    convertInitialContent={textToSlate}
    initialContent={clueSerializationText}
    outputName="CLUE Text Tile JSON"
    prettyOutput={(content: string) => content}
  />
);

const importedHtmlText = "<h1>A header paragraph</h1><p>A simple paragraph.</p><blockquote>A quoted paragraph.</blockquote>";

export const ImportedHTML = () => (
  <SerializationStory
    convertContent={slateToHtml}
    convertInitialContent={htmlToSlate}
    initialContent={importedHtmlText}
    outputName="Serialized HTML"
    prettyOutput={pretty}
  />
);
