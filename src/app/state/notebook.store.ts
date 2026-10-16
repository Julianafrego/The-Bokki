import { Injectable, inject, signal } from '@angular/core';
import { NotebookRepository } from '../data/notebook.repository';
import { NewNotebook, Notebook } from '../data/models';

@Injectable({ providedIn: 'root' })
export class NotebookStore {
    private repo = inject(NotebookRepository);

    private _notebooks = signal<Notebook[]>([]);
    private _loading =signal(false);
    private _error = signal<string | null>(null);

    //version only readonly  
    notebooks = this._notebooks.asReadonly();
    loading = this._loading.asReadonly();
    error = this._error.asReadonly();



    private async run(acao: () => Promise<void>) {
        this._loading.set(true);
        this._error.set(null);
        try {
            await acao();
        } catch (error) {
            console.error(error);
            this._error.set(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            this._loading.set(false);
        }
    }


    // method to load notebooks from repository, when signal is updated, the component will be notified
    async loadNotebooks() {
        await this.run(async () => {
            this._notebooks.set(await this.repo.getAllNotebooks());
        });
    }

    // method to create a notebook, when signal is updated, the component will be notified
    async createNotebook(data: NewNotebook) {
        await this.run(async () => {
           const criado = await this.repo.createNotebook(data);
            this._notebooks.update((notebooks) => [criado, ...notebooks]);
        });
    }

    // method to update a notebook, when signal is updated, the component will be notified
    async updateNotebook(notebook: Notebook) {
        await this.run(async () => {
            const atualizado = await this.repo.updateNotebook(notebook);
            this._notebooks.update(list => [atualizado, ...list.filter(n => n.id !== atualizado.id)]);
        });
    }
    
    // method to delete a notebook, when signal is updated, the component will be notified
    async deleteNotebook(id: number) {
        await this.run(async () => {
            await this.repo.deleteNotebook(id);
            this._notebooks.update(list => list.filter(n => n.id !== id));
        });
    }
    
}