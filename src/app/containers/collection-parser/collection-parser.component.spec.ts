/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CollectionParserComponent } from './collection-parser.component';

describe('CollectionParserComponent', () => {
  let component: CollectionParserComponent;
  let fixture: ComponentFixture<CollectionParserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionParserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionParserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
