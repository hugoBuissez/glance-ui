import {
  Component,
  ElementRef,
  EventEmitter,
  input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Placement,
  computePosition,
  offset,
  flip,
  shift,
  autoUpdate,
  arrow,
} from '@floating-ui/dom';
import { animate } from 'motion';
import { fromEvent } from 'rxjs';
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
  imports: [CommonModule],
  templateUrl: './glance-dropdown.component.html',
})
export class GDropdownComponent extends GlancePopperComponent {
  items = input<GDropdownItem[][]>([]);

  protected onItemClick(item: GDropdownItem) {
    if (item.disabled) return;
    if (item.onClick) item.onClick();
  }
}
