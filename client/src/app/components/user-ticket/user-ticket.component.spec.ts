import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTicketComponent } from './user-ticket.component';

describe('UserTicketComponent', () => {
  let component: UserTicketComponent;
  let fixture: ComponentFixture<UserTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
