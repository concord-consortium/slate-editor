import React, { useState } from "react";
import { SlateContainer } from "../slate-container/slate-container";
import { textToSlate } from "../common/slate-types";
import { serializeValue } from "./serialization";
import "./slate-serialization.stories.scss";

export default {
  title: "Serialization"
};

const serializationText = "This example shows the serialized editor content.";

export const Serialization = () => {
  const [value, setValue] = useState(serializationText);
  const slateValue = textToSlate(serializationText);
  const serializedValue = serializeValue(slateValue.toJSON());
  const [content, setContent] = useState(serializedValue);
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
