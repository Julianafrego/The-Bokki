import type { JSONContent } from '@tiptap/core';

export interface TextBoxModel {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  content: JSONContent;
}