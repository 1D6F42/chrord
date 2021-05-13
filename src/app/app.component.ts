import { Component } from '@angular/core';
import { DiatonicService } from './diatonic.service';
import { Triad, Modes } from './diatonic';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'chrord';
  modes = ["ionian", "dorian", "phrygian", "lydian", "mixolydian", "aeolian", "locrian"];
  selectedMode = this.modes[0]

  diatonicTriads: [string, Triad][] = [];

  constructor(private readonly diatonic: DiatonicService) {
    this.getTriads();
  }

  getTriads() {
    this.diatonicTriads = [];
    for (var i = 1; i < 8; i++) {
      let theTriad = this.diatonic.getDiatonicTriadForScaleDegree(i);
      this.diatonicTriads.push([this.diatonic.getLabelForTriadDegree(theTriad), theTriad]);
    }
  }

  changeMode() {
    //improve this later
    console.log(this.selectedMode);
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
