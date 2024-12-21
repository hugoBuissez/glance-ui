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
  arrow,
  autoUpdate,
  computePosition,
  flip,
  offset,
  Placement,
  shift,
} from '@floating-ui/dom';
import { animate } from 'motion';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'g-popper',
  standalone: true,
  imports: [CommonModule],
  template: ``,
})
export class GlancePopperComponent implements OnInit {
  @ViewChild('toggle') toggle!: ElementRef;
  @ViewChild('popper') popper!: ElementRef;
  @ViewChild('arrow') arrow!: ElementRef;

  mode = input<'hover' | 'click'>('click');
  placement = input<Placement>('bottom-start');
  width = input<number>(200); // popper width in px, default is 200px
  fitWidth = input(false); // if true, the popper will fit the width of the toggle
  withArrow = input(false);

  @Output() onShow = new EventEmitter<void>();
  @Output() onHide = new EventEmitter<void>();

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
      middleware: [
        offset(6),
        flip(),
        shift({ padding: 5 }),
        this.withArrow() && arrow({ element: this.arrow.nativeElement }),
      ],
    }).then(({ x, y, placement, middlewareData }) => {
      Object.assign(this.popper.nativeElement.style, {
        left: `${x}px`,
        top: `${y}px`,
        width: this.fitWidth()
          ? `${this.toggle.nativeElement.clientWidth}px`
          : undefined,
      });

      if (!this.withArrow()) return;

      const arrowX = middlewareData.arrow?.x;
      const arrowY = middlewareData.arrow?.y;

      const staticSide: string | undefined = {
        top: 'bottom',
        right: 'left',
        bottom: 'top',
        left: 'right',
      }[placement.split('-')[0]];

      Object.assign(this.arrow.nativeElement.style, {
        left: arrowX != null ? `${arrowX}px` : '',
        top: arrowY != null ? `${arrowY}px` : '',
        right: '',
        bottom: '',
      });

      this.arrow.nativeElement.style[staticSide!] = '-3px';
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
