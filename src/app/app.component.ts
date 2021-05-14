import { Component } from '@angular/core';
import { DiatonicService } from './diatonic.service';
import { Triad, Modes, Scale } from './diatonic';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  modes = ["ionian", "dorian", "phrygian", "lydian", "mixolydian", "aeolian", "locrian"]; // update to use enum
  selectedMode = this.modes[0]
  tonics = []
  selectedTonic;
  selectedScale: Scale;
  diatonicTriads: [string, Triad][] = [];
  chordList = [];

  constructor(private readonly diatonic: DiatonicService) {
    diatonic.knowAllScales();
    this.getTriads();
    this.getNotes();
    this.changeMode();
    this.changeTonic();
  }

  getNotes() {
    this.tonics = [];
    this.diatonic.scales.forEach(scale => {
      if (scale.mode == this.selectedMode) {
        this.tonics.push(scale.notes[0])
      }
    });
    this.selectedTonic = this.tonics[0];
    this.changeTonic();
  }

  getTriads() {
    this.diatonicTriads = [];
    for (var i = 1; i < 8; i++) {
      let theTriad = this.diatonic.getDiatonicTriadForScaleDegree(i);
      this.diatonicTriads.push([this.diatonic.getLabelForTriadDegree(theTriad), theTriad]);
    }
  }

  changeTonic() {
    this.chordList = [];
    this.diatonic.scales.forEach(scale => {
      if (this.selectedMode == scale.mode && this.selectedTonic == scale.notes[0]) {
        this.selectedScale = scale;
      }
    })
  }

  chordButton(triad: [string, Triad]) {

    // doing this a kind of shit way, because we can't use the chromatic scale references until i have overridden the array sort in the diatonic service.
    this.chordList.push([this.selectedScale.notes[this.diatonic.wrapIndex(triad[1].degree - 1)],
      this.selectedScale.notes[this.diatonic.wrapIndex(triad[1].degree + 1)],
      this.selectedScale.notes[this.diatonic.wrapIndex(triad[1].degree + 3)]]);

  }

  changeMode() {
    this.chordList = [];
    this.getNotes();
    //improve this later
    switch (this.selectedMode) {
      case "ionian":
        this.diatonic.mode = Modes.ionian;
        break;
      case "dorian":
        this.diatonic.mode = Modes.dorian;
        break;
      case "phrygian":
        this.diatonic.mode = Modes.phrygian;
        break;
      case "lydian":
        this.diatonic.mode = Modes.lydian;
        break;
      case "mixolydian":
        this.diatonic.mode = Modes.mixolydian;
        break;
      case "aeolian":
        this.diatonic.mode = Modes.aeolian;
        break;
      case "locrian":
        this.diatonic.mode = Modes.locrian;
        break;
    }
    this.getTriads();
  }

}
