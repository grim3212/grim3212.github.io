import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'display-stack',
  templateUrl: './display-stack.component.html',
  styleUrls: ['./display-stack.component.css']
})
export class DisplayStackComponent implements OnInit {

  @Input() stack: any;

  constructor() { }

  ngOnInit() {
    if (!this.stack) {
      throw new Error('Attribute \'stack\' is required!');
    }
  }

  getImage(item: any, size: 32 | 64 | 128 | 160 | 256) {
    const itemPath = item.id.replace(':', '/');
    return `assets/grimpack/icons/${itemPath}/${item.meta}/${size}.png`;
  }

  getToolTip(item: any) {
    if (item.tooltip) {

      //Change the color of name
      if (item.tooltip[0].indexOf('<font') == -1) {
        item.tooltip[0] = `<font class="text-primary font-weight-bold">${item.tooltip[0]}</font>`;
      }

      //Build the tooltip
      let tooltip = '';
      for (const tip of item.tooltip) {
        tooltip += tip + '<br>';
      }

      return tooltip;
    }
    return `<font class="text-primary font-weight-bold">${item.name}</font>`;
  }
}
