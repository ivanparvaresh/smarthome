import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading } from 'ionic-angular';
import { Controller } from '../../providers/controller-service';
import { TabsPage } from '../tabs/tabs';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-splash',
  templateUrl: 'splash.html'
})
export class SplashPage {

  constructor(private controller: Controller, private nav: NavController) {
    this.checkController();
  }


  checkController() {

    if (this.controller.isInitiated) {

      if (this.controller.isAuthenticated) {
        this.nav.setRoot(TabsPage);
      } else {
        this.nav.setRoot(LoginPage);
      }

    } else {
      var me = this;
      setTimeout(function () {
        me.checkController();
      }, 1000);
    }

  }
}