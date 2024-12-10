import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GTooltipComponent } from '@glance-ui/tooltip';
import { GDropdownComponent, GDropdownItem } from '@glance-ui/dropdown';

@Component({
  selector: 'app-nx-welcome',
  standalone: true,
  imports: [CommonModule, GTooltipComponent, GDropdownComponent],
  template: `
    <div class="h-screen w-screen p-10">
      <g-dropdown [items]="items()">
        <button
          toggle
          class="hover:bg-neutral-100 rounded-md p-2 inline-flex items-center justify-center"
        >
          <span class="icon-[lucide--ellipsis-vertical]"></span>
        </button>
      </g-dropdown>

      <g-dropdown [items]="settings()">
        <button
          toggle
          class="hover:bg-neutral-100 rounded-md p-2 inline-flex items-center justify-center gap-2"
        >
          <span class="icon-[lucide--settings] text-gray-600 "></span>
          <span class="text-gray-700 text-sm">Settings</span>
        </button>
      </g-dropdown>
    </div>
  `,
  styles: [],
})
export class NxWelcomeComponent {
  items = signal<GDropdownItem[][]>([
    [
      { label: 'Edit Products', icon: 'icon-[lucide--edit]' },
      { label: 'Pause Strategy', icon: 'icon-[lucide--circle-pause]' },
      { label: 'Display Chart', icon: 'icon-[lucide--chart-line]' },
    ],
    [{ label: 'Copy Strategy ID', icon: 'icon-[lucide--copy]' }],
    [{ label: 'Delete', icon: 'icon-[lucide--trash]', variant: 'danger' }],
  ]);

  settings = signal<GDropdownItem[][]>([
    [
      { label: 'Edit Name', icon: 'icon-[lucide--edit]' },
      { label: 'Edit Target', icon: 'icon-[lucide--target]' },
    ],
  ]);
}
