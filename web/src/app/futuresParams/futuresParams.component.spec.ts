/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FuturesParamsComponent } from './futuresParams.component';

describe('FuturesParamsComponent', () => {
  let component: FuturesParamsComponent;
  let fixture: ComponentFixture<FuturesParamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuturesParamsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuturesParamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
