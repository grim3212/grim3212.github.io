import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';
import { LinkService } from './shared/link.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, OnDestroy {

  // This will go at the END of your title for example "Home - Angular Universal..." <-- after the dash (-)
  private endPageTitle: string = 'Grim3212';
  // If no Title is provided, we'll use a default one before the dash(-)
  private defaultPageTitle: string = 'Grim3212';
  public navbarCollapsed: boolean = true;

  private routerSub$: Subscription;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private title: Title,
    private meta: Meta,
    private linkService: LinkService
  ) {
  }

  ngOnInit() {
    // Change "Title" on every navigationEnd event
    // Titles come from the data.title property on all Routes (see app.routes.ts)
    this._changeTitleOnNavigation();
  }

  ngOnDestroy() {
    // Subscription clean-up
    this.routerSub$.unsubscribe();
  }

  private _changeTitleOnNavigation() {
    this.routerSub$ = this.router.events
      .filter(event => event instanceof NavigationEnd)
      .map(() => this.activatedRoute)
      .map(route => {
        while (route.firstChild) route = route.firstChild;
        return route;
      })
      .filter(route => route.outlet === 'primary')
      .map(route => route.snapshot.data)
      .subscribe((event) => {
        this._setMetaAndLinks(event);
      });
  }

  private _setMetaAndLinks(event) {
    if (event['data']) {
      event = event['data'];
    }

    //Get optional endTitle, used by Grim Pack routes
    const endTitle = event['endTitle'] ? event['endTitle'] : this.endPageTitle;

    // Set Title if available, otherwise leave the default Title
    const title = event['title']
      ? `${event['title']} - ${endTitle}`
      : `${this.defaultPageTitle} - ${endTitle}`;

    this.title.setTitle(title);

    const metaData = event['meta'] || [];
    const linksData = event['links'] || [];

    for (let i = 0; i < metaData.length; i++) {
      this.meta.updateTag(metaData[i]);
    }

    for (let i = 0; i < linksData.length; i++) {
      this.linkService.addTag(linksData[i]);
    }
  }

  get year(): number {
    var d = new Date();
    return d.getFullYear();
  }
}

