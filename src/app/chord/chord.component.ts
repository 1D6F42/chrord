import { Component, Input } from '@angular/core';
import { Intervals } from '../diatonic-definitions';
import { DiatonicService } from '../diatonic.service';
import { Chord } from '../chord';
import { Util } from '../Utilities';

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
    console.log(this.chord.getOctaveNumbers())
  }

  onWheel(event: WheelEvent, index: number) {
    event.preventDefault();
    let mod = event.deltaY > 0 ? -1 : 1;
    this.chord.modifyNote(index, mod);
  }

}
