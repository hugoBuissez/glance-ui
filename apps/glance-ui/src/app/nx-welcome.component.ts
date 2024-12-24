import { Component, computed, signal } from '@angular/core';
import { GlanceDatePickerComponent } from '@glance-ui/date-picker';
import { subDays } from 'date-fns';

export interface DateRange {
  start: Date;
  end: Date;
}

@Component({
  selector: 'app-nx-welcome',
  standalone: true,
  imports: [GlanceDatePickerComponent],
  template: `
    <div class="h-screen w-screen p-10 flex justify-end">
      <div class="mr-20">
        <g-date-picker
          placement="bottom-end"
          (onRangeChange)="onRangeChange($event)"
          [disableFrom]="today()"
          [selectedStartDate]="last30Days()[0]"
          [selectedEndDate]="last30Days()[1]"
        >
          <button
            class="bg-white text-gray-700 rounded-md px-2 py-1 flex flex-row items-center gap-x-2 hover:bg-gray-100 duration-100
          border border-gray-300 shadow-sm
         focus-visible:outline-none focus:ring-2 focus:ring-indigo-300 ring-offset-1
          "
            toggle
          >
            <span class="icon-[lucide--calendar]"></span>
            <span class="text-sm">{{ formattedDate() }}</span>
          </button>
        </g-date-picker>
      </div>
    </div>
  `,
})
export class NxWelcomeComponent {
  today = signal<Date | null>(new Date());
  dateRange = signal<DateRange>({
    start: subDays(new Date(), 14),
    end: new Date(),
  });

  formattedDate = computed(() => {
    return `${this.dateRange().start.toLocaleDateString(
      'fr-FR'
    )} - ${this.dateRange().end.toLocaleDateString('fr-FR')}`;
  });

  last30Days = signal<Date[]>([subDays(new Date(), 30), new Date()]);

  onRangeChange(dates: Date[]) {
    console.log(dates);
    this.dateRange.set({
      start: dates[0],
      end: dates[1],
    });
  }
}
