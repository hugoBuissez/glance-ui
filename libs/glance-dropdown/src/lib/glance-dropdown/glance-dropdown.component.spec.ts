import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GlanceDropdownComponent } from './glance-dropdown.component';

describe('GlanceDropdownComponent', () => {
  let component: GlanceDropdownComponent;
  let fixture: ComponentFixture<GlanceDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlanceDropdownComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GlanceDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
