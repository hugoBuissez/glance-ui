import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GlanceTooltipComponent } from './glance-tooltip.component';

describe('GlanceTooltipComponent', () => {
  let component: GlanceTooltipComponent;
  let fixture: ComponentFixture<GlanceTooltipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlanceTooltipComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GlanceTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
