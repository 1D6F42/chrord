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
  notes: string[] = [];
  pitches: string[] = [];

  color: string = "#FFFFFF"
  label: string = "";

  constructor(readonly diatonic: DiatonicService) { }

  ngOnInit(): void {
    this.notes = this.diatonic.getNotesInChord(this.chord);
    this.pitches = this.diatonic.getPitchesInChord(this.chord);
    this.color = this.diatonic.getColorForChord(this.chord);
    this.label = this.diatonic.getLabelsForChord(this.chord);
  }

}
