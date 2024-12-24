import { Component, input } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';
import { GlancePopperComponent } from '@glance-ui/popper';

export type GDropdownItem = {
  label: string;
  variant?: 'danger';
  icon?: string;
  disabled?: boolean;
  onClick?: () => void;
  to?: string; // routerLink
  href?: string; // anchor
};

@Component({
  selector: 'g-dropdown',
  standalone: true,
  imports: [NgStyle, NgClass],
  templateUrl: './glance-dropdown.component.html',
})
export class GDropdownComponent extends GlancePopperComponent {
  items = input<GDropdownItem[][]>([]);

  protected onItemClick(item: GDropdownItem) {
    if (item.disabled) return;
    if (item.onClick) item.onClick();
    this.hidePopper();
  }
}
