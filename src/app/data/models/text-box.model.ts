import type { JSONContent } from '@tiptap/core';

export interface TextBoxModel {
  id: string;
  pageId: number;
  x: number;
  y: number;
  width: number;
  height: number;
  content: JSONContent;
}