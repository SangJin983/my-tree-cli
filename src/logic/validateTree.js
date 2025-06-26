import { Ok, Err } from '../utils/result.js';
import { NODE_TYPES } from '../constants.js';

/**
 * @typedef {import('../data/tree.model.js').TreeNode} TreeNode
 */

/**
 * 트리 노드와 그 자식들을 재귀적으로 유효성 검사하는 헬퍼 함수입니다.
 * @param {TreeNode} node - 검사할 현재 노드.
 * @returns {boolean} - 노드가 유효하면 true, 아니면 false.
 */
function isNodeValid(node) {
  if (!node || typeof node !== 'object') return false;

  const hasValidType = typeof node.type === 'string' && Object.values(NODE_TYPES).includes(node.type);
  const hasValidName = typeof node.name === 'string' && node.name.length > 0;

  if (!hasValidType || !hasValidName) {
    return false;
  }

  if (node.type === NODE_TYPES.DIRECTORY) {
    if (node.children && Array.isArray(node.children)) {
      // 모든 자식 노드가 유효한지 재귀적으로 확인
      return node.children.every(isNodeValid);
    } else if (node.children) {
      // children이 있지만 배열이 아닌 경우
      return false;
    }
    // children이 없는 경우도 유효함
  }

  return true;
}

/**
 * TreeNode 객체의 구조가 올바른지 유효성을 검사합니다.
 * @param {TreeNode} tree - 검사할 원본 트리 노드.
 * @returns {import('../utils/result.js').Result<TreeNode, Error>}
 */
export function validateTree(tree) {
  if (!isNodeValid(tree)) {
    return Err(new Error('Invalid tree structure. A node is missing required properties or has the wrong type.'));
  }
  return Ok(tree);
}
