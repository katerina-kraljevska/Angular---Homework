import { Status, Todo } from './todo.model'; // adjust path as needed

export const DATA: Todo[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    title: 'Buy groceries',
    description: 'Milk, eggs, bread, and fruit',
    status: Status.PENDING,
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Finish project report',
    description: 'Complete the final draft and send it to the supervisor',
    status: Status.IN_PROGRESS,
  },
  {
    id: '9f8c5c1a-4b7b-4a8b-8f29-5fbb67b2a001',
    title: 'Book dentist appointment',
    description: 'Schedule an appointment for next week',
    status: Status.COMPLETED,
  },
  {
    id: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
    title: 'Clean the house',
    description: 'Vacuum, dust, and mop the floors',
    status: Status.PENDING,
  },
  {
    id: '16fd2706-8baf-433b-82eb-8c7fada847da',
    title: 'Workout',
    description: '30 minutes of strength training',
    status: Status.IN_PROGRESS,
  },
];
