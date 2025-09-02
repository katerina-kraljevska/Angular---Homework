import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Status, CreateTodoDto } from '../../models/todo.model';
import { Subscription } from 'rxjs';
import { TodoService } from '../../services/todo.service';
import { Router } from '@angular/router';
import { NonNullableFormBuilder } from '@angular/forms';

@Component({
  selector: 'app-create-todo.component',
  imports: [ReactiveFormsModule],
  templateUrl: './create-todo.component.html',
  styleUrl: './create-todo.component.scss',
})
export class CreateTodoComponent {
  todoForm: FormGroup;
  status: Status[] = Object.values(Status);

  subscriptions: Subscription[] = [];

  constructor(
    private readonly router: Router,
    private readonly todoService: TodoService,
    private readonly fb: NonNullableFormBuilder //instead of FormBuilder
  ) {}

  //lyfecycleHooks
  ngOnInit() {
    this.initializeForm();
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

    const createTodoDto: CreateTodoDto = {
      title: fromValues.title,
      description: fromValues.description,
      status: fromValues.status,
    };
    this.subscriptions.push(
      this.todoService.createTodo(createTodoDto).subscribe({
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
