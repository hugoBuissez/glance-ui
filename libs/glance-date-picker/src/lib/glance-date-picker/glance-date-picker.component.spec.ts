import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GlanceDatePickerComponent } from './glance-date-picker.component';
import { addDays, subDays, subYears } from 'date-fns';

describe('GlanceDatePickerComponent', () => {
  let component: GlanceDatePickerComponent;
  let fixture: ComponentFixture<GlanceDatePickerComponent>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(GlanceDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    jest.spyOn(component.rangeChange, 'emit');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct default values', () => {
    expect(component.WEEK_DAYS).toEqual([
      'Mo',
      'Tu',
      'We',
      'Th',
      'Fr',
      'Sa',
      'Su',
    ]);
    expect(component.disableFrom()).toBeNull();
    expect(component.double()).toBe(true);
    expect(component.selectedStartDate()).toBeNull();
    expect(component.selectedEndDate()).toBeNull();
  });

  it('should select a start date', () => {
    const date = new Date();
    component.selectDate(date);
    expect(component.selectedStartDate()).toEqual(date);
    expect(component.selectedEndDate()).toBeNull();

    expect(component.rangeChange.emit).toHaveBeenCalledWith([date, date]);
  });

  it('should select a start and end date', () => {
    const startDate = new Date();
    const endDate = addDays(startDate, 5);
    component.selectDate(startDate);
    component.selectDate(endDate);
    expect(component.selectedStartDate()).toEqual(startDate);
    expect(component.selectedEndDate()).toEqual(endDate);

    expect(component.rangeChange.emit).toHaveBeenCalledWith([
      startDate,
      endDate,
    ]);
  });

  it('should swap start and end dates if end date is before start date', () => {
    const startDate = new Date();
    const endDate = subDays(startDate, 5);
    component.selectDate(startDate);
    component.selectDate(endDate);
    expect(component.selectedStartDate()).toEqual(endDate);
    expect(component.selectedEndDate()).toEqual(startDate);

    expect(component.rangeChange.emit).toHaveBeenCalledWith([
      endDate,
      startDate,
    ]);
  });

  it('should select a shortcut', () => {
    const shortcut = {
      label: 'Last Year',
      start: subYears(new Date(), 1),
      end: new Date(),
    };
    component.onShortcutClick(shortcut);
    expect(component.selectedStartDate()).toEqual(shortcut.start);
    expect(component.selectedEndDate()).toEqual(shortcut.end);

    expect(component.rangeChange.emit).toHaveBeenCalledWith([
      shortcut.start,
      shortcut.end,
    ]);
  });
});
