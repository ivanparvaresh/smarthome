import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';

@Injectable()
export class ApiService {

    public token: string;
    private baseAddress = "http://46.209.213.156:3000/api/1";

    constructor(private http: Http) {
    }

    login(username, password) {
        return Observable.create(observer => {
            return this.http.post(this.baseAddress + "/login", {
                username: username,
                password: password
            }).subscribe(
                (res) => {
                    var result = res.json();
                    if (result.err) {
                        observer.next(false);
                    } else {
                        observer.next(result.data);
                    }
                    observer.complete();
                },
                (err) => {
                    observer.error(false);
                })
        });

    }
    validate(token) {
        return Observable.create(observer => {
            this.http.post(this.baseAddress + "/validate", {
                token: token
            }).subscribe(res => {
                var result: any = res.json();

                if (result.err) {
                    observer.error(false);
                } else {
                    observer.next(true);
                }
                observer.complete();

            }, (err) => {
                observer.error(false);
            })
        })
    }

    sendCommand(name) {
        return Observable.create(observer => {
            this.http.post(this.baseAddress + "/command", {
                name: name,
                token: this.token
            }).subscribe(res => {
                var result: any = res.json();
                if (result.err) {
                    observer.error(false);
                } else {
                    observer.next(true);
                }
                observer.complete();

            }, (err) => {
                observer.error(false);
            })
        });
    }

    setClaim(claims){
        return Observable.create(observer => {
            this.http.post(this.baseAddress + "/claims/update", {
                token: this.token,
                claims:claims
            }).subscribe(res => {
                var result: any = res.json();
                if (result.err) {
                    observer.error(false);
                } else {
                    observer.next(true);
                }
                observer.complete();

            }, (err) => {
                observer.error(false);
            })
        });
    }

}