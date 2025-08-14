import {
  Component,
  OnDestroy,
  OnInit,
  signal,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
}

@Component({
  selector: 'app-task-manager-component',
  imports: [CommonModule, FormsModule],
  templateUrl: './task-manager-component.html',
  styleUrl: './task-manager-component.css',
})
export class TaskManagerComponent implements OnInit, OnDestroy {
  tasks = signal<Task[]>([]);
  newTask = '';
  description = '';

  //lifecycle hooks
  ngOnInit(): void {
    console.log(`Task manager inicialized`);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('Changes detected:', changes);
  }
  ngOnDestroy(): void {
    console.log(`Task manager destroyed`);
  }

  addTask() {
    if (this.newTask !== '') {
      //if the input is not empty
      this.tasks.update((tasks) => [
        ...tasks,
        {
          id: tasks.length + 1,
          title: this.newTask,
          description: this.description,
          completed: false,
        },
      ]);
    } else {
      alert('Create a task. You are missing the title');
      return;
    }
  }

  //mark the tasks as done
  markTask(id: number) {
    this.tasks.update((current) =>
      current.map((task, i) =>
        i === id ? { ...task, completed: !task.completed } : task
      )
    );
    //console log the change
    console.log(`Task ${id} is completed`);
  }

  clearTasks() {
    this.tasks.set([]);
    console.log('All tasks are cleared');
  }

  //completed and non completed tasks
  countComplitedTasks() {
    return this.tasks().filter((task) => task.completed === true).length;
  }

  countIncomplitedTasks() {
    return this.tasks().filter((task) => task.completed === false).length;
  }
}
