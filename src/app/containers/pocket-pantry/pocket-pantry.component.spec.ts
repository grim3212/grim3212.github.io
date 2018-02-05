/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PocketPantryComponent } from './pocket-pantry.component';

describe('PocketPantryComponent', () => {
  let component: PocketPantryComponent;
  let fixture: ComponentFixture<PocketPantryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PocketPantryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PocketPantryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
