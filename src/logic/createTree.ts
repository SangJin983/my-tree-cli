import fs from "fs";
import path from "path";
import { NODE_TYPES } from "../constants";
import type { TreeNode } from "../data/tree.model";
import type { Result } from "../utils/result";
import { Err, Ok } from "../utils/result";

/**
 * 지정된 디렉토리 경로를 재귀적으로 스캔하여 TreeNode 구조를 생성합니다.
 * @param {string} directoryPath - 스캔할 디렉토리의 경로.
 * @param {number} currentLevel - 현재 트리의 깊이 (재귀 호출용).
 * @returns {TreeNode[]} - 생성된 자식 노드들의 배열.
 */
function scanDirectory(
  directoryPath: string,
  currentLevel: number = 0
): TreeNode[] {
  const items = fs.readdirSync(directoryPath);

  return items.map((item): TreeNode => {
    const fullPath = path.join(directoryPath, item);
    const stats = fs.statSync(fullPath); // CLI 애플리케이션이라 동기방식 채택(추후 개선)

    const node: TreeNode = {
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
 * 지정된 경로를 기반으로 트리 구조를 생성합니다.
 * @param {string} rootPath - 분석할 루트 디렉토리 경로.
 * @returns {Result<TreeNode, Error>} 성공 시 Ok<TreeNode>, 실패 시 Err<Error>
 */
export function createTree(rootPath: string): Result<TreeNode, Error> {
  try {
    const absolutePath = path.resolve(rootPath);

    const stats = fs.statSync(absolutePath);
    if (!stats.isDirectory()) {
      return Err(new Error(`Path is not a directory: ${absolutePath}`));
    }

    const rootName = path.basename(absolutePath);

    const rootNode: TreeNode = {
      type: "directory",
      name: rootName,
      path: absolutePath,
      level: 0,
      children: scanDirectory(absolutePath, 1),
    };

    return Ok(rootNode);
  } catch (error: any) {
    // ENOENT: 파일이나 디렉토리가 존재하지 않을 때 발생하는 에러 코드
    if (error?.code === "ENOENT") {
      return Err(new Error(`Directory not found: ${rootPath}`));
    }
    // 그 외의 에러는 그대로 전달
    return Err(error as Error);
  }
}
