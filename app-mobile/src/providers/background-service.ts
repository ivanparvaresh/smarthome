import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Alert, NavController, ToastController } from 'ionic-angular';
import { LocalNotifications } from 'ionic-native';
import { WifiWizardService } from './wifiWizard-service';
import { ApiService } from './api-service';

@Injectable()
export class Background {

    private offline = Observable.fromEvent(document, "offline");
    private online = Observable.fromEvent(document, "online");

    constructor(
        private wifiService: WifiWizardService,
        private api: ApiService,
        private toast: ToastController) {
    }

    start() {
        var me = this;

        this.offline.subscribe(() => {
            console.log("Going to offline");
            LocalNotifications.schedule({
                id: Math.random(),
                title: 'YOUR OFFLINE',
                text: 'Your connection is offline',
                at: new Date(),
            });
        });

        this.online.subscribe(() => {
            console.log("Wifi enabled");

            setTimeout(function () {
                me.wifiService.getCurrentSSID().subscribe(ssid => {

                    LocalNotifications.schedule({
                        id: Math.random(),
                        title: 'YOUR ONLINE',
                        text: 'You have connected to [' + ssid + ']',
                        at: new Date(),
                    });

                    console.log("\t ssid:", ssid);
                    me.api.setClaim([{
                        name: '/wifi/ssid',
                        value: ssid
                    }]).subscribe(result => {
                        console.log("done");
                    })
                },(err)=>{
                    console.log(err);
                });
            }, 5000)

        });
    }

}