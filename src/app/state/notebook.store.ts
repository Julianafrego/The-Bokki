import { Injectable, inject, signal } from '@angular/core';
import { NotebookRepository } from '../data/notebook.repository';
import { NewNotebook, Notebook } from '../data/models';
import { HotToastService } from '@ngxpert/hot-toast';

@Injectable({ providedIn: 'root' })
export class NotebookStore {
    private repo = inject(NotebookRepository);
    private toast = inject(HotToastService);

    private _notebooks = signal<Notebook[]>([]);
    private _loading =signal(false);
    private _error = signal<string | null>(null);

    //version only readonly  
    notebooks = this._notebooks.asReadonly();
    loading = this._loading.asReadonly();
    error = this._error.asReadonly();



    private async run(acao: () => Promise<void>, erroMsg: string): Promise<boolean> {
        this._loading.set(true);
        try {
            await acao();
            return true;
        } catch (error) {
            console.error(error);
            this.toast.error(erroMsg);
            return false;
        } finally {
            this._loading.set(false);
        }
    }


    // method to load notebooks from repository, when signal is updated, the component will be notified
    async loadNotebooks() {
        await this.run(async () => {
            this._notebooks.set(await this.repo.getAllNotebooks());
        }, 'could not load the Books.');
    }

    // method to create a notebook, when signal is updated, the component will be notified
    async createNotebook(data: NewNotebook) {
        const ok = await this.run(async () => {
           const criado = await this.repo.createNotebook(data);
            this._notebooks.update((notebooks) => [criado, ...notebooks]);
        }, 'Could not create the Bokki.');

        if (ok) this.toast.success('The Bokki was created!');
        return ok;
    }

    // method to update a notebook, when signal is updated, the component will be notified
    async updateNotebook(notebook: Notebook) {
        const ok = await this.run(async () => {
            const atualizado = await this.repo.updateNotebook(notebook);
            this._notebooks.update(list => [atualizado, ...list.filter(n => n.id !== atualizado.id)]);
        }, 'could not save the changes.');

        if (ok) this.toast.success('Changes saved!');
        return ok;
    }
    
    // method to delete a notebook, when signal is updated, the component will be notified
    async deleteNotebook(id: number) {
        const ok = await this.run(async () => {
            await this.repo.deleteNotebook(id);
            this._notebooks.update(list => list.filter(n => n.id !== id));
        }, 'Could not delete your bokki.');

        if (ok) this.toast.success('Bokki deleted.');
        return ok;
    }
    
}