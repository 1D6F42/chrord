import { Component, OnInit, Input } from '@angular/core';
import { Intervals } from '../diatonic-definitions';
import { DiatonicService } from '../diatonic.service';
import { Chord } from '../chord';

@Component({
  selector: 'app-chord',
  templateUrl: './chord.component.html',
  styleUrls: ['./chord.component.css']
})
export class ChordComponent {

  @Input() chord!: Chord;

  constructor(readonly diatonic: DiatonicService) { }

  addNote() {
    this.chord.intervals.push(Intervals.majorThird);
  }

  onWheel(event: MouseWheelEvent, note: string) {
    // TODO
  }

}
