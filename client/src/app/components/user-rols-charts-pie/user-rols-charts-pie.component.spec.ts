import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRolsChartsPieComponent } from './user-rols-charts-pie.component';

describe('UserRolsChartsPieComponent', () => {
  let component: UserRolsChartsPieComponent;
  let fixture: ComponentFixture<UserRolsChartsPieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserRolsChartsPieComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserRolsChartsPieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
