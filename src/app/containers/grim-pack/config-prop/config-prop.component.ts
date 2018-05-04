import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'config-prop',
  templateUrl: './config-prop.component.html',
  styleUrls: ['./config-prop.component.css']
})
export class ConfigPropComponent implements OnInit {

  @Input() prop: any;

  constructor() { }

  ngOnInit() {
    if (!this.prop) {
      throw new Error('Attribute \'prop\' is required!');
    }
  }

}
