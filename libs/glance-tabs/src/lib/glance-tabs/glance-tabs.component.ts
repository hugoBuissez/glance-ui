import {
  Component,
  computed,
  ElementRef,
  input,
  model,
  signal,
  viewChildren,
} from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';

export interface GlanceTab {
  label: string;
  icon?: string;
  disabled?: boolean;
}

@Component({
  selector: 'g-tabs',
  standalone: true,
  imports: [CommonModule, NgClass],
  templateUrl: './glance-tabs.component.html',
})
export class GlanceTabsComponent {
  tabs = input<GlanceTab[]>([
    { label: 'Advertised Products', icon: 'icon-[lucide--box]' },
    { label: 'Strategies', icon: 'icon-[lucide--lightbulb]' },
    { label: 'Stats', icon: 'icon-[lucide--chart-line]' },
    { label: 'Activities', icon: 'icon-[lucide--clock]' },
    { label: 'More', icon: 'icon-[lucide--more-horizontal]' },
  ]);

  tabRefs = viewChildren<ElementRef>('tab');
  activeTab = model<number>(0);

  underlineWidth = computed(() => {
    const currentTab = this.tabRefs()[this.activeTab()];
    return currentTab ? currentTab.nativeElement.offsetWidth : 0;
  });

  underlineLeft = computed(() => {
    const currentTab = this.tabRefs()[this.activeTab()];
    return currentTab ? currentTab.nativeElement.offsetLeft : 0;
  });

  onTabClick(index: number) {
    this.activeTab.set(index);
  }
}
