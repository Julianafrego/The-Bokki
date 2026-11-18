import Database from '@tauri-apps/plugin-sql';
import type { JSONContent } from '@tiptap/core';
import { Notebook, NewNotebook } from '../models/Notebook.model';
import type { NotebookPageModel } from '../models/notebook-page.model';
import type { TextBoxModel } from '../models/text-box.model';
import type { NotebookContentModel } from '../models/notebook-content.model';
import { NotebookRepository } from './notebook.repository';
import { NotebookContentRepository } from './notebook-content.repository';

const migrations: string[] = [
  `create table if not exists notebooks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    color TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS notebook_pages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    notebook_id INTEGER NOT NULL,
    position INTEGER NOT NULL,
    title TEXT NOT NULL,

    UNIQUE (notebook_id, position),

    FOREIGN KEY (notebook_id)
      REFERENCES notebooks(id)
      ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS text_boxes (
    id TEXT PRIMARY KEY,
    page_id INTEGER NOT NULL,

    x REAL NOT NULL,
    y REAL NOT NULL,
    width REAL NOT NULL,
    height REAL NOT NULL,

    content TEXT NOT NULL,

    FOREIGN KEY (page_id)
        REFERENCES notebook_pages(id)
        ON DELETE CASCADE
  )`,
  `CREATE INDEX IF NOT EXISTS idx_text_boxes_page_id
    ON text_boxes(page_id)`


];

//the structure in the database
interface NotebookRow {
    id: number;
    title: string;
    description?: string;
    color: string;
    created_at: number;
    updated_at: number;
}

interface NotebookPageRow {
  id: number;
  notebook_id: number;
  position: number;
  title: string;
}

interface TextBoxRow {
  id: string;
  page_id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
}

// converts a notebook row to a notebook object
const toNotebook = (r: NotebookRow): Notebook => ({
    id: r.id,
    title: r.title,
    description: r.description ?? '',
    color: r.color,
    createdAt: new Date(r.created_at),
    updatedAt: new Date(r.updated_at),
});

export class SqliteRepository implements NotebookRepository, NotebookContentRepository {
    private dbPromise: Promise<Database> =  this.init();

    private async init(): Promise<Database> {

        const db = await Database.load('sqlite:notebooks.db');

        const [{user_version}] = await db.select<{user_version: number}[]>(
            'PRAGMA user_version');

        // apply migrations if necessary
        for (let i = user_version; i < migrations.length; i++) {
            await db.execute(migrations[i]);
            await db.execute(`PRAGMA user_version = ${i + 1}`);
        }
        return db;
    }

    // functions for shelf

    async getAllNotebooks(): Promise<Notebook[]> {
        const db = await this.dbPromise;
        const rows = await db.select<NotebookRow[]>(
            'SELECT * FROM notebooks ORDER BY updated_at DESC');
        return rows.map(toNotebook);
    }

    async getNotebookById(id: number): Promise<Notebook | null> {
        const db = await this.dbPromise;

        const row = await db.select<NotebookRow[]>(
            'SELECT * FROM notebooks WHERE id = $1', [id]);

        return row.length ? toNotebook(row[0]) : null;
    }

    async createNotebook(notebook: NewNotebook): Promise<Notebook> {
        const db = await this.dbPromise;
        const now = new Date().getTime();

        const row = await db.execute(
        'INSERT INTO notebooks (title, description, color, created_at, updated_at) VALUES ($1, $2, $3, $4, $5)', 
        [notebook.title, notebook.description ?? '', notebook.color, now, now]);
        
        return {
            id: row.lastInsertId as number,
            title: notebook.title,
            description: notebook.description,
            color: notebook.color,
            createdAt: new Date(now),
            updatedAt: new Date(now),
        }
    }

    async updateNotebook(notebook: Notebook): Promise<Notebook> {
        const db = await this.dbPromise;
        const now = new Date().getTime();

        const row = await db.execute(
            'UPDATE notebooks SET title = $1, description = $2, color = $3, updated_at = $4 WHERE id = $5', 
            [notebook.title, notebook.description, notebook.color, now, notebook.id]);
        
          if (row.rowsAffected === 0) throw new Error('Notebook not found');
            return { ...notebook, updatedAt: new Date(now)};
    }

    async deleteNotebook(id: number): Promise<void> {
        const db = await this.dbPromise;
        await db.execute('delete from notebooks where id = $1', [id]);
    }


    // functions for open notebook

    async ensureInitialPages(notebookId: number): Promise<void> {
        const db = await this.dbPromise;

        const rows = await db.select<{ total: number}[]>(
            'SELECT COUNT(*) as total FROM notebook_pages where notebook_id = $1', [notebookId]
        );

        if (rows[0].total > 0) return;

        await db.execute(
            'INSERT INTO notebook_pages (notebook_id, position, title) VALUES ($1, $2, $3)', [notebookId, 1, 'Untitled']
        )
    }

    async getNotebookContent( notebookId: number ): Promise<NotebookContentModel> {
        const db = await this.dbPromise;

        const pageRows = await db.select<NotebookPageRow[]>(
            'SELECT id, notebook_id, position, title FROM notebook_pages WHERE notebook_id = $1 ORDER BY position', [notebookId]
        );

        const textBoxRows = await db.select<TextBoxRow[]>(
            'SELECT tb.id, tb.page_id, tb.x, tb.y, tb.width, tb.height, tb.content FROM text_boxes tb INNER JOIN notebook_pages p ON p.id = tb.page_id WHERE p.notebook_id = $1', [notebookId]
        );

        const pages: NotebookPageModel[] = pageRows.map(row => ({
            id: row.id,
            notebookId: row.notebook_id,
            position: row.position,
            title: row.title,
        }));

        const textBoxes: TextBoxModel[] = textBoxRows.map(row => ({
            id: row.id,
            pageId: row.page_id,
            x: row.x,
            y: row.y,
            width: row.width,
            height: row.height,
            content: JSON.parse(row.content) as JSONContent,
        }));
        return { pages, textBoxes };
    }

    async saveTextBox(box: TextBoxModel): Promise<void> {
        const db = await this.dbPromise;

        await db.execute(
            'INSERT INTO text_boxes (id, page_id, x, y, width, height, content) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT(id) DO UPDATE SET page_id = excluded.page_id, x = excluded.x, y = excluded.y, width = excluded.width, height = excluded.height, content = excluded.content', 
            [
                box.id,
                box.pageId,
                box.x,
                box.y,
                box.width,
                box.height,
                JSON.stringify(box.content),
            ]
        );
    }

    async deleteTextBox(id: string): Promise<void> {
        const db = await this.dbPromise;

        await db.execute(
            'DELETE FROM text_boxes WHERE id = $1', [id]
        );
    }
}
