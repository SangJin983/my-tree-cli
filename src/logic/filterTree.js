import { NODE_TYPES } from "../constants.js";
import { Err, Ok } from "../utils/result.js";

/**
 * @typedef {import('../data/tree.model.js').TreeNode} TreeNode
 */

/**
 * 트리 노드와 그 자식들을 재귀적으로 필터링하는 헬퍼 함수입니다.
 * @param {TreeNode} node - 필터링할 현재 노드.
 * @param {Set<string>} excludeSet - 제외할 이름들의 Set.
 * @returns {TreeNode | null} - 필터링 후 살아남은 노드 또는 제외된 경우 null.
 */
function filterNodeRecursive(node, excludeSet) {
  if (excludeSet.has(node.name)) {
    return null;
  }

  if (node.type === NODE_TYPES.DIRECTORY && node.children) {
    const newChildren = node.children
      .map((child) => filterNodeRecursive(child, excludeSet))
      .filter(Boolean);
    return { ...node, children: newChildren };
  }

  return { ...node };
}

/**
 * TreeNode 객체를 받아서, 제외 목록에 따라 필터링된 새로운 TreeNode 객체를 반환합니다.
 * @param {TreeNode} tree - 필터링할 원본 트리 노드.
 * @param {string[]} excludeList - 제외할 파일/폴더 이름의 배열.
 * @returns {Result<TreeNode | null>} - 성공 시 필터링된 트리(Ok<TreeNode|null>)를, 실패 시 에러(Err<Error>)를 반환합니다.
 */
export function filterTree(tree, excludeList = []) {
  try {
    if (!tree || typeof tree !== "object") {
      return Err(new Error("Invalid input: tree must be a non-null object."));
    }
    const excludeSet = new Set(excludeList);
    const filteredTree = filterNodeRecursive(tree, excludeSet);
    return Ok(filteredTree);
  } catch (error) {
    const errorMessage = `An unexpected error occurred during filtering. The input data might be corrupted. Original error: ${error.message}`;
    return Err(new Error(errorMessage));
  }
}
