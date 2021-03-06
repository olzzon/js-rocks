import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  NgModule,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';

import { Distortion, DistortionSettings } from '@audio/effects/distortion';
import { AudioContextManager } from '@audio/audio-context-manager.service';
import { PedalComponent, PedalDescriptor } from '../pedal.interface';
import { KnobModule } from '../knob/knob.component';
import { LargeSwitchModule } from '../large-switch/large-switch.component';
import { LedModule } from '../led/led.component';
import { StompboxModule } from '../stompbox/stompbox.component';
import { ThreeKnobLayoutModule } from '../three-knob-layout/three-knob-layout.component';

@Component({
  selector: 'jsr-overdrive',
  templateUrl: './overdrive.component.html',
  styleUrls: ['./overdrive.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverdriveComponent
  implements OnInit, OnDestroy, PedalComponent<DistortionSettings> {
  @HostBinding('class.pedal')
  pedalClassName = true;

  @Output()
  remove = new EventEmitter<void>();

  destroy$ = new Subject<void>();

  effect: Distortion;

  params: DistortionSettings = {
    level: 0.5,
    distortion: 0.5,
    tone: 0.5,
    active: false
  };

  info: PedalDescriptor;

  constructor(private manager: AudioContextManager) {}

  ngOnInit() {
    this.effect = new Distortion(
      this.manager.context,
      this.info.id,
      this.params,
      {
        curveType: 'driver',
        preFilterRange: [150, 2000]
      }
    );
    this.manager.addEffect(this.effect);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.manager.removeEffect(this.effect);
    this.effect.dispose();
  }
}

@NgModule({
  declarations: [OverdriveComponent],
  bootstrap: [OverdriveComponent],
  imports: [
    CommonModule,
    KnobModule,
    LargeSwitchModule,
    LedModule,
    StompboxModule,
    ThreeKnobLayoutModule
  ]
})
export class OverdriveModule {}
