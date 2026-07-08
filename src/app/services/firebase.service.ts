import { Injectable, signal } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getRemoteConfig, getValue, fetchAndActivate } from 'firebase/remote-config';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  showCategoriesFeature = signal<boolean>(true);
  isFirebaseActive = signal<boolean>(false);
  usingLocalOverride = signal<boolean>(false);

  constructor() {
    this.initFirebase();
  }

  private async initFirebase() {
    if (!environment.firebase || !environment.firebase.apiKey) {
      return;
    }

    try {
      const app = initializeApp(environment.firebase);
      const remoteConfig = getRemoteConfig(app);

      remoteConfig.settings.minimumFetchIntervalMillis = 10000;
      remoteConfig.defaultConfig = {
        show_categories_feature: true
      };

      await fetchAndActivate(remoteConfig);
      const val = getValue(remoteConfig, 'show_categories_feature').asBoolean();

      if (!this.usingLocalOverride()) {
        this.showCategoriesFeature.set(val);
      }
      this.isFirebaseActive.set(true);
    } catch (e) {
      this.isFirebaseActive.set(false);
    }
  }

  toggleOverride(value: boolean) {
    this.usingLocalOverride.set(true);
    this.showCategoriesFeature.set(value);
  }

  resetOverride() {
    this.usingLocalOverride.set(false);
    this.initFirebase();
  }
}
