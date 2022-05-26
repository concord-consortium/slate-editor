/*
import React, { useState } from "react";
import pretty from "pretty";
import { SlateContainer } from "../slate-container/slate-container";
import { slateToHtml, htmlToSlate } from "./html-serializer";
import { kFieldMouseFurColorIntro, kMonteCarloRisk, kNaturalHistoryV5Intro, kNaturalHistoryV5Page3,
          kOilAndWaterIntro } from "./lara-fixtures";
import "./serialization.stories.scss";

export default {
  title: "LARA Fixtures"
};

export const NaturalHistoryIntro = () => {
  const slateValue = htmlToSlate(kNaturalHistoryV5Intro);
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

export const NaturalHistoryPage3 = () => {
  const slateValue = htmlToSlate(kNaturalHistoryV5Page3);
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

export const MonteCarloRisk = () => {
  const slateValue = htmlToSlate(kMonteCarloRisk);
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

export const FieldMouseFurColorIntro = () => {
  const slateValue = htmlToSlate(kFieldMouseFurColorIntro);
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

export const OilAndWaterIntro = () => {
  const slateValue = htmlToSlate(kOilAndWaterIntro);
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
*/
