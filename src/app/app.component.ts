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

  selectedMode: string = MODES[1]; // 1 is ionian (major)
  selectedTonic: string = "C"; // C Ionian is the most default key
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

  getTonics() {
    this.tonics = [];
    this.diatonic.generated_scales.forEach(scale => {
      if (scale.mode == this.selectedMode) {
        this.tonics.push(scale.notes[0]);
      }
    });
  }

  getDiatonicTriads() {
    this.diatonicTriads = [];
    this.selectedChords = [];
    for (var i = 1; i < 8; i++) {
      let triad = this.diatonic.getDiatonicTriadForScaleDegree(i, MODES[this.selectedScale.mode]);
      this.diatonicTriads.push([this.diatonic.getLabelForTriadInScale(triad, this.selectedScale), triad]);
    }
  }

  selectChord(triad: Triad) {
    this.selectedChords.push(this.diatonic.getSPNForTriad(triad, this.selectedScale, 3));
  }

  // TODO: make this automatic when play button is pressed.
  async enableAudio() {
    await Tone.start()
    console.log('audio is ready')
    //create a synth and connect it to the main output (your speakers)
    this.synth = new Tone.PolySynth(Tone.Synth).toDestination();
    this.volume_icon = "volume_up"
  }

  // TODO: this doesn't take c-index into account (for determining SPN octave)
  testScale() {
    if (this.synth) {
      const now = Tone.now();
      this.diatonic.getSPNForScale(this.selectedScale, 4).forEach((note, index) => {
        this.synth.triggerAttackRelease(note, "8n", now + (index / 4));
      });
    }
  }

  // TODO: Something is wrong with enharmonics. If you play a note from a key with 7 sharps (e.g. C# or cb),
  // then chords with a B# or Fb in them will sound wrong. Not sure why yet, think it's a ToneJS thing.
  testChords() {
    if (this.synth) {
      const now = Tone.now()
      this.selectedChords.forEach((chord, index) => {
        console.log(chord);
        this.synth.triggerAttackRelease(chord, "8n", now + (index / 2));
      });
    } else {
      alert("Press volume button to enable audio")
    }
  }
}
