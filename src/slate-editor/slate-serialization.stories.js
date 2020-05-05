import React, { useState } from "react";
import { SlateContainer } from "../slate-container/slate-container";
import { textToSlate } from "../common/slate-types";
import { serializeDocument } from "./serialization";
import "./slate-serialization-stories.scss";

export default {
  title: "Serialization"
};

const serializationText = "This example shows the serialized editor content.";

export const Serialization = () => {
  const [value, setValue] = useState(serializationText);
  const slateValue = textToSlate(serializationText)
  const { document } = slateValue.toJSON();
  const serializedDocument = { object: "value", document: document && serializeDocument(document) };  
  const [content, setContent] = useState(serializedDocument);
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
        <div>{JSON.stringify(content)}</div>
      </div>
    </div>
  );
};
