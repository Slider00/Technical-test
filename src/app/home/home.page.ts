import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonList, 
  IonItem, 
  IonLabel, 
  IonCheckbox, 
  IonButton, 
  IonIcon, 
  IonInput, 
  IonSelect, 
  IonSelectOption, 
  IonChip, 
  IonModal, 
  IonCard, 
  IonCardContent, 
  IonToggle, 
  IonButtons,
  IonSearchbar,
  IonToast
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, trashOutline, createOutline, settingsOutline, closeOutline, checkmarkOutline, sunnyOutline, moonOutline, cloudDoneOutline, cloudOfflineOutline } from 'ionicons/icons';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { TodoService } from '../services/todo.service';
import { FirebaseService } from '../services/firebase.service';
import { Category } from '../models/todo.model';
import { TRANSLATIONS } from '../models/i18n.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonList, 
    IonItem, 
    IonLabel, 
    IonCheckbox, 
    IonButton, 
    IonIcon, 
    IonInput, 
    IonSelect, 
    IonSelectOption, 
    IonChip, 
    IonModal, 
    IonCard, 
    IonCardContent, 
    IonToggle, 
    IonButtons,
    IonSearchbar,
    IonToast
  ],
})
export class HomePage {
  todoService = inject(TodoService);
  firebaseService = inject(FirebaseService);

  newTaskTitle = signal<string>('');
  newTaskCategoryId = signal<string>('');
  selectedFilterCategoryId = signal<string>('all');

  newCategoryName = signal<string>('');
  newCategoryColor = signal<string>('#3880ff');

  editingCategoryId = signal<string | null>(null);
  editingCategoryName = signal<string>('');
  editingCategoryColor = signal<string>('#3880ff');

  searchQuery = signal<string>('');
  isDarkMode = signal<boolean>(false);
  isToastOpen = signal<boolean>(false);
  currentLanguage = signal<'es' | 'en'>('es');
  t = computed(() => TRANSLATIONS[this.currentLanguage()]);

  filteredTasks = computed(() => {
    let list = this.todoService.tasks();
    const filter = this.selectedFilterCategoryId();
    const query = this.searchQuery().trim().toLowerCase();

    if (this.firebaseService.showCategoriesFeature() && filter !== 'all') {
      list = list.filter(t => t.categoryId === filter);
    }
    if (query) {
      list = list.filter(t => t.title.toLowerCase().includes(query));
    }

    return [...list].sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      return b.createdAt - a.createdAt;
    });
  });

  totalTasksCount = computed(() => this.filteredTasks().length);
  completedTasksCount = computed(() => this.filteredTasks().filter(t => t.completed).length);
  completionPercentage = computed(() => {
    const total = this.totalTasksCount();
    if (total === 0) return 0;
    return Math.round((this.completedTasksCount() / total) * 100);
  });

  categories = computed(() => this.todoService.categories());
  showCategoriesFeature = computed(() => this.firebaseService.showCategoriesFeature());
  isFirebaseActive = computed(() => this.firebaseService.isFirebaseActive());
  usingLocalOverride = computed(() => this.firebaseService.usingLocalOverride());

  constructor() {
    addIcons({ addOutline, trashOutline, createOutline, settingsOutline, closeOutline, checkmarkOutline, sunnyOutline, moonOutline, cloudDoneOutline, cloudOfflineOutline });
    this.initTheme();
    this.initLanguage();
  }

  initLanguage() {
    const saved = localStorage.getItem('language_preference');
    if (saved === 'en' || saved === 'es') {
      this.currentLanguage.set(saved);
    } else {
      const browserLang = navigator.language.substring(0, 2);
      this.currentLanguage.set(browserLang === 'en' ? 'en' : 'es');
    }
  }

  toggleLanguage() {
    const nextLang = this.currentLanguage() === 'es' ? 'en' : 'es';
    this.currentLanguage.set(nextLang);
    localStorage.setItem('language_preference', nextLang);
  }

  initTheme() {
    const saved = localStorage.getItem('theme_preference');
    let isDark = false;
    if (saved) {
      isDark = saved === 'dark';
    } else {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    this.isDarkMode.set(isDark);
    this.applyTheme(isDark);
  }

  toggleTheme() {
    const nextDark = !this.isDarkMode();
    this.isDarkMode.set(nextDark);
    localStorage.setItem('theme_preference', nextDark ? 'dark' : 'light');
    this.applyTheme(nextDark);
  }

  private applyTheme(isDark: boolean) {
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.classList.toggle('ion-palette-dark', isDark);
  }

  async addTask() {
    const title = this.newTaskTitle();
    if (!title || !title.trim()) {
      return;
    }
    if (this.showCategoriesFeature() && !this.newTaskCategoryId()) {
      this.isToastOpen.set(true);
      return;
    }
    const categoryId = this.showCategoriesFeature() ? this.newTaskCategoryId() : undefined;
    this.todoService.addTask(title, categoryId || undefined);
    this.newTaskTitle.set('');
    const filter = this.selectedFilterCategoryId();
    this.newTaskCategoryId.set(filter !== 'all' ? filter : '');
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (e) {}
  }

  async toggleTask(id: string) {
    this.todoService.toggleTask(id);
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (e) {}
  }

  async deleteTask(id: string) {
    this.todoService.deleteTask(id);
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch (e) {}
  }

  addCategory() {
    const name = this.newCategoryName();
    const color = this.newCategoryColor();
    if (!name || !name.trim()) {
      return;
    }
    this.todoService.addCategory(name, color);
    this.newCategoryName.set('');
    this.newCategoryColor.set('#3880ff');
  }

  startEditCategory(category: Category) {
    this.editingCategoryId.set(category.id);
    this.editingCategoryName.set(category.name);
    this.editingCategoryColor.set(category.color);
  }

  cancelEditCategory() {
    this.editingCategoryId.set(null);
    this.editingCategoryName.set('');
    this.editingCategoryColor.set('#3880ff');
  }

  updateCategory() {
    const id = this.editingCategoryId();
    const name = this.editingCategoryName();
    const color = this.editingCategoryColor();
    if (!id || !name || !name.trim()) {
      return;
    }
    this.todoService.updateCategory(id, name, color);
    this.cancelEditCategory();
  }

  deleteCategory(id: string) {
    this.todoService.deleteCategory(id);
    if (this.selectedFilterCategoryId() === id) {
      this.selectedFilterCategoryId.set('all');
    }
    if (this.newTaskCategoryId() === id) {
      this.newTaskCategoryId.set('');
    }
  }

  selectFilterCategory(id: string) {
    this.selectedFilterCategoryId.set(id);
    if (id !== 'all') {
      this.newTaskCategoryId.set(id);
    } else {
      this.newTaskCategoryId.set('');
    }
  }

  toggleFirebaseOverride(ev: any) {
    this.firebaseService.toggleOverride(ev.detail.checked);
  }

  resetFirebaseOverride() {
    this.firebaseService.resetOverride();
    this.selectedFilterCategoryId.set('all');
  }

  getCategoryColor(categoryId?: string): string {
    if (!categoryId) {
      return '#8a8a8a';
    }
    const cat = this.categories().find(c => c.id === categoryId);
    return cat ? cat.color : '#8a8a8a';
  }

  getCategoryName(categoryId?: string): string {
    if (!categoryId) {
      return '';
    }
    const cat = this.categories().find(c => c.id === categoryId);
    return cat ? cat.name : '';
  }
}
