import { Injectable, signal, effect } from '@angular/core';
import { Task, Category } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private tasksKey = 'tasks_data';
  private categoriesKey = 'categories_data';

  tasks = signal<Task[]>([]);
  categories = signal<Category[]>([]);

  constructor() {
    this.loadInitialData();

    effect(() => {
      localStorage.setItem(this.tasksKey, JSON.stringify(this.tasks()));
    });

    effect(() => {
      localStorage.setItem(this.categoriesKey, JSON.stringify(this.categories()));
    });
  }

  private loadInitialData() {
    const savedTasks = localStorage.getItem(this.tasksKey);
    const savedCategories = localStorage.getItem(this.categoriesKey);

    let parsedCategories: Category[] = [];
    if (savedCategories) {
      parsedCategories = JSON.parse(savedCategories);
    } else {
      parsedCategories = [
        { id: 'cat-1', name: 'Personal', color: '#3880ff' },
        { id: 'cat-2', name: 'Trabajo', color: '#2dd36f' },
        { id: 'cat-3', name: 'Ideas', color: '#eb445a' }
      ];
    }
    this.categories.set(parsedCategories);

    let parsedTasks: Task[] = [];
    if (savedTasks) {
      parsedTasks = JSON.parse(savedTasks);
    } else {
      parsedTasks = [
        { id: 'task-1', title: 'Completar prueba técnica', completed: false, categoryId: 'cat-2', createdAt: Date.now() },
        { id: 'task-2', title: 'Comprar víveres', completed: true, categoryId: 'cat-1', createdAt: Date.now() - 3600000 }
      ];
    }
    this.tasks.set(parsedTasks);
  }

  addTask(title: string, categoryId?: string) {
    const newTask: Task = {
      id: 'task-' + Math.random().toString(36).substring(2, 9),
      title: title.trim(),
      completed: false,
      categoryId,
      createdAt: Date.now()
    };
    this.tasks.update(tasks => [newTask, ...tasks]);
  }

  toggleTask(id: string) {
    this.tasks.update(tasks =>
      tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    );
  }

  deleteTask(id: string) {
    this.tasks.update(tasks => tasks.filter(t => t.id !== id));
  }

  addCategory(name: string, color: string) {
    const newCategory: Category = {
      id: 'cat-' + Math.random().toString(36).substring(2, 9),
      name: name.trim(),
      color
    };
    this.categories.update(categories => [...categories, newCategory]);
  }

  updateCategory(id: string, name: string, color: string) {
    this.categories.update(categories =>
      categories.map(c => c.id === id ? { ...c, name: name.trim(), color } : c)
    );
  }

  deleteCategory(id: string) {
    this.categories.update(categories => categories.filter(c => c.id !== id));
    this.tasks.update(tasks =>
      tasks.map(t => t.categoryId === id ? { ...t, categoryId: undefined } : t)
    );
  }
}
