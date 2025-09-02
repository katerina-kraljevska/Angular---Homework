import { Component, signal } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Status, Todo, UpdateTodoDto } from '../../models/todo.model';
import { Router, ActivatedRoute } from '@angular/router';
import { TodoService } from '../../services/todo.service';
import { Subscription } from 'rxjs';
import { NonNullableFormBuilder } from '@angular/forms';

@Component({
  selector: 'app-edit-todo',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-todo.component.html',
  styleUrl: './edit-todo.component.scss',
})
export class EditTodoComponent {
  todoForm: FormGroup;
  status: Status[] = Object.values(Status);

  subscriptions: Subscription[] = [];

  constructor(
    private readonly router: Router,
    private readonly todoService: TodoService,
    private readonly fb: NonNullableFormBuilder, //instead of FormBuilder
    private readonly activeRoute: ActivatedRoute
  ) {}

  //lifecycle Hooks
  ngOnInit() {
    this.initializeForm();

    this.subscriptions.push(
      this.activeRoute.paramMap.subscribe((params) => {
        const id = params.get('id');
        if (id) {
          this.loadTodoEdit(id);
        }
      })
    );
    const id = this.activeRoute.snapshot.paramMap.get('id');

    if (id) {
      this.loadTodoEdit(id);
    }
  }

  loadTodoEdit(id: string) {
    this.subscriptions.push(
      this.todoService.getTodoById(id).subscribe({
        next: (todo) => {
          console.log('todo to edit', todo);

          if (todo) {
            console.log('TODO', todo);
            this.populateForm(todo);
          }
        },
        error: (error) => {
          console.log('Cannot find todo', error);
        },
      })
    );
  }

  private populateForm(todo: Todo) {
    this.todoForm.reset({
      title: todo.title,
      description: todo.description,
      status: todo.status,
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  //home navigation
  navigateHome() {
    this.router.navigate(['/']);
  }

  //Reactive form
  private initializeForm() {
    this.todoForm = this.fb.group({
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ]),
      description: new FormControl('', [Validators.required, Validators.minLength(10)]),
      status: new FormControl(Status.PENDING, Validators.required),
    });
  }

  //on submit
  onSubmit() {
    if (this.todoForm.invalid) {
      this.todoForm.markAllAsTouched();
      return;
    }

    const fromValues = this.todoForm.value;

    const updateTodoDto: UpdateTodoDto = {
      title: fromValues.title,
      description: fromValues.description,
      status: fromValues.status,
    };

    const id = this.activeRoute.snapshot.paramMap.get('id');
    if (!id) return;

    this.subscriptions.push(
      this.todoService.updateTodo(id, updateTodoDto).subscribe({
        next: (result) => {
          if (result) {
            console.log(result); //check if the data is being submitted
            this.navigateHome();
          }
        },

        error: (error) => {
          console.log('Error:', error);
        },
      })
    );
  }

  getFieldError(fieldName: string): string | null {
    const control = this.todoForm.get(fieldName);

    if (control && control.errors && control.touched) {
      const { errors } = control;

      if (control && control.errors && control.touched) {
        const { errors } = control;

        if (errors['required']) return `📢 ${fieldName} is required.`;
        if (errors['minlength'])
          return `📢 ${fieldName} must be at least ${errors['minlength'].requiredLength} characters.`;
        if (errors['maxlength'])
          return `📢 ${fieldName} must be up to ${errors['maxlength'].requiredLength} characters.`;
      }
    }
    return null;
  }
}
