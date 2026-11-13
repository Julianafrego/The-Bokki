import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { NotebookRepository } from './data/repository/notebook.repository';
import { SqliteRepository } from './data/repository/sqlite.repository';
import { provideHotToastConfig } from '@ngxpert/hot-toast';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(), 
    provideRouter(routes),
    {
      provide: NotebookRepository, useFactory: () => new SqliteRepository() 
    },
    provideHotToastConfig(),
  ]
};
