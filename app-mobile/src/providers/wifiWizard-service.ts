import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable()
export class WifiWizardService {

    constructor() {
    }

    getCurrentSSID(){
        return Observable.create(observer=>{
            WifiWizard.getCurrentSSID(function(status){
                observer.next(status);
                observer.complete();
            },function(err){
                observer.error(err);
                observer.complete();
            });
        })
    }

}