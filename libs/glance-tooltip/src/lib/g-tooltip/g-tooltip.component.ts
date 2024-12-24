import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlancePopperComponent } from '@glance-ui/popper';

@Component({
  selector: 'g-tooltip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './g-tooltip.component.html',
})
export class GTooltipComponent extends GlancePopperComponent {}
