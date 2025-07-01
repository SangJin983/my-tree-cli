export const NODE_TYPES = Object.freeze({
  FILE: 'file',
  DIRECTORY: 'directory',
} as const);

export type NodeType = (typeof NODE_TYPES)[keyof typeof NODE_TYPES];

export const ICONS = Object.freeze({
  FILE: '📄',
  DIRECTORY: '📁',
});

export const PREFIXES = Object.freeze({
  BRANCH: '├── ',
  END: '└── ',
  LINE: '│   ',
  EMPTY: '    ',
});