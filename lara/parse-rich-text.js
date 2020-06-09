#!/usr/bin/env node

/*
  This script processes a dump of LARA authored rich text content to test how well
  importing it into the SlateEditor is likely to go. The format expected by the script
  is a CSV file with these headers:
  "table_name","field","id","page_id","activity_id","text"
  where:
  - table_name: "interactive_pages", "embeddable_multiple_choices", "embeddable_open_responses", ...
  - field: "content", "prompt", "sidebar", "text", ...
  - id:
  - page_id: the id of the page
  - activity_id: the id of the activity
  - text: the authored text contents
*/

const csv = require('csv-parser');
const fs = require('fs');
const htmlparser2 = require("htmlparser2");
const _ = require("lodash");
const results = [];

const qTags = new Set(["iframe", "font", "style", "script", "o:p", "input", "source",
                        "meta", "link", "html", "video", "embed", "page", "diagram"]);
const qActivities = {};

let activities = new Set();
let currentActivityId;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let currentPageId;
const tags = {};
const attrs = {};
const classes = {};
const parser = new htmlparser2.Parser({
  onopentagname(name) {
    const n = name.toLowerCase();
    if (!tags[n]) tags[n] = 1;
    else ++tags[n];

    if (qTags.has(n)) {
      const activity = qActivities[currentActivityId] || {};
      if (!activity[n]) activity[n] = 1;
      else ++activity[n];
      !qActivities[currentActivityId] && (qActivities[currentActivityId] = activity);
    }
  },
  onattribute(name, value) {
    const n = name.toLowerCase();
    if (!attrs[n]) attrs[n] = 1;
    else ++attrs[n];
    if (name === "class") {
      value.trim().split(" ").forEach(c => {
        if (c) {
          if (!classes[c]) classes[c] = 1;
          else ++classes[c];
        }
      });
    }
  }
});

fs.createReadStream('./lara-rich-text-2020-06-02.csv')
  .pipe(csv())
  .on('data', data => {
    results.push(data);
    currentActivityId = data.activity_id;
    currentPageId = data.page_id;
    activities.add(currentActivityId);
    parser.parseComplete(data.text);
  })
  .on('end', () => {
    console.log("Entries processed:", results.length);
    console.log("Unique tags:", _.size(tags));
    console.log("<script> tags:", tags.script);
    console.log("<style> tags:", tags.style);
    console.log("Unique attrs:", _.size(attrs));
    console.log("Unique classes:", _.size(classes));
    console.log("Total activities:", activities.size);
    console.log("Suspicious activities:", _.size(qActivities));

    console.log("\nTags\n----");
    _.map(tags, (count, tag) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .forEach(entry => {
        console.log(`<${entry.tag}>: ${entry.count}`);
      });

    console.log("\nAttrs\n-----");
    _.map(attrs, (count, attr) => ({ attr, count }))
      .sort((a, b) => b.count - a.count)
      .forEach(entry => {
        console.log(`"${entry.attr}": ${entry.count}`);
      });

    console.log("\nClasses\n--------");
    _.map(classes, (count, _class) => ({ _class, count }))
      .sort((a, b) => b.count - a.count)
      .forEach(entry => {
        console.log(`"${entry._class}": ${entry.count}`);
      });

    console.log("\nActivities\n----------");
    _.map(qActivities, (_tags, id) => ({ id, count: _.reduce(_tags, (sum, count, tag) => sum + count, 0) }))
      .sort((a, b) => b.count - a.count)
      .forEach(entry => {
        const qAct = qActivities[entry.id];
        const qActTags = _.map(qAct, (count, tag) => `${tag}: ${count}`);
        console.log(`"${entry.id}": ${entry.count} { ${qActTags.join(", ")} }`);
      });

    console.log("\nEntries processed:", results.length);
    console.log("Unique tags:", _.size(tags));
    console.log("<script> tags:", tags.script);
    console.log("<style> tags:", tags.style);
    console.log("Unique attrs:", _.size(attrs));
    console.log("Unique classes:", _.size(classes));
    console.log("Total activities:", activities.size);
    console.log("Suspicious activities:", _.size(qActivities));
  });
