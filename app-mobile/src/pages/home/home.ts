
import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading } from 'ionic-angular';
import { Controller, Device, DeviceCommand } from '../../providers/controller-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

  loading: Loading;
  time: string = "00:00";
  isNight: boolean = false;
  device: Device;

  constructor(
    public navCtrl: NavController,
    private controller: Controller,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController) {
  }

  updateTime() {
    var currentTime = new Date();
    this.time =
      currentTime.getHours() + ":" + currentTime.getMinutes();
    if (currentTime.getHours() > 19 || currentTime.getHours() < 8) {
      this.isNight = true;
    } else {
      this.isNight = false;
    }
  }

  execCommand(command: DeviceCommand) {
    this._showLoading();
    this.controller.sendCommand(command)
      .subscribe(result => {
        this.loading.dismiss();
      }, (err) => {
        this._showError(err);
      })
  }


  _showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }

  _showError(text) {
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

  ngOnInit(): void {
    var me = this;

    this.device = this.controller.device;
    setInterval(function () {
      me.updateTime();
    }, 5000);
  }

}
