/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GrimPackComponent } from './grim-pack.component';

describe('GrimPackComponent', () => {
  let component: GrimPackComponent;
  let fixture: ComponentFixture<GrimPackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrimPackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrimPackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
