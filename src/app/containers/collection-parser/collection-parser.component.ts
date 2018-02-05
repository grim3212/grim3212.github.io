import { Component, OnInit, Injector } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APP_BASE_HREF } from '@angular/common';
import { Http, Headers, RequestOptions } from '@angular/http';

@Component({
  selector: 'app-collection-parser',
  templateUrl: './collection-parser.component.html',
  styleUrls: ['./collection-parser.component.css']
})
export class CollectionParserComponent implements OnInit {

  public collectionid;
  public items;
  public retrievedItems;
  public generated = false;
  private baseUrl: string;

  constructor(private http: HttpClient, private injector: Injector) {
    this.baseUrl = "";
  }

  ngOnInit() {
  }

  getCollectionDetails() {
    if (this.collectionid) {
      let headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });

      this.http.get(`/api/steam/CollectionDetails/${this.collectionid}`, { headers: headers }).subscribe(data => {

        if (data["response"]) {
          this.items = data["response"].collectiondetails[0].children;

          this.createTable();
        }
      });
    } else {

    }
  }

  createTable() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    //Create new list
    this.retrievedItems = [];
    for (let item of this.items) {
      this.http.get(`/api/steam/WorkshopDetails/${item.publishedfileid}`, { headers: headers }).subscribe(itemData => {
        if (itemData["response"]) {
          this.retrievedItems.push(itemData["response"].publishedfiledetails[0]);
        }
      });
    }

    this.generated = true;
  }
}
