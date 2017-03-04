import { Injectable } from '@angular/core';
import { ApiService } from './api-service';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import  { Background } from './background-service';


export class DeviceTriggerRule {
    claim: string;
    op: string;
    value: string;
}
export class DeviceTrigger {
    name: string;
    action: string;
    data: any;
}
export class DeviceCommandAction {
    action: string;
    data: any;
}
export class DeviceCommand {
    name: string;
    actions: DeviceCommandAction[];
}
export class Device {
    id: string;
    name: string;
    username: string;
    token: string;
    commands: DeviceCommand[];
    triggers: DeviceTrigger[];

}

@Injectable()
export class Controller {



    isInitiated: boolean;
    isAuthenticated: boolean;
    device: Device;

    constructor(
        private api: ApiService,
        private storage: Storage,
        private background : Background) {

        var me = this;
        this.storage.get("DEVICE").then(function (deviceString) {
            if (deviceString == null) {
                me.isInitiated = true;
                me.isAuthenticated = false;
                me.device = null;
                return;
            }
            var device: Device = JSON.parse(deviceString);
            if (device == null) {
                me.isInitiated = true;
                me.isAuthenticated = false;
                me.device = null;
                return;
            }

            api.validate(device.token)
                .subscribe(result => {
                    if (result == true) {
                        me.isInitiated = true;
                        me.isAuthenticated = true;
                        background.start();
                        me.device = device;
                        me.api.token = me.device.token;
                    } else {
                        me.isInitiated = true;
                        me.isAuthenticated = false;
                        me.device = null;
                    }
                });
        });

        // offlie and online 
    }

    login(username, password): Observable<boolean> {
        return Observable.create(observer => {
            this.api.login(username, password)
                .subscribe(data => {
                    if (data == false) {
                        observer.next(false)
                    } else {
                        this.device = data;
                        this.api.token = this.device.token;
                        this.storage.set("DEVICE", JSON.stringify(this.device));
                        observer.next(true);
                        observer.complete();
                    }
                });
        })
    }

    sendCommand(command: DeviceCommand) {
        return this.api.sendCommand(command.name);
    }
}