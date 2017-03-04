import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading } from 'ionic-angular';
import { Controller } from '../../providers/controller-service';
import { User } from '../../providers/auth-service';
import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  loading: Loading;
  registerCredentials = { username: '', password: '' };

  constructor(
    private nav: NavController,
    private controller: Controller,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController) {

    if (this.controller.isAuthenticated) {
      this.nav.setRoot(TabsPage)
      return;
    }
  }

  public login() {
    this.showLoading();
    this.controller.login(this.registerCredentials.username, this.registerCredentials.password)
      .subscribe(resp => {
        console.log(resp);
        if (!resp) {
          this.showError("Access Denied");
        } else {
          setTimeout(() => {
            this.loading.dismiss();
            this.nav.setRoot(TabsPage)
          });
        }
      },
      error => {
        this.showError(error);
      });
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }

  showError(text) {
    setTimeout(() => {
      this.loading.dismiss();
    });

    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present(prompt);
  }
}