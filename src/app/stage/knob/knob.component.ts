import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  HostBinding,
  HostListener,
  ViewChild,
  ElementRef,
  OnInit } from '@angular/core';
import { clamp } from '../../utils';

@Component({
  selector: 'jsr-knob',
  templateUrl: './knob.component.html',
  styleUrls: ['./knob.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KnobComponent implements OnInit {
  @HostBinding('attr.tabindex')
  tabIndex = '0';

  @Input()
  label = 'Knob';

  @Input()
  labelPosition: 'top' | 'bottom' = 'bottom';

  @Input()
  min = 0;

  @Input()
  max = 1;

  @Input()
  step = 0.05;

  @Input()
  value = 0;

  @Output()
  valueChanged = new EventEmitter<number>();

  @ViewChild('control')
  control: ElementRef;

  constructor(private element: ElementRef) {}

  ngOnInit() {
    this._updateKnobPointer(clamp(this.min, this.max, this.value));
  }

  onValueChange(event) {
    const value = clamp(this.min, this.max, parseFloat(event.target.value));
    this._updateKnobPointer(value);
    this.valueChanged.emit(value);
  }

  @HostListener('focus')
  onFocus() {
    this.control.nativeElement.focus();
  }

  _updateKnobPointer(value: number) {
    const percent = value * (this.max - this.min) + this.min;
    const deg = 270 * percent - 135;

    this.element.nativeElement.style.setProperty('--knob-angle', `${deg}deg`);
  }
}
