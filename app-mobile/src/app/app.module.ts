import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { BackgroundMode } from 'ionic-native';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { SettingPage } from '../pages/setting/setting'
import { SplashPage } from '../pages/splash/splash'

import { ApiService } from '../providers/api-service';
import { Controller } from '../providers/controller-service';
import { Background } from '../providers/background-service';
import { WifiWizardService } from '../providers/wifiWizard-service'




@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TabsPage,
    LoginPage,
    SettingPage,
    SplashPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TabsPage,
    LoginPage,
    SettingPage,
    SplashPage
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    Storage,
    Controller, ApiService,Background,WifiWizardService]
})
export class AppModule { 

  constructor(){
    BackgroundMode.enable();
  }

}
