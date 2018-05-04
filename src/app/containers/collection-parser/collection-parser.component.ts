import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
  }

  getCollectionDetails() {
    if (this.collectionid) {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });

      this.http.get(`/api/steam/CollectionDetails/${this.collectionid}`, { headers: headers }).subscribe(data => {

        if (data['response']) {
          this.items = data['response'].collectiondetails[0].children;

          this.createTable();
        }
      });
    } else {

    }
  }

  createTable() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    //Create new list
    this.retrievedItems = [];
    for (const item of this.items) {
      this.http.get(`/api/steam/WorkshopDetails/${item.publishedfileid}`, { headers: headers }).subscribe(itemData => {
        if (itemData['response']) {
          this.retrievedItems.push(itemData['response'].publishedfiledetails[0]);
        }
      });
    }

    this.generated = true;
  }
}
