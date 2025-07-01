import { NODE_TYPES } from '../constants';
import type { TreeNode } from '../data/tree.model';
import type { Result } from '../utils/result';
import { Err, Ok } from '../utils/result';

/**
 * 트리 노드와 그 자식들을 재귀적으로 필터링하는 헬퍼 함수입니다.
 * @param {TreeNode} node - 필터링할 현재 노드.
 * @param {Set<string>} excludeSet - 제외할 이름들의 Set.
 * @returns {TreeNode | null} - 필터링 후 살아남은 노드 또는 제외된 경우 null.
 */
function filterNodeRecursive(node: TreeNode, excludeSet: Set<string>): TreeNode | null {
  if (excludeSet.has(node.name)) {
    return null;
  }

  if (node.type === NODE_TYPES.DIRECTORY && node.children) {
    const newChildren = node.children
      .map((child) => filterNodeRecursive(child, excludeSet))
      .filter((child): child is TreeNode => child !== null); // 'filter(Boolean)'을 타입 가드로 개선

    // 자식이 모두 필터링되어 사라졌을 수 있으므로, children 배열을 새로 할당합니다.
    return { ...node, children: newChildren };
  }

  // 파일이거나 자식이 없는 디렉토리인 경우
  return { ...node };
}

/**
 * TreeNode 객체를 받아서, 제외 목록에 따라 필터링된 새로운 TreeNode 객체를 반환합니다.
 * @param {TreeNode} tree - 필터링할 원본 트리 노드.
 * @param {string[]} excludeList - 제외할 파일/폴더 이름의 배열.
 * @returns {Result<TreeNode | null, Error>} - 성공 시 필터링된 트리(Ok<TreeNode|null>)를, 실패 시 에러(Err<Error>)를 반환합니다.
 */
export function filterTree(tree: TreeNode, excludeList: string[] = []): Result<TreeNode | null, Error> {
  try {
    // 입력 tree가 null이나 undefined일 경우를 대비한 방어 코드
    if (!tree) {
      return Err(new Error("Invalid input: tree must be a non-null object."));
    }
    const excludeSet = new Set(excludeList);
    const filteredTree = filterNodeRecursive(tree, excludeSet);
    return Ok(filteredTree);
  } catch (error) {
    // 'strict' 모드에서 error는 'unknown' 타입이므로, Error 객체로 캐스팅하여 사용합니다.
    const errorMessage = `An unexpected error occurred during filtering. Original error: ${(error as Error).message}`;
    return Err(new Error(errorMessage));
  }
}