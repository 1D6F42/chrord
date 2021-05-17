import { Component } from '@angular/core';
import { DiatonicService } from './diatonic.service';
import { Triad, Scale, MODES } from './diatonic-definitions';
import * as Tone from 'tone'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  selectedMode: string = MODES[1]; // 1 is ionian
  selectedTonic: string = "C"; // C Ionian is the most default key (fucking elusives tho)
  selectedScale: Scale;
  selectedChords: string[][] = [];

  modes: string[] = [];
  tonics: string[] = [];
  diatonicTriads = [];

  volume_icon = "volume_off"

  synth: Tone.PolySynth;

  constructor(private readonly diatonic: DiatonicService) {
    diatonic.knowAllScales();
    this.initialise();



  }

  async enableAudio() {
    await Tone.start()
    console.log('audio is ready')
    //create a synth and connect it to the main output (your speakers)
    this.synth = new Tone.PolySynth(Tone.Synth).toDestination();
    this.volume_icon = "volume_up"
  }

  async testScale() {
    if (this.synth) {
      const now = Tone.now()
      this.selectedScale.notes.forEach((note, index) => {
        note = note + "4"
        this.synth.triggerAttackRelease(note, "8n", now + (index / 4));
      });
    } else {
      // alert("Press volume icon to enable audio")
    }
  }

  async testChords() {
    if (this.synth) {
      const now = Tone.now()

      this.selectedChords.forEach((chord, index) => {
        chord.forEach((note, index) => {
          if (!note.includes("4")) {
            note = note + "4" // TODO, now we need to support octaves
            chord[index] = note;
          }
        })
        console.log(chord)
        this.synth.triggerAttackRelease(chord, "8n", now + (index / 2));
      });
    } else {
      alert("Press volume button to enable audio")
    }
  }

  initialise() {
    // set modes
    this.modes = [];
    for (let key in MODES) {
      if (isNaN(Number(key))) {
        this.modes.push(key);
      }
    }
    // set scale
    this.setScale();
  }

  getTonics() {
    this.tonics = [];
    this.diatonic.generated_scales.forEach(scale => {
      if (scale.mode == this.selectedMode) {
        this.tonics.push(scale.notes[0]);
      }
    });
  }

  setScale() {
    this.diatonic.generated_scales.forEach(scale => {
      if (this.selectedMode == scale.mode && this.selectedTonic == scale.notes[0]) {
        this.selectedScale = scale;
      }
    });
    this.getTonics();
    this.getDiatonicTriads();
    this.testScale();
  }

  selectChord(triad: Triad) {
    this.selectedChords.push(this.diatonic.getNotesForTriadInScale(triad, this.selectedScale));
  }

  getDiatonicTriads() {
    this.diatonicTriads = [];
    this.selectedChords = [];
    for (var i = 1; i < 8; i++) {
      let triad = this.diatonic.getDiatonicTriadForScaleDegree(i, MODES[this.selectedScale.mode]);
      this.diatonicTriads.push([this.diatonic.getLabelForTriadInScale(triad, this.selectedScale), triad]);
    }
  }
}
