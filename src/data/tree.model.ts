import { z } from 'zod';
import { NODE_TYPES } from '../constants';

const baseNodeSchema = z.object({
  type: z.enum([NODE_TYPES.FILE, NODE_TYPES.DIRECTORY]),
  name: z.string(),
  path: z.string(),
  level: z.number(),
});

export interface TreeNode extends z.infer<typeof baseNodeSchema> {
  children?: TreeNode[];
}

export const TreeNodeSchema: z.ZodType<TreeNode> = baseNodeSchema.extend({
  children: z.lazy(() => TreeNodeSchema.array()).optional(),
});
