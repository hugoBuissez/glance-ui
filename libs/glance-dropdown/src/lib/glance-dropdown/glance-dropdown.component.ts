import {
  Component,
  ElementRef,
  EventEmitter,
  input,
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
} from '@floating-ui/dom';
import { animate } from 'motion';
import { fromEvent } from 'rxjs';

export type GDropdownItem = {
  label: string;
  variant?: 'danger';
  icon?: string;
  action?: () => void;
};

@Component({
  selector: 'g-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './glance-dropdown.component.html',
})
export class GDropdownComponent {
  @ViewChild('toggle') toggle!: ElementRef;
  @ViewChild('popper') popper!: ElementRef;

  @Output() onShow = new EventEmitter<void>();
  @Output() onHide = new EventEmitter<void>();

  items = input<GDropdownItem[][]>([]);
  mode = input<'hover' | 'click'>('click');
  placement = input<Placement>('bottom-start');

  private cleanup: (() => void) | undefined;

  ngOnInit() {
    if (this.mode() === 'click') {
      // Hide popper when click outside the toggle
      fromEvent(document, 'click').subscribe((event) => {
        if (!this.toggle.nativeElement.contains(event.target as Node)) {
          this.hidePopper();
        }
      });

      // or when ESC key is pressed
      fromEvent(document, 'keydown').subscribe((event: Event) => {
        if ((event as KeyboardEvent).key === 'Escape') {
          this.hidePopper();
        }
      });
    }
  }

  protected update() {
    computePosition(this.toggle.nativeElement, this.popper.nativeElement, {
      placement: this.placement(),
      middleware: [offset(6), flip(), shift({ padding: 5 })],
    }).then(({ x, y }) => {
      Object.assign(this.popper.nativeElement.style, {
        left: `${x}px`,
        top: `${y}px`,
      });
    });
  }

  protected onMouseEnter() {
    if (this.mode() === 'hover') this.showPopper();
  }

  protected onMouseLeave() {
    if (this.mode() === 'hover') this.hidePopper();
  }

  protected onToggleClick() {
    if (this.mode() === 'click') {
      // if popper is already shown, hide it
      if (this.popper.nativeElement.style.display === 'block') {
        this.hidePopper();
      } else {
        this.showPopper();
      }
    }
  }

  protected showPopper() {
    this.onShow.emit();
    animate(
      this.popper.nativeElement,
      { display: 'block', scale: [0.8, 1], opacity: 1 },
      { duration: 0.1 }
    );
    this.cleanup = autoUpdate(
      this.toggle.nativeElement,
      this.popper.nativeElement,
      this.update.bind(this)
    );
  }

  protected hidePopper() {
    this.onHide.emit();
    animate(
      this.popper.nativeElement,
      { display: 'none', opacity: 0 },
      { duration: 0.1 }
    );
    this.cleanup?.();
  }
}
