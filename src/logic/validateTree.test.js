import { describe, it, expect } from 'vitest';
import { validateTree } from './validateTree.js';
import { NODE_TYPES } from '../constants.js';

describe('validateTree', () => {
  const createValidNode = (type, name, children) => ({
    type,
    name,
    path: `/${name}`,
    level: 0,
    ...(children && { children }),
  });

  it('should return Ok for a valid, simple tree', () => {
    const tree = createValidNode(NODE_TYPES.DIRECTORY, 'root', [
      createValidNode(NODE_TYPES.FILE, 'file.txt'),
    ]);
    const result = validateTree(tree);
    expect(result.isOk).toBe(true);
    expect(result.unwrap()).toEqual(tree);
  });

  it('should return Ok for a valid nested tree', () => {
    const tree = createValidNode(NODE_TYPES.DIRECTORY, 'root', [
      createValidNode(NODE_TYPES.DIRECTORY, 'src', [
        createValidNode(NODE_TYPES.FILE, 'index.js'),
      ]),
    ]);
    const result = validateTree(tree);
    expect(result.isOk).toBe(true);
  });

  it('should return Err for a node with a missing type', () => {
    const tree = { name: 'invalid', path: '/p', level: 0 };
    const result = validateTree(tree);
    expect(result.isErr).toBe(true);
  });

  it('should return Err for a node with an invalid type', () => {
    const tree = createValidNode('invalid_type', 'root');
    const result = validateTree(tree);
    expect(result.isErr).toBe(true);
  });

  it('should return Err for a node with a missing name', () => {
    const tree = { type: NODE_TYPES.FILE, path: '/p', level: 0 };
    const result = validateTree(tree);
    expect(result.isErr).toBe(true);
  });

  it('should return Err for a nested node being invalid', () => {
    const tree = createValidNode(NODE_TYPES.DIRECTORY, 'root', [
      { type: NODE_TYPES.FILE, path: '/p', level: 1 }, // Missing name
    ]);
    const result = validateTree(tree);
    expect(result.isErr).toBe(true);
  });

  it('should return Err if children is not an array', () => {
    const tree = createValidNode(NODE_TYPES.DIRECTORY, 'root', {}); // children is object
    const result = validateTree(tree);
    expect(result.isErr).toBe(true);
  });
});
