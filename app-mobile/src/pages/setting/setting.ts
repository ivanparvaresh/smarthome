
import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading } from 'ionic-angular';
import { ApiService } from '../../providers/api-service';

@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html'
})
export class SettingPage {



  constructor(
    public navCtrl: NavController,
    private api: ApiService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController) {
  }

}
