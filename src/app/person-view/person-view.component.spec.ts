import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonViewComponent } from './person-view.component';

describe('PersonViewComponent', () => {
  let component: PersonViewComponent;
  let fixture: ComponentFixture<PersonViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
