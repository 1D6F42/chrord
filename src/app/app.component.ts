import { Component } from '@angular/core';
import { DiatonicService } from './diatonic.service';
import { Triad, Scale, MODE } from './diatonic-definitions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  selectedMode: string = MODE[1]; // 1 is ionian
  selectedTonic: string = "C"; // C Ionian is the most default key (fucking elusives tho)
  selectedScale: Scale;
  selectedChords: string[][] = [];

  modes: string[] = [];
  tonics: string[] = [];
  diatonicTriads = [];

  constructor(private readonly diatonic: DiatonicService) {
    diatonic.knowAllScales();
    this.initialise();
  }

  initialise() {
    // set modes
    this.modes = [];
    for (let key in MODE) {
      if (isNaN(Number(key))) {
        this.modes.push(key);
      }
    }
    // set tonics
    this.tonics = [];
    this.diatonic.generated_scales.forEach(scale => {
      if (scale.mode == this.selectedMode) {
        this.tonics.push(scale.notes[0]);
      }
    });
    // set scale
    this.setScale();
    // set triads
    this.getDiatonicTriads();
  }

  setScale() {
    this.diatonic.generated_scales.forEach(scale => {
      if (this.selectedMode == scale.mode && this.selectedTonic == scale.notes[0]) {
        this.selectedScale = scale;
      }
    });
    this.getDiatonicTriads()
  }

  selectChord(triad: Triad) {
    this.selectedChords.push(this.diatonic.getNotesForTriadInScale(triad, this.selectedScale));
  }

  getDiatonicTriads() {
    this.diatonicTriads = [];
    this.selectedChords = [];
    for (var i = 1; i < 8; i++) {
      let triad = this.diatonic.getDiatonicTriadForScaleDegree(i, MODE[this.selectedScale.mode]);
      this.diatonicTriads.push([this.diatonic.getLabelForTriadInScale(triad, this.selectedScale), triad]);
    }
  }
}
