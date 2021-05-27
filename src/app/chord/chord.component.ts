import { Component, OnInit, Input } from '@angular/core';
import { Chord } from '../diatonic-definitions';
import { DiatonicService } from '../diatonic.service';

@Component({
  selector: 'app-chord',
  templateUrl: './chord.component.html',
  styleUrls: ['./chord.component.css']
})
export class ChordComponent implements OnInit {

  @Input() chord!: Chord;

  constructor(private readonly diatonic: DiatonicService) { }

  ngOnInit(): void {
  }

  notes(chord: Chord) {
    return this.diatonic.getPitchesInChord(chord, this.diatonic.activeScale)
  }

}
