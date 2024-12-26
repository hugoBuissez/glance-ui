import {
  Component,
  computed,
  input,
  model,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import { GlancePopperComponent } from '@glance-ui/popper';
import {
  addDays,
  addMonths,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  setMonth,
  setYear,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
  subYears,
} from 'date-fns';

interface DatePickerDay {
  date: Date;
  isInRange: boolean;
  // day can be end of previous month or start of next month
  isStartDate: boolean;
  isEndDate: boolean;
  isInCurrentMonth: boolean;
  isDisabled?: boolean;
  isHovered?: boolean;
}

interface DatePickerShortcut {
  label: string;
  start?: Date;
  end?: Date;
}

@Component({
  selector: 'g-date-picker',
  standalone: true,
  imports: [NgStyle, NgClass, NgTemplateOutlet],
  templateUrl: './glance-date-picker.component.html',
})
export class GlanceDatePickerComponent
  extends GlancePopperComponent
  implements OnInit
{
  readonly WEEK_DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  readonly MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  disableFrom = input<Date | null>(null);
  double = input<boolean>(true);

  currentMonthDate = signal<Date>(startOfMonth(new Date()));
  nextMonthDate = computed<Date>(() =>
    startOfMonth(addMonths(this.currentMonthDate(), 1))
  );

  readonly YEARS = this.getYears();

  selectedStartDate = model<Date | null>(null);
  selectedEndDate = model<Date | null>(null);

  readonly SHORTCUTS = signal<DatePickerShortcut[]>([
    {
      label: 'Last 7 days',
      start: subDays(new Date(), 7),
      end: new Date(),
    },
    {
      label: 'Last 14 days',
      start: subDays(new Date(), 14),
      end: new Date(),
    },
    {
      label: 'Last 30 days',
      start: subDays(new Date(), 30),
      end: new Date(),
    },
    {
      label: 'Last 60 days',
      start: subDays(new Date(), 60),
      end: new Date(),
    },
    {
      label: 'Last 90 days',
      start: subDays(new Date(), 90),
      end: new Date(),
    },
    { label: 'Last Year', start: subYears(new Date(), 1), end: new Date() },
  ]);

  selectedShortcut = computed(() => {
    return this.SHORTCUTS().find(
      (shortcut) =>
        isSameDay(this.selectedStartDate() ?? '', shortcut.start ?? '') &&
        isSameDay(this.selectedEndDate() ?? '', shortcut.end ?? '')
    );
  });

  currentWeeks = computed(() => {
    const weeks: DatePickerDay[][] = [];
    for (let month = 0; month < (this.double() ? 2 : 1); month++) {
      const firstDayOfMonth = startOfMonth(
        addMonths(this.currentMonthDate(), month)
      );
      const firstDayOfWeek = startOfWeek(firstDayOfMonth, {
        weekStartsOn: 1,
      });

      // Generate 6 weeks to ensure we have enough rows
      for (let week = 0; week < 6; week++) {
        const weekDates: DatePickerDay[] = [];

        // Generate 7 days for each week
        for (let day = 0; day < 7; day++) {
          const date = addDays(firstDayOfWeek, week * 7 + day);
          weekDates.push({
            date,
            isInRange: this.isDateInRange(date, this.hoveredDate()),
            isStartDate:
              !!this.selectedStartDate() &&
              isSameDay(date, this.selectedStartDate() ?? ''),
            isEndDate:
              !!this.selectedEndDate() &&
              isSameDay(date, this.selectedEndDate() ?? ''),
            isInCurrentMonth: isSameMonth(date, firstDayOfMonth),
            isDisabled:
              !!this.disableFrom() && isAfter(date, this.disableFrom() ?? ''),
            isHovered:
              !!this.hoveredDate() && isSameDay(date, this.hoveredDate() ?? ''),
          });
        }

        weeks.push(weekDates);
      }
    }

    return weeks;
  });

  leftMonth = computed(() => {
    // take first 6 weeks of current month
    return this.currentWeeks()
      .slice(0, 6)
      .filter((week) => week.some((day) => day.isInCurrentMonth));
  });

  rightMonth = computed(() => {
    // take first 6 weeks of next month
    return this.currentWeeks()
      .slice(6, 12)
      .filter((week) => week.some((day) => day.isInCurrentMonth));
  });

  formattedMonthLeft = computed(() => {
    const fmt = this.currentMonthDate().toLocaleString('default', {
      month: 'long',
    });
    return fmt.charAt(0).toUpperCase() + fmt.slice(1);
  });

  formattedYearLeft = computed(() => this.currentMonthDate().getFullYear());

  formattedMonthRight = computed(() => {
    const fmt = this.nextMonthDate().toLocaleString('default', {
      month: 'long',
    });
    return fmt.charAt(0).toUpperCase() + fmt.slice(1);
  });

  formattedYearRight = computed(() => this.nextMonthDate().getFullYear());

  hoveredDate = signal<Date | null>(null);

  rangeChange = output<Date[]>();

  selectDate(date: Date): void {
    const selectedStartDate = this.selectedStartDate();
    const selectedEndDate = this.selectedEndDate();

    const isDateRangeSelected = selectedStartDate && selectedEndDate;
    if (isDateRangeSelected || !selectedStartDate) {
      this.setDateRange(date, null);
    } else {
      if (isBefore(date, selectedStartDate)) {
        this.setDateRange(date, selectedStartDate);
      } else {
        this.setDateRange(selectedStartDate, date);
      }

      this.hoveredDate.set(null);
    }
  }

  onCellHover(date: Date): void {
    if (!this.selectedStartDate() || this.selectedEndDate()) return;
    this.hoveredDate.set(date);
  }

  // checks if date is in range between start and end date
  // if hovered date is provided, it checks if date is in range between start and hovered date
  private isDateInRange(date: Date, hoveredDate: Date | null): boolean {
    const start = this.selectedStartDate();
    const end = this.selectedEndDate() || hoveredDate;

    if (!start || !end) return false;
    if (isSameDay(date, end) || isSameDay(date, start)) return false;
    if (isAfter(date, start) && isBefore(date, end)) return true;
    return !!hoveredDate && isBefore(date, start) && isAfter(date, hoveredDate);
  }

  private setDateRange(startDate: Date | null, endDate: Date | null): void {
    this.selectedStartDate.set(startDate);
    this.selectedEndDate.set(endDate);

    const dateRange: Date[] = [];

    if (startDate && endDate) {
      dateRange.push(startDate, endDate);
    } else if (startDate) {
      dateRange.push(startDate, startDate);
    } else if (endDate) {
      dateRange.push(endDate, endDate);
    }

    this.rangeChange.emit(dateRange);
  }

  onMonthChange(event: Event, isLeft: boolean): void {
    const month: number = +(event.target as HTMLSelectElement).value;
    this.currentMonthDate.set(
      setMonth(this.currentMonthDate(), isLeft ? month : month - 1)
    );
  }

  onYearChange(event: Event): void {
    const year: number = +(event.target as HTMLSelectElement).value;
    this.currentMonthDate.set(setYear(this.currentMonthDate(), year));
  }

  nextMonth(): void {
    this.currentMonthDate.update((date) => addMonths(date, 1));
  }

  previousMonth(): void {
    this.currentMonthDate.update((date) => subMonths(date, 1));
  }

  onShortcutClick(shortcut: DatePickerShortcut): void {
    if (shortcut.start && shortcut.end) {
      this.setDateRange(shortcut.start, shortcut.end);
    }
  }

  private getYears(): number[] {
    const todayYear = new Date().getFullYear();
    const years: number[] = [];
    for (let year = 2016; year <= todayYear + 2; year++) {
      years.push(year);
    }
    return years;
  }
}
