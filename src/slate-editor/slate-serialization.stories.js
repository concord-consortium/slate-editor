import React, { useState } from "react";
import { SlateContainer } from "../slate-container/slate-container";
import { textToSlate } from "../common/slate-types";
import { serializeSelection, serializeValue } from "./serialization";
import "./slate-serialization.stories.scss";

export default {
  title: "Serialization"
};

const serializationText = "This example shows the serialized editor content.";

export const Serialization = () => {
  const slateValue = textToSlate(serializationText);
  const [value, setValue] = useState(slateValue);
  const [content, setContent] = useState(serializeValue(value.toJSON()));
  return (
    <div className="serialization-container">
      <div className="panel">
        <SlateContainer
          value={value}
          onValueChange={_value => setValue(_value)}
          onContentChange={_content => setContent(_content)}
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
