import { Component, computed, signal } from '@angular/core';
import { GDropdownItem } from '@glance-ui/dropdown';
import { subDays } from 'date-fns';
import { GTooltipComponent } from '@glance-ui/tooltip';
import { GlanceDatePickerComponent } from '@glance-ui/date-picker';

export interface DateRange {
  start: Date;
  end: Date;
}

@Component({
  selector: 'app-nx-welcome',
  standalone: true,
  imports: [GTooltipComponent, GlanceDatePickerComponent],
  template: `
    <div class="h-screen w-screen p-5 flex justify-end ">
      <g-date-picker
        placement="bottom-end"
        (rangeChange)="onRangeChange($event)"
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

      <g-tooltip placement="bottom">
        <button toggle>
          <span class="icon-[lucide--calendar]"></span>
          <span class="text-sm">{{ formattedDate() }}</span>
        </button>
        <div tooltip class="p-1">
          <span class="text-sm">{{ formattedDate() }}</span>
        </div>
      </g-tooltip>
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

  items = signal<GDropdownItem[][]>([
    [
      { label: 'test', icon: 'icon-[lucide--calendar]' },
      { label: 'test2', icon: 'icon-[lucide--calendar]' },
    ],
    [
      { label: 'test3', icon: 'icon-[lucide--calendar]' },
      { label: 'test4', icon: 'icon-[lucide--calendar]' },
    ],
  ]);
}
