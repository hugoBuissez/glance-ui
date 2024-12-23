import {
  Component,
  computed,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';
import { GlancePopperComponent } from '@glance-ui/popper';
import {
  addDays,
  addMonths,
  isAfter,
  isBefore,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';

interface DatePickerDay {
  date: Date;
  isInRange: boolean;
  // day can be end of previous month or start of next month
  isStartDate: boolean;
  isEndDate: boolean;
  isInCurrentMonth: boolean;
  isDisabled?: boolean;
}

@Component({
  selector: 'g-date-picker',
  standalone: true,
  imports: [NgStyle, NgClass],
  templateUrl: './glance-date-picker.component.html',
})
export class GlanceDatePickerComponent
  extends GlancePopperComponent
  implements OnInit
{
  readonly WEEK_DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  disableFrom = input<Date | null>(null);

  private currentDate = signal<Date>(startOfMonth(new Date()));

  selectedStartDate = signal<Date | null>(null);
  selectedEndDate = signal<Date | null>(null);

  currentWeeks = signal<DatePickerDay[][]>(
    this.updateCalendarDays(this.currentDate())
  );
  nextMonthWeeks = signal<DatePickerDay[][]>(
    // this.generateCalendarDays(addMonths(this.currentDate(), 1))
    []
  );

  formattedMonthLeft = computed(() => {
    const fmt = this.currentDate().toLocaleString('default', {
      month: 'long',
    });
    return fmt.charAt(0).toUpperCase() + fmt.slice(1);
  });

  formattedYearLeft = computed(() => this.currentDate().getFullYear());

  formattedMonthRight = computed(() => {
    const fmt = addMonths(this.currentDate(), 1).toLocaleString('default', {
      month: 'long',
    });
    return fmt.charAt(0).toUpperCase() + fmt.slice(1);
  });

  formattedYearRight = computed(() =>
    addMonths(this.currentDate(), 1).getFullYear()
  );

  hoveredDate = signal<Date | null>(null);

  onRangeChange = output<Date[]>();

  override ngOnInit() {
    super.ngOnInit();
    this.showPopper();
  }

  selectDate(date: Date): void {
    if (this.selectedStartDate() && this.selectedEndDate()) {
      // a date range is already selected -> clear and select new start date
      this.selectedStartDate.set(date);
      this.selectedEndDate.set(null);
    } else if (!this.selectedStartDate()) {
      // no start nor end date selected -> select start date
      this.selectedStartDate.set(date);
    } else {
      // start date is selected but no end date -> select end date
      if (isBefore(date, this.selectedStartDate()!)) {
        // if new end date is before start date -> swap them
        this.selectedEndDate.set(this.selectedStartDate()!);
        this.selectedStartDate.set(date);
      } else {
        // if new end date is after start date -> select it
        this.selectedEndDate.set(date);
      }
      this.hoveredDate.set(null);
      this.onRangeChange.emit([
        this.selectedStartDate()!,
        this.selectedEndDate()!,
      ]);
    }

    // TODO: refactor this to use a single method
    this.currentWeeks.update(() =>
      this.currentWeeks().map((week) =>
        week.map((day) => ({
          ...day,
          isInRange: this.isDateInRange(day.date),
          isStartDate: this.isDateStartDate(day.date),
          isEndDate: this.isDateEndDate(day.date),
        }))
      )
    );
    this.nextMonthWeeks.update(() =>
      this.nextMonthWeeks().map((week) =>
        week.map((day) => ({
          ...day,
          isInRange: this.isDateInRange(day.date),
          isStartDate: this.isDateStartDate(day.date),
          isEndDate: this.isDateEndDate(day.date),
        }))
      )
    );
  }

  // hover effect when user has selected start date
  // it changes the background color of the days between start and current hovered date
  // the method handles the case when hovered date is before start date
  onCellHover(date: Date): void {
    if (!this.selectedStartDate() || this.selectedEndDate()) return;
    this.hoveredDate.set(date);

    // TODO: refactor this to use a single method
    this.currentWeeks.update((weeks) =>
      weeks.map((week) =>
        week.map((day) => ({
          ...day,
          isInRange:
            !this.isDateSelected(day.date) &&
            day.date !== this.hoveredDate() &&
            ((day.date >= this.selectedStartDate()! && day.date <= date) ||
              (day.date <= this.selectedStartDate()! && day.date >= date)),
        }))
      )
    );
    this.nextMonthWeeks.update((weeks) =>
      weeks.map((week) =>
        week.map((day) => ({
          ...day,
          isInRange:
            !this.isDateSelected(day.date) &&
            day.date !== this.hoveredDate() &&
            ((day.date >= this.selectedStartDate()! && day.date <= date) ||
              (day.date <= this.selectedStartDate()! && day.date >= date)),
        }))
      )
    );
  }

  private updateCalendarDays(date: Date): DatePickerDay[][] {
    const weeks: Date[][] = [];
    const firstDayOfWeek = startOfWeek(date, { weekStartsOn: 1 });

    // Generate 6 weeks to ensure we have enough rows
    for (let week = 0; week < 6; week++) {
      const weekDates: Date[] = [];

      // if week start date is not in current month, skip it (except for the first week)
      const startDate = addDays(firstDayOfWeek, week * 7);
      if (!isSameMonth(startDate, date) && week !== 0) {
        continue;
      }

      // Generate 7 days for each week
      for (let day = 0; day < 7; day++) {
        const date = addDays(firstDayOfWeek, week * 7 + day);
        weekDates.push(date);
      }
      weeks.push(weekDates);
    }

    // Only return the weeks that contain days in the current month
    return weeks.map((week) =>
      week.map(
        (d) =>
          ({
            date: d,
            isInRange: this.isDateInRange(d),
            isStartDate: this.isDateStartDate(d),
            isEndDate: this.isDateEndDate(d),
            isInCurrentMonth: isSameMonth(d, date),
            isDisabled: this.disableFrom() && isAfter(d, this.disableFrom()!),
          } as DatePickerDay)
      )
    );
  }

  private isDateInRange(date: Date): boolean {
    const start = this.selectedStartDate();
    const end = this.selectedEndDate();
    if (!start || !end || this.isDateSelected(date)) return false;
    return date >= start && date <= end;
  }

  private isDateStartDate(date: Date): boolean {
    return date.getTime() === this.selectedStartDate()?.getTime();
  }

  private isDateEndDate(date: Date): boolean {
    return date.getTime() === this.selectedEndDate()?.getTime();
  }

  private isDateSelected(date: Date): boolean {
    return this.isDateStartDate(date) || this.isDateEndDate(date);
  }

  // Navigation methods
  nextMonth(): void {
    this.currentDate.update((date) => addMonths(date, 1));
    this.currentWeeks.update(() => this.updateCalendarDays(this.currentDate()));
    this.nextMonthWeeks.update(() =>
      this.updateCalendarDays(addMonths(this.currentDate(), 1))
    );
  }

  previousMonth(): void {
    this.currentDate.update((date) => subMonths(date, 1));
    this.currentWeeks.update(() => this.updateCalendarDays(this.currentDate()));
    this.nextMonthWeeks.update(() =>
      this.updateCalendarDays(subMonths(this.currentDate(), 1))
    );
  }
}
