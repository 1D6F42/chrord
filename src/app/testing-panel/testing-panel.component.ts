import { Component } from '@angular/core';
import { DiatonicService } from '../diatonic.service';
import { MODES } from '../diatonic-definitions';
import { Chord } from '../chord';

import * as Tone from 'tone'

@Component({
  selector: 'app-testing-panel',
  templateUrl: './testing-panel.component.html',
  styleUrls: ['./testing-panel.component.css']
})
export class TestingPanelComponent {

  selectedMode: string = MODES[1]; // 1 is ionian (major / elusive)
  selectedTonic: string = "C"; // C Ionian is the most default key
  selectedChords: Chord[] = [];

  modes: string[] = [];
  tonics: string[] = [];
  diatonicTriads = [];

  volume_icon = "volume_off"

  synth: Tone.PolySynth;

  constructor(readonly diatonic: DiatonicService) {
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
        this.diatonic.activeScale = scale;
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
    // this.selectedChords = [];
    this.diatonic.getDiatonicTriads().forEach(triad => {
      this.diatonicTriads.push([triad.getLabel(), triad]);
    });
  }

  selectChord(chord: Chord) {
    this.selectedChords.push(chord);
  }

  // TODO: make this automatic when play button is pressed.
  async enableAudio() {
    await Tone.start()
    console.log('audio is ready')
    this.synth = new Tone.PolySynth(Tone.Synth).toDestination();
    this.volume_icon = "volume_up"
  }

  testScale() {
    if (this.synth) {
      const now = Tone.now();
      this.diatonic.activeScale.getPitches(4).forEach((note, index) => {
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
        // TODO: this doesn't handle if the active scale has changed since the chord was selected. NEEDS FIXED
        this.synth.triggerAttackRelease(chord.getPitches(), "8n", now + (index / 2));
      });
    } else {
      alert("Press volume button to enable audio")
    }
  }

}
