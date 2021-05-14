import { Injectable } from '@angular/core';
import { Modes, Triad, TriadShapes, Degrees, cof } from './diatonic'

@Injectable({
  providedIn: 'root'
})

export class DiatonicService {

  mode: number[];

  constructor() {
    this.mode = Modes.ionian;

    // Mode	  Tonic relative
    //        to major scale	    Interval sequence	    Example
    // Ionian	      I	            W–W–H–W–W–W–H	    C–D–E–F–G–A–B–C
    // Dorian	      ii	          W–H–W–W–W–H–W	    D–E–F–G–A–B–C–D
    // Phrygian	    iii	          H–W–W–W–H–W–W	    E–F–G–A–B–C–D–E
    // Lydian	      IV	          W–W–W–H–W–W–H	    F–G–A–B–C–D–E–F
    // Mixolydian	  V	            W–W–H–W–W–H–W	    G–A–B–C–D–E–F–G
    // Aeolian	    vi	          W–H–W–W–H–W–W	    A–B–C–D–E–F–G–A
    // Locrian	    viiø	        H–W–W–H–W–W–W	    B–C–D–E–F–G–A–B

    // Test code to generate all 'sharp' keys for all modes.
    // Flat keys will work the same way, but rotate the opposite way through the cof and accidentals arrays... TBD

    let note_letters = ["A", "B", "C", "D", "E", "F", "G"]; 
    let circle_of_fifths = ["C", "G", "D", "A", "E", "B", "F"]; // root notes, sharps / flats get added during scale construction
    let order_of_accidentals = ["F", "C", "G", "D", "A", "E", "B"];
    let mode_names = [ // ordered by their COF rotation index...
      "ionian",
      "mixolydian",
      "dorian",
      "aeolian",
      "phrygian",
      "locrian",
      "lydian"
  ]

    // A mode can be represented as a rotation in the circle of fifths.
    // This outer loop defines a 'modeIndex', which is used to rotate the 'cof' array
    for (var modeIndex = 0; modeIndex < circle_of_fifths.length; modeIndex++) {
      var outSharps: string[] = []
      console.log("Mode: " + mode_names[modeIndex])
      var cof = this.rotateArray(Object.assign([], circle_of_fifths), modeIndex) // gets the COF for each mode
      for (var x = 0; x < circle_of_fifths.length + 1; x++) { // There are 8 sharp keys. Because one key has none, and then one for each entry in 'order_of_accidentals'
        var scale = Object.assign([], note_letters); // make copy of note letters arr
        let index = this.wrapIndex(x); // Turns 8 into 0, because the key with 7 accidentals will start on the same 'root' note name as the key with none.
        // This loop applies the correct number of accidentals for the given step on the circle of fifths (sharps in this case).
        for (var i = 0; i < x; i++) { 
          scale[this.deepIndexOf(scale, order_of_accidentals[i])] += "#"
          // Remember our 'circle_of_fifths' array doesn't include the accidentals, so we need to apply them if the note should be accidentalised.
          if (cof[index] == order_of_accidentals[i]) { // compares the string values, ie if 'C' = 'C' then make it C#
            cof[index] += "#"
          }
        }
        outSharps.push(this.rotateArray(scale, this.deepIndexOf(scale, cof[index])).toString())
      }
      console.log(outSharps)
    }
  }

  deepIndexOf(arr: any[], obj: any): number {
    return arr.findIndex(function (cur) {
      return Object.keys(obj).every(function (key) {
        return obj[key] === cur[key];
      });
    });
  }

  rotateArray(array: any[], count: number): any[] {
    while (count--) {
      var tmp = array.shift();
      array.push(tmp);
    }
    return array;
  }


  getDiatonicTriadForScaleDegree(scaleDegree: number): Triad {

    // This function creates a Triad for given scale degree. 'Diatonic Triad' means that the notes of the triad
    // will fall within the selected diatonic mode, no funky business.

    // Start by getting the array indexes that we need to add up

    let i = scaleDegree - 2; // arrays start at 0, but scale degrees start at 1, and there's no interval entry for the tonic.

    let ii = this.wrapIndex(i + 1);
    let iii = this.wrapIndex(ii + 1);
    let iv = this.wrapIndex(iii + 1);
    let v = this.wrapIndex(iv + 1);

    let firstInterval = this.mode[ii] + this.mode[iii];
    let secondInterval = this.mode[iv] + this.mode[v];

    let triad = new Triad(firstInterval, secondInterval, scaleDegree);

    return triad;
  }

  getLabelForTriadDegree(triad: Triad) {
    if (triad.matchShape(TriadShapes.major)) {
      return Degrees.text[triad.degree].toUpperCase();
    }
    if (triad.matchShape(TriadShapes.minor)) {
      return Degrees.text[triad.degree].toLowerCase();
    }
    if (triad.matchShape(TriadShapes.diminished)) {
      return Degrees.text[triad.degree].toLowerCase() + "o";
    }
    if (triad.matchShape(TriadShapes.augmented)) {
      return Degrees.text[triad.degree].toUpperCase() + "+";
    }
    if (triad.matchShape(TriadShapes.sus2)) {
      return Degrees.text[triad.degree].toUpperCase + "sus2";
    }
    if (triad.matchShape(TriadShapes.sus4)) {
      return Degrees.text[triad.degree].toUpperCase + "sus4";
    }
  }

  wrapIndex(i: number): number { // todo: make this take array length

    // this is magic that makes scale degrees above 7 map to the correct value.

    return (i % this.mode.length + this.mode.length) % this.mode.length;
  }

}
