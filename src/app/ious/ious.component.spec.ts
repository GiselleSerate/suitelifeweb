import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IousComponent } from './ious.component';

describe('IousComponent', () => {
  let component: IousComponent;
  let fixture: ComponentFixture<IousComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IousComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IousComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
