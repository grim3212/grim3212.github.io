import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'config-entry',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {

  @Input() category: any;

  constructor() { }

  ngOnInit() {
    if (!this.category) {
      throw new Error('Attribute \'category\' is required!');
    }
  }
}
