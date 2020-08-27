import React, { useState } from "react";
import pretty from "pretty";
import { SlateContainer } from "../slate-container/slate-container";
import { textToSlate } from "../common/slate-types";
import { slateToHtml, htmlToSlate } from "./html-serializer";
import { serializeSelection, serializeValue } from "./serialization";
import "./serialization.stories.scss";

export default {
  title: "Serialization"
};

const serializationText = "This example shows the serialized editor content.";

export const Serialization = () => {
  const slateValue = textToSlate(serializationText);
  const [value, setValue] = useState(slateValue);
  const [content, setContent] = useState(serializeValue(value));
  return (
    <div className="serialization-container">
      <div className="panel">
        <SlateContainer
          value={value}
          onValueChange={_value => setValue(_value)}
          onContentChange={_value => setContent(serializeValue(_value))}
        />
      </div>
      <div className="panel output">
        <h3>Serialized Content</h3>
        <pre>{JSON.stringify(content, null, 2)}</pre>
      </div>
    </div>
  );
};

const selectionSerializationText = "This example shows the serialized selection content determined by calling getDescendantsAtRange().";

export const SelectionSerialization = () => {
  const slateValue = textToSlate(selectionSerializationText);
  const [value, setValue] = useState(slateValue);
  const serializedSelection = serializeSelection(value);
  return (
    <div className="serialization-container">
      <div className="panel">
        <SlateContainer
          value={value}
          onValueChange={_value => setValue(_value)}
        />
      </div>
      <div className="panel output">
        <h3>Serialized Selection</h3>
        <pre>{JSON.stringify(serializedSelection, null, 2)}</pre>
      </div>
    </div>
  );
};

const htmlSerializationText = "This example shows the editor content serialized as HTML.";

export const HtmlSerialization = () => {
  const slateValue = textToSlate(htmlSerializationText);
  const [value, setValue] = useState(slateValue);
  const [content, setContent] = useState(slateToHtml(value));
  return (
    <div className="serialization-container">
      <div className="panel">
        <SlateContainer
          value={value}
          onValueChange={_value => {
            setValue(_value);
            setContent(slateToHtml(_value));
          }}
        />
      </div>
      <div className="panel output">
        <h3>Serialized HTML</h3>
        <pre>{pretty(content)}</pre>
      </div>
    </div>
  );
};

const importedHtmlText = "<h1>A header paragraph</h1><p>A simple paragraph.</p><blockquote>A quoted paragraph.</blockquote>";

export const ImportedHTML = () => {
  const slateValue = htmlToSlate(importedHtmlText);
  const [value, setValue] = useState(slateValue);
  const [content, setContent] = useState(slateToHtml(value));
  return (
    <div className="serialization-container">
      <div className="panel">
        <SlateContainer
          value={value}
          onValueChange={_value => {
            setValue(_value);
            setContent(slateToHtml(_value));
          }}
        />
      </div>
      <div className="panel output">
        <h3>Serialized HTML</h3>
        <pre>{pretty(content)}</pre>
      </div>
    </div>
  );
};
