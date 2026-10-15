// para o tauri
import Database from '@tauri-apps/plugin-sql';
import { Notebook, NewNotebook } from './models';
import { NotebookRepository } from './notebook.repository';

const migrations: string[] = [
  `create table if not exists notebooks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    color TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  )`,
];

//notebookrow represents the structure of a notebook row in the database, with createdAt and updatedAt as numbers (timestamps)
interface NotebookRow {
    id: number;
    title: string;
    description?: string;
    color: string;
    created_at: number;
    updated_at: number;
    //createdat and updatedat are numbers because sqlite doesn't support date types, BD save as integer (timestamp), and we convert to Date when returning to the user
}

// toNotebook converts a notebook row to a notebook object, converting createdAt and updatedAt from numbers (timestamps) to Date objects
const toNotebook = (r: NotebookRow): Notebook => ({
    id: r.id,
    title: r.title,
    description: r.description ?? '',
    color: r.color,
    createdAt: new Date(r.created_at),
    updatedAt: new Date(r.updated_at),
});

export class SqliteRepository implements NotebookRepository {
    //open a promise to the database, in the start the function init() is called to initialize the database and apply migrations if necessary
    //promise cause we have a object that is not ready yet, and we need to wait for it to be ready before using it
    private dbPromise: Promise<Database> =  this.init();

    private async init(): Promise<Database> {
        // open the database, if it doesn't exist, it will be created
        const db = await Database.load('sqlite:notebooks.db');

        // verify database version
        const [{user_version}] = await db.select<{user_version: number}[]>(
            'PRAGMA user_version');

        // apply migrations if necessary
        for (let i = user_version; i < migrations.length; i++) {
            await db.execute(migrations[i]);
            await db.execute(`PRAGMA user_version = ${i + 1}`);
        }
        return db;
    }

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
}
