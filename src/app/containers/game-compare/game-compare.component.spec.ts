/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GameCompareComponent } from './game-compare.component';

describe('GameCompareComponent', () => {
  let component: GameCompareComponent;
  let fixture: ComponentFixture<GameCompareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameCompareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
