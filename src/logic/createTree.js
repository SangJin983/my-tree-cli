import fs from "fs";
import path from "path";
import { NODE_TYPES } from "../constants.js";
import { Err, Ok, Result } from "../utils/result.js";

/**
 * @typedef {import('../data/tree.model').TreeNode} TreeNode
 */

/**
 * 지정된 디렉토리 경로를 재귀적으로 스캔하여 TreeNode 구조를 생성합니다.
 * @param {string} directoryPath - 스캔할 디렉토리의 경로.
 * @param {number} [currentLevel=0] - 현재 트리의 깊이 (재귀 호출용).
 * @returns {TreeNode[]} - 생성된 자식 노드들의 배열.
 */
function scanDirectory(directoryPath, currentLevel = 0) {
  const items = fs.readdirSync(directoryPath);

  return items.map((item) => {
    const fullPath = path.join(directoryPath, item);
    const stats = fs.statSync(fullPath); // CLI 환경을 전제하고 있기에 동기방식 사용 (추후 개선 가능)

    /** @type {TreeNode} */
    const node = {
      type: stats.isDirectory() ? NODE_TYPES.DIRECTORY : NODE_TYPES.FILE,
      name: item,
      path: fullPath,
      level: currentLevel,
    };

    if (node.type === "directory") {
      node.children = scanDirectory(fullPath, currentLevel + 1);
    }

    return node;
  });
}

/**
 * @param {string} rootPath
 * @returns {Result} 성공 시 Ok<TreeNode>, 실패 시 Err<Error>
 */
export function createTree(rootPath) {
  try {
    const absolutePath = path.resolve(rootPath);
    if (
      !fs.existsSync(absolutePath) ||
      !fs.statSync(absolutePath).isDirectory()
    ) {
      return Err(
        new Error(`Directory not found or is not a directory: ${absolutePath}`)
      );
    }

    const rootName = path.basename(absolutePath);

    /** @type {TreeNode} */
    const rootNode = {
      type: "directory",
      name: rootName,
      path: absolutePath,
      level: 0,
      children: scanDirectory(absolutePath, 1),
    };

    return Ok(rootNode);
  } catch (error) {
    return Err(error);
  }
}
