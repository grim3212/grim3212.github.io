import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Data } from '@angular/router';
import { GrimPackDataService } from './grim-pack-data.service';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/first';

@Injectable()
export class GrimPackDataResolve implements Resolve<any> {

  constructor(private gpData: GrimPackDataService) { }

  resolve(route: ActivatedRouteSnapshot) {
    const partName = route.paramMap.get('partName');
    const partSection = route.paramMap.get('section');

    if (partName) {
      return this.gpData.getData().map(result => {
        if (result) {
          for (let i = 0; i < result.parts.length; i++) {
            if (result.parts[i].id === partName) {
              if (!partSection) {
                return {
                  title: result.parts[i].name,
                  endTitle: 'Grim Pack',
                  meta: [{ name: 'description', content: this.removeHTML(result.parts[i].info) }],
                  links: [
                    { rel: 'canonical', href: `https://grim3212.com/grim-pack/${partName}` }
                  ]
                };

              } else {
                for (let j = 0; j < result.parts[i].chapters.length; j++) {
                  if (result.parts[i].chapters[j].id === partSection) {
                    return {
                      title: `${result.parts[i].chapters[j].name} - ${result.parts[i].name}`,
                      endTitle: 'Grim Pack',
                      meta: [{ name: 'description', content: this.removeHTML(result.parts[i].chapters[j].info) }],
                      links: [
                        { rel: 'canonical', href: `https://grim3212.com/grim-pack/${partName}/${partSection}` }
                      ]
                    };
                  }
                }
              }
            }
          }
        }

      }, error => {
        console.error(error);
        return 'FAILURE';
      }).first();
    }

    return 'FAILURE';
  }

  private removeHTML(input: string): string {
    if (input) {
      const result = input.replace(/<\/?[^>]+>/gi, ''); //removing html tag using regex pattern
      return result;
    }
  }
}
