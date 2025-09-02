import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of, throwError } from 'rxjs';
import { CreateTodoDto, Todo, UpdateTodoDto } from '../models/todo.model';
import { v4 as uuid } from 'uuid';
import { DATA } from '../models/todo.mock.data';
@Injectable({
  providedIn: 'root',
})
export class TodoService {
  constructor() {}

  private todoSubject = new BehaviorSubject<Todo[]>(DATA);
  private todos$ = this.todoSubject.asObservable();

  //get all todos
  getAllTodos() {
    return this.todos$;
  }

  // find one todo
  getTodoById(id: string): Observable<Todo | undefined> {
    return this.todos$.pipe(map((todos) => todos.find((todo) => todo.id === id)));
  }

  //create new todo
  createTodo(createTodoDto: CreateTodoDto): Observable<Todo> {
    const newTodo: Todo = {
      ...createTodoDto,
      id: uuid(),
    };

    const currentTodos = this.todoSubject.value;
    this.todoSubject.next([...currentTodos, newTodo]);

    return of(newTodo);
  }

  //update
  updateTodo(id: string, updateTodoDto: UpdateTodoDto): Observable<boolean> {
    const currentTodos = this.todoSubject.value;

    const todoExists = currentTodos.find((todo) => todo.id === id);

    if (!todoExists) return throwError(() => new Error(`Todo not found`));

    const updatedTodos = currentTodos.map((todo) => {
      if (todo.id !== id) return todo;

      const { title, description, status } = updateTodoDto;

      const updatedTodo: Todo = {
        ...todo,
        ...updateTodoDto,
      };
      return updatedTodo;
    });

    this.todoSubject.next(updatedTodos);
    return of(true);
  }

  //delete
  deleteTodo(id: string): Observable<boolean> {
    const todos = this.todoSubject.value;
    const todoExists = todos.some((todo) => todo.id === id);

    if (!todoExists) return throwError(() => new Error(`Todo not found`));

    const updatedTodos = todos.filter((todo) => todo.id !== id);
    this.todoSubject.next(updatedTodos);
    return of(true);
  }
}
