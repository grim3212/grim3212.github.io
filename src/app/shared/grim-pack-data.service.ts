import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/observable/of'; //proper way to import the 'of' operator
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

@Injectable()
export class GrimPackDataService {

  //Never changes
  private data: any;
  private observable: Observable<any>;

  private versionData: any;
  private versionObservable: Observable<any>;

  /* Use latest values to start with */
  private mcversion: string;
  private version: string;
  private lang: string = 'en_us';

  private url: string;
  private oldurl: string;

  constructor(private http: HttpClient) {
  }

  public getData(): any {
    if (this.data) {
      // if `data` is available just return it as `Observable`
      return Observable.of(this.data);
    } else if (this.observable) {
      // if `this.observable` is set then the request is in progress
      // return the `Observable` for the ongoing request
      return this.observable;
    } else {
      if (!this.url) {
        //Make sure the url is valid

        // create the request, store the `Observable` for subsequent subscribers
        this.observable = this.loadVersions().flatMap(result => {
          //First set full version to get a proper url
          this.setFullVersion(result["latest-mc"], result["latest-mod"]);
          //Then perform the http request
          return this.http.get(this.url);
        }).map(response => {

          // when the cached data is available we don't need the `Observable` reference anymore
          this.observable = null;

          if (!response) {
            return "FAILURE";
          } else {
            return response;
          }
          // make it shared so more than one subscriber can get the result
        }).share();

        return this.observable;
      } else {
        // create the request, store the `Observable` for subsequent subscribers
        this.observable = this.http.get(this.url)
          .map(response => {

            // when the cached data is available we don't need the `Observable` reference anymore
            this.observable = null;

            if (!response) {
              return "FAILURE";
            } else {
              return response;
            }
            // make it shared so more than one subscriber can get the result
          }).share();

        return this.observable;
      }
    }
  }

  public loadVersions() {
    if (this.versionData) {
      // if `data` is available just return it as `Observable`
      return Observable.of(this.versionData);
    } else if (this.versionObservable) {
      // if `this.observable` is set then the request is in progress
      // return the `Observable` for the ongoing request
      return this.versionObservable;
    } else {
      // create the request, store the `Observable` for subsequent subscribers
      this.versionObservable = this.http.get('assets/grimpack/documentation/versions.json')
        .map(response => {
          // when the cached data is available we don't need the `Observable` reference anymore
          this.versionObservable = null;

          if (!response) {
            return "FAILURE";
          } else {
            return response;
          }
          // make it shared so more than one subscriber can get the result
        }).share();
      return this.versionObservable;
    }
  }

  public goodURL(): boolean {
    if (this.url)
      return true;
    return false;
  }

  public setVersion(version: string): boolean {
    this.version = version;
    return this.reload();
  }

  public setMCVersion(mcversion: string): boolean {
    this.mcversion = mcversion;
    return this.reload();
  }

  public setLang(lang: string): boolean {
    this.lang = lang;
    return this.reload();
  }

  public getMCVersion(): string {
    return this.mcversion;
  }

  public getVersion(): string {
    return this.version;
  }

  public getLang(): string {
    return this.lang;
  }

  public getFullVersion(): string {
    return `${this.mcversion}-${this.version}`;
  }

  public setFullVersion(mcversion: string, version: string, lang?: string): boolean {
    if (mcversion && version) {
      this.mcversion = mcversion;
      this.version = version;

      if (lang) {
        this.lang = lang;
      }
    }

    //Check if it is a different route
    return this.reload();
  }

  public reload(): boolean {
    if (this.oldurl === `assets/grimpack/documentation/Grim Pack-${this.mcversion}-${this.version}-${this.lang}.json`) {
      return false;
    } else {
      this.url = `assets/grimpack/documentation/Grim Pack-${this.mcversion}-${this.version}-${this.lang}.json`;
      this.oldurl = this.url;
      this.data = null;
      return true;
    }
  }
}
