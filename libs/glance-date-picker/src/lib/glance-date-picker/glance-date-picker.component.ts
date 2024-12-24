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

  disableFrom = input<Date | null>(null);
  double = input<boolean>(true);

  private currentMonthDate = signal<Date>(startOfMonth(new Date()));
  private nextMonthDate = computed(() =>
    startOfMonth(addMonths(this.currentMonthDate(), 1))
  );

  selectedStartDate = model<Date | null>(null);
  selectedEndDate = model<Date | null>(null);

  SHORTCUTS = signal<DatePickerShortcut[]>([
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
        isSameDay(this.selectedStartDate()!, shortcut.start!) &&
        isSameDay(this.selectedEndDate()!, shortcut.end!)
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
              isSameDay(date, this.selectedStartDate()!),
            isEndDate:
              !!this.selectedEndDate() &&
              isSameDay(date, this.selectedEndDate()!),
            isInCurrentMonth: isSameMonth(date, firstDayOfMonth),
            isDisabled:
              !!this.disableFrom() && isAfter(date, this.disableFrom()!),
            isHovered:
              !!this.hoveredDate() && isSameDay(date, this.hoveredDate()!),
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

  onRangeChange = output<Date[]>();

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
    // this.currentWeeks.update(() =>
    //   this.currentWeeks().map((week) =>
    //     week.map((day) => ({
    //       ...day,
    //       isInRange: this.isDateInRange(day.date),
    //       isStartDate: this.isDateStartDate(day.date),
    //       isEndDate: this.isDateEndDate(day.date),
    //     }))
    //   )
    // );
    // this.nextMonthWeeks.update(() =>
    //   this.nextMonthWeeks().map((week) =>
    //     week.map((day) => ({
    //       ...day,
    //       isInRange: this.isDateInRange(day.date),
    //       isStartDate: this.isDateStartDate(day.date),
    //       isEndDate: this.isDateEndDate(day.date),
    //     }))
    //   )
    // );
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

  nextMonth(): void {
    this.currentMonthDate.update((date) => addMonths(date, 1));
  }

  previousMonth(): void {
    this.currentMonthDate.update((date) => subMonths(date, 1));
  }

  onShortcutClick(shortcut: DatePickerShortcut): void {
    if (shortcut.start && shortcut.end) {
      this.selectedStartDate.set(shortcut.start);
      this.selectedEndDate.set(shortcut.end);
    }
  }
}
