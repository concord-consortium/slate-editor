import React, { useCallback, useEffect, useState } from "react";
import { Descendant } from "slate";
import pretty from "pretty";
import { SlateContainer } from "../slate-container/slate-container";
import { slateToHtml, htmlToSlate } from "./html-serializer";
import { kFieldMouseFurColorIntro, kMonteCarloRisk, kNaturalHistoryV5Intro, kNaturalHistoryV5Page3,
          kOilAndWaterIntro } from "./lara-fixtures";
import "./serialization.stories.scss";

export default {
  title: "LARA Fixtures"
};

interface ILaraStoryProps {
  initialContent: string;
}
const LaraStory = ({ initialContent }: ILaraStoryProps) => {
  const [content, setContent] = useState("");
  // We can only convert between html and slate after the slate editor has been initialized
  useEffect(() => setContent(slateToHtml(htmlToSlate(initialContent))), [initialContent]);

  const handleChange = useCallback(function handleChange(children: Descendant[]) {
    setContent(slateToHtml(children));
  }, []);

  return (
    <div className="serialization-container">
      <div className="panel">
        <SlateContainer
          onChange={handleChange}
          // We can only convert between html and slate after the slate editor has been initialized
          value={() => htmlToSlate(initialContent)}
        />
      </div>
      <div className="panel output">
        <h3>Serialized HTML</h3>
        <pre>{pretty(content)}</pre>
      </div>
    </div>
  );
};

export const NaturalHistoryIntro = () => <LaraStory initialContent={kNaturalHistoryV5Intro} />;

export const NaturalHistoryPage3 = () => <LaraStory initialContent={kNaturalHistoryV5Page3} />;

export const MonteCarloRisk = () => <LaraStory initialContent={kMonteCarloRisk} />;

export const FieldMouseFurColorIntro = () => <LaraStory initialContent={kFieldMouseFurColorIntro} />;

export const OilAndWaterIntro = () => <LaraStory initialContent={kOilAndWaterIntro} />;
