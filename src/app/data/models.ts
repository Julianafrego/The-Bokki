
export abstract class Notebook {
  abstract id: number;
  abstract title: string;
  abstract description?: string;
  abstract color: string;
  abstract createdAt: Date;
  abstract updatedAt: Date;
}

export type NewNotebook = Pick<Notebook, 'title' | 'description' | 'color'>;