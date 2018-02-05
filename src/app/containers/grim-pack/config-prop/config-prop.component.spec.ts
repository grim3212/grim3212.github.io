import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigPropComponent } from './config-prop.component';

describe('ConfigPropComponent', () => {
  let component: ConfigPropComponent;
  let fixture: ComponentFixture<ConfigPropComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigPropComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigPropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
