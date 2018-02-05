/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SomethingWrongComponent } from './something-wrong.component';

describe('SomethingWrongComponent', () => {
  let component: SomethingWrongComponent;
  let fixture: ComponentFixture<SomethingWrongComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SomethingWrongComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SomethingWrongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
