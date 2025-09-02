import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Todo } from '../../models/todo.model';
import { TodoService } from '../../services/todo.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-todo-list',
  imports: [RouterLink],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss',
})
export class TodoListComponent {
  allTodos = signal<Todo[]>([]);

  constructor(private readonly todoService: TodoService) {}

  private subscriptions = new Subscription();

  ngOnInit() {
    this.subscriptions.add(
      this.todoService.getAllTodos().subscribe((data) => this.allTodos.set(data))
    );
  }

  trackById(index: number, todo: Todo): string {
    return todo.id;
  }

  ngOnDestroy() {
    return this.subscriptions.unsubscribe();
  }

  deleteTodo(id: string) {
    if (confirm('Are you sure you want to delte this todo')) {
      this.todoService.deleteTodo(id).subscribe({
        next: (success) => {
          if (success) {
            console.log('Success delete');
          }
        },
        error: (err) => {
          console.error('Error deleting todo', err);
        },
      });
    }
  }
}
