import type { TreeNode } from "../data/tree.model";
import { TreeNodeSchema } from "../data/tree.model";
import type { Result } from "../utils/result";
import { Err, Ok } from "../utils/result";

/**
 * TreeNode 객체의 구조가 올바른지 Zod 스키마를 사용해 유효성을 검사합니다.
 * @param {unknown} tree - 검사할 원본 트리 노드. 타입이 불확실한 외부 데이터로 간주합니다.
 * @returns {Result<TreeNode, Error>}
 */
export function validateTree(tree: unknown): Result<TreeNode, Error> {
  const validationResult = TreeNodeSchema.safeParse(tree);

  if (validationResult.success) {
    return Ok(validationResult.data);
  } else {
    // Zod 에러를 좀 더 읽기 쉬운 형태로 변환하여 가독성을 높입니다.
    const errorMessage = validationResult.error.errors
      .map((e) => `[${e.path.join(".")}] ${e.message}`)
      .join("\n");

    return Err(new Error(`Invalid tree structure:\n${errorMessage}`));
  }
}
