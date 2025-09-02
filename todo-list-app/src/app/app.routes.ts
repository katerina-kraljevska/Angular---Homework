import { Routes } from '@angular/router';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { CreateTodoComponent } from './components/create-todo/create-todo.component';
import { EditTodoComponent } from './components/edit-todo/edit-todo.component';

export const routes: Routes = [
  { path: '', component: TodoListComponent },
  { path: 'add-todo', component: CreateTodoComponent },
  { path: 'edit-todo/:id', component: EditTodoComponent },
];
