import { ICONS, NODE_TYPES, PREFIXES } from "../constants";
import type { TreeNode } from "../data/tree.model";
import type { Result } from "../utils/result";
import { Err, Ok } from "../utils/result";

/**
 * TreeNode 객체를 사람이 읽기 좋은 들여쓰기된 문자열로 변환합니다.
 * @param {TreeNode | null} tree - 포맷팅할 트리 노드. null일 경우 빈 문자열을 반환합니다.
 * @returns {Result<string, Error>} - 성공 시 포맷팅된 문자열(Ok<string>)을, 실패 시 에러(Err<Error>)를 반환합니다.
 */
export function formatTree(tree: TreeNode | null): Result<string, Error> {
  try {
    if (!tree) {
      return Ok("");
    }

    // 최종 문자열의 각 라인을 담을 배열입니다.
    const lines: string[] = [];

    /**
     * 노드 배열을 재귀적으로 순회하며 lines 배열에 포맷팅된 문자열을 추가합니다.
     * @param {TreeNode[]} nodes - 처리할 노드의 배열.
     * @param {string} prefix - 현재 깊이의 들여쓰기 접두사.
     */
    function formatNodesRecursive(nodes: TreeNode[], prefix: string): void {
      for (const [i, node] of nodes.entries()) {
        // .entries()로 인덱스와 값을 동시에 얻음
        const isLast = i === nodes.length - 1;

        const connector = isLast ? PREFIXES.END : PREFIXES.BRANCH;
        const icon =
          node.type === NODE_TYPES.DIRECTORY ? ICONS.DIRECTORY : ICONS.FILE;

        lines.push(`${prefix}${connector}${icon} ${node.name}`);

        if (
          node.type === NODE_TYPES.DIRECTORY &&
          node.children &&
          node.children.length > 0
        ) {
          const nextPrefix = prefix + (isLast ? PREFIXES.EMPTY : PREFIXES.LINE);
          formatNodesRecursive(node.children, nextPrefix);
        }
      }
    }

    lines.push(`${ICONS.DIRECTORY} ${tree.name}`); // 첫번째 라인

    if (tree.children) {
      formatNodesRecursive(tree.children, "");
    }

    return Ok(lines.join("\n"));
  } catch (error) {
    const errorMessage = `An unexpected error occurred during formatting. Original error: ${
      (error as Error).message
    }`;
    return Err(new Error(errorMessage));
  }
}
