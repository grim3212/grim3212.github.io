import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { GrimPackDataService } from '../../shared/grim-pack-data.service';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-grim-pack',
  templateUrl: './grim-pack.component.html',
  styleUrls: ['./grim-pack.component.css']
})
export class GrimPackComponent implements OnInit {

  private partName: string;
  private partSection: string;
  private data: any;

  public jsonLoaded = false;
  private overviewPage = false;
  private partPage = false;
  private chapterPage = false;

  private part: any;
  private chapter: any;

  private toggleAll = false;

  private stats = {
    parts: 0,
    chapters: 0,
    pages: 0
  };

  private versions: any;
  private langs: string[];

  /* Used to store and retrieve html */
  //TODO: Change htmls from basic strings to dynamic templates
  //to take advantage of angular directives
  private htmls: Map<string, any> = new Map<string, any>();

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private gpData: GrimPackDataService) {
    //Setup everything on first creation
    if (!this.gpData.goodURL()) {
      this.gpData.loadVersions().subscribe(result => {
        this.setVersion(result['latest-mc'], result['latest-mod']);
        this.getStats();
      }, error => {
        console.error(error);
      });
    }

    this.route.params.subscribe((param) => {
      this.partName = param['partName'];
      this.partSection = param['section'];

      if (this.gpData.goodURL()) {
        this.setupPage(this.partName, this.partSection);
      }
    });

    if (this.gpData.goodURL()) {
      this.getStats();
    }

    this.loadVersions();
  }

  private loadVersions() {
    this.gpData.loadVersions().subscribe(result => {
      if (result) {
        this.versions = result.versions;
        this.langs = this.getLangs();
      }
    }, error => {
      this.router.navigate(['/something-wrong']);
    });
  }

  ngOnInit() {
  }

  //TODO: Construct anchors and a separate opposite column for the anchors on each chapter page
  public buildPartArray(numColumns: number) {
    const arrOfarr = [];
    //We start at 1 to skip information from showing on the main page
    for (let i = 1; i < this.data.parts.length; i += numColumns) {
      const row = [];
      for (let x = 0; x < numColumns; x++) {
        const value = this.data.parts[i + x];
        if (!value) {
          break;
        }
        row.push(value);
      }
      arrOfarr.push(row);
    }
    return arrOfarr;
  }

  private getStats() {
    this.gpData.getData().subscribe(result => {
      if (result) {
        this.stats.parts = result.parts.length;

        for (let i = 0; i < result.parts.length; i++) {
          this.stats.chapters += result.parts[i].chapters.length;

          for (let j = 0; j < result.parts[i].chapters.length; j++) {
            this.stats.pages += result.parts[i].chapters[j].pages.length;
          }
        }
      }
    }, error => {
      console.log('Stats could not be gathered!');
      console.log(error);
    });
  }

  public setupPage(partId, chapterId?) {
    this.gpData.getData().subscribe(result => {
      if (result) {
        this.data = result;
      }

      //console.log(this.data);

      if (partId) {
        //Get part number
        for (let i = 0; i < result.parts.length; i++) {
          if (result.parts[i].id === partId) {
            this.part = result.parts[i];

            if (chapterId) {
              //This is a chapter page
              this.chapterPage = true;
              const part = result.parts[i];

              //Get chapter number
              for (let j = 0; j < part.chapters.length; j++) {
                if (part.chapters[j].id === chapterId) {
                  this.chapter = part.chapters[j];

                  for (let k = 0; k < this.chapter.pages.length; k++) {
                    const info = this.chapter.pages[k].info;
                    if (info && info.endsWith('.html')) {
                      //Check if we have already cache the html
                      if (!this.htmls.has(info)) {
                        this.getHTMLString(info).subscribe(data => {
                          //Save the html into the map
                          this.htmls.set(info, data);
                        }, (err) => {
                          console.error(`Couldn't find file '${info}'`);
                        });
                      }
                    }
                  }

                  break;
                }
              }
              if (!this.chapter) {
                console.log(`Couldn't find chapter ${chapterId}.`);

                //Page doesn't exist
                this.router.navigate(['/404']);
              }
              break;
            } else {
              //This is a part page
              this.partPage = true;
            }
            break;
          }
        }
        if (!this.part) {
          console.log(`Couldn't find chapter ${partId}.`);

          //Page doesn't exist
          this.router.navigate(['/404']);
        }
      } else {
        //This is the overview page
        this.overviewPage = true;
      }

      //Once finished mark loaded
      this.jsonLoaded = true;
    }, error => {
      //TODO: Send somewhere went wrong
      this.router.navigate(['/something-wrong']);
    });
  }

  getRecipeName(recipe: any) {
    return this.data[`${recipe.recipeType}`];
  }

  /*
  * Load the provided location as a string
  * used for getting the html files for some pages
  */
  getHTMLString(loc: string): Observable<Object> {
    return this.http.get(loc, { responseType: 'text' });
  }

  public getLangs() {
    for (let i = 0; i < this.versions.length; i++) {
      if (this.versions[i]['mcversion'] === this.gpData.getMCVersion()) {
        for (let j = 0; j < this.versions[i]['modversions'].length; j++) {
          if (this.versions[i]['modversions'][j]['version'] === this.gpData.getVersion()) {
            return this.versions[i]['modversions'][j]['langs'];
          }
        }
      }
    }

    return Array();
  }

  public setVersion(mcversion: string, version: string) {
    //If new url re-setup page
    if (this.gpData.setFullVersion(mcversion, version)) {
      this.setupPage(this.partName, this.partSection);
    }
  }

  public setLang(lang: string) {
    //If new url re-setup page
    if (this.gpData.setLang(lang)) {
      this.setupPage(this.partName, this.partSection);
    }
  }
}
