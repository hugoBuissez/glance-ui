import {
  Component,
  computed,
  ElementRef,
  input,
  model,
  OnInit,
  output,
  viewChildren,
} from '@angular/core';
import { NgClass } from '@angular/common';

export interface GlanceTab {
  label: string;
  icon?: string;
  disabled?: boolean;
  badge?: string;
}

@Component({
  selector: 'g-tabs',
  standalone: true,
  imports: [NgClass],
  templateUrl: './glance-tabs.component.html',
})
export class GlanceTabsComponent implements OnInit {
  tabRefs = viewChildren<ElementRef>('tab');

  tabs = input<GlanceTab[]>([]);
  activeTab = model<number>(0);

  onActiveTabChange = output<number>();

  underlineWidth = computed(() => {
    const currentTab = this.tabRefs()[this.activeTab()];
    return currentTab ? currentTab.nativeElement.offsetWidth : 0;
  });

  underlineLeft = computed(() => {
    const currentTab = this.tabRefs()[this.activeTab()];
    return currentTab ? currentTab.nativeElement.offsetLeft : 0;
  });

  ngOnInit() {
    this.onActiveTabChange.emit(this.activeTab());
  }

  onTabClick(index: number) {
    this.activeTab.set(index);
    this.onActiveTabChange.emit(index);
  }
}
