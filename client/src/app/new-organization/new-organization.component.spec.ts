import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewOrganizationComponent } from './new-organization.component';

describe('NewOrganizationComponent', () => {
  let component: NewOrganizationComponent;
  let fixture: ComponentFixture<NewOrganizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewOrganizationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
