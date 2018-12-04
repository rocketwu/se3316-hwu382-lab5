import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DcmaComponent } from './dcma.component';

describe('DcmaComponent', () => {
  let component: DcmaComponent;
  let fixture: ComponentFixture<DcmaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DcmaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DcmaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
