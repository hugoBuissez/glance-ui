import {
  Component,
  computed,
  ElementRef,
  EventEmitter,
  input,
  model,
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

  mode = model<'hover' | 'click'>('click');
  placement = input<Placement>('bottom-start');
  width = input<number | null>(null); // popper width in px, default is null
  fitWidth = input(false); // if true, the popper will fit the width of the toggle
  withArrow = model(false);

  delay = input(0);
  private computedDelay = computed(() =>
    this.mode() === 'hover' ? this.delay() : 0
  );
  private timer: number | undefined;

  @Output() show = new EventEmitter<void>();
  @Output() hide = new EventEmitter<void>();

  private cleanup: (() => void) | undefined;

  ngOnInit() {
    if (this.mode() === 'click') {
      // Hide popper when click outside the toggle
      fromEvent(document, 'click').subscribe((event) => {
        if (
          !this.toggle.nativeElement.contains(event.target as Node) &&
          !this.popper.nativeElement.contains(event.target as Node)
        ) {
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

      if (staticSide) this.arrow.nativeElement.style[staticSide] = '-3px';
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
      if (this.popper.nativeElement.style.visibility === 'visible') {
        this.hidePopper();
      } else {
        this.showPopper();
      }
    }
  }

  protected showPopper() {
    this.timer = window.setTimeout(() => {
      this.show.emit();

      animate(
        this.popper.nativeElement,
        {
          visibility: 'visible',
          scale: [0.8, 1],
          opacity: 1,
          zIndex: 1000,
        },
        { duration: 0.12 }
      );

      this.cleanup = autoUpdate(
        this.toggle.nativeElement,
        this.popper.nativeElement,
        this.update.bind(this)
      );
    }, this.computedDelay());
  }

  protected hidePopper() {
    clearTimeout(this.timer);
    this.hide.emit();
    animate(
      this.popper.nativeElement,
      { visibility: 'hidden', opacity: 0, zIndex: -1000 },
      { duration: 0.1 }
    );
    this.cleanup?.();
  }
}
