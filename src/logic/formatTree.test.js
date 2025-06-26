import { describe, expect, it } from "vitest";
import { ICONS, NODE_TYPES } from "../constants.js";
import { formatTree } from "./formatTree.js";

describe("formatTree", () => {
  it("should return an empty string for a null tree", () => {
    const result = formatTree(null);
    expect(result.isOk).toBe(true);
    expect(result.unwrap()).toBe("");
  });

  it("should format a single root node", () => {
    const tree = {
      type: NODE_TYPES.DIRECTORY,
      name: "root",
      level: 0,
      children: [],
    };
    const expected = `${ICONS.DIRECTORY} root`;
    const result = formatTree(tree);
    expect(result.unwrap()).toBe(expected);
  });

  it("should format a tree with one level of children", () => {
    const tree = {
      type: NODE_TYPES.DIRECTORY,
      name: "root",
      level: 0,
      children: [
        { type: NODE_TYPES.FILE, name: "file1.txt", level: 1 },
        { type: NODE_TYPES.DIRECTORY, name: "sub", level: 1, children: [] },
      ],
    };
    const expected = [
      `${ICONS.DIRECTORY} root`,
      `├── ${ICONS.FILE} file1.txt`,
      `└── ${ICONS.DIRECTORY} sub`,
    ].join("\n");
    const result = formatTree(tree);
    expect(result.unwrap()).toBe(expected);
  });

  it("should format a nested tree structure", () => {
    const tree = {
      type: NODE_TYPES.DIRECTORY,
      name: "app",
      level: 0,
      children: [
        { type: NODE_TYPES.FILE, name: "package.json", level: 1 },
        {
          type: NODE_TYPES.DIRECTORY,
          name: "src",
          level: 1,
          children: [{ type: NODE_TYPES.FILE, name: "index.js", level: 2 }],
        },
      ],
    };
    const expected = [
      `${ICONS.DIRECTORY} app`,
      `├── ${ICONS.FILE} package.json`,
      `└── ${ICONS.DIRECTORY} src`,
      `    └── ${ICONS.FILE} index.js`,
    ].join("\n");
    const result = formatTree(tree);
    expect(result.unwrap()).toBe(expected);
  });
});
