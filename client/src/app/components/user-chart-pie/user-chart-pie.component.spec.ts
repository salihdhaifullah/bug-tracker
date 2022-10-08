import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserChartPieComponent } from './user-chart-pie.component';

describe('UserChartPieComponent', () => {
  let component: UserChartPieComponent;
  let fixture: ComponentFixture<UserChartPieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserChartPieComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserChartPieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
