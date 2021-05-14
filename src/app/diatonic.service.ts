import { Injectable } from '@angular/core';
import { Modes, Triad, TriadShapes, Degrees, cof } from './diatonic'

@Injectable({
  providedIn: 'root'
})

export class DiatonicService {

  mode: number[];

  constructor() {
    this.mode = Modes.ionian;
    this.knowAllKeys();
  }

  // @brief  knows all keys
  knowAllKeys() {

    // Mode	  Tonic relative
    //        to major scale	    Interval sequence	    Example
    // Ionian	      I	            W–W–H–W–W–W–H	    C–D–E–F–G–A–B–C
    // Dorian	      ii	          W–H–W–W–W–H–W	    D–E–F–G–A–B–C–D
    // Phrygian	    iii	          H–W–W–W–H–W–W	    E–F–G–A–B–C–D–E
    // Lydian	      IV	          W–W–W–H–W–W–H	    F–G–A–B–C–D–E–F
    // Mixolydian	  V	            W–W–H–W–W–H–W	    G–A–B–C–D–E–F–G
    // Aeolian	    vi	          W–H–W–W–H–W–W	    A–B–C–D–E–F–G–A
    // Locrian	    viiø	        H–W–W–H–W–W–W	    B–C–D–E–F–G–A–B

    // Test code to generate all 'sharp' keys for all modes. A 'sharp' key is a key with sharps in it, instead of flats.
    // Flat keys will work the same way, but will rotate the opposite way through the cof and accidentals arrays... TBD
    // TODO: currently, when we do flats, C major (and its friends) will be duplicated in sharps / flats. not sure it matters though.

    let note_letters = ["A", "B", "C", "D", "E", "F", "G"];
    let circle_of_fifths = ["C", "G", "D", "A", "E", "B", "F"]; // root notes, sharps / flats get added during scale construction
    let order_of_sharps = ["F", "C", "G", "D", "A", "E", "B"];
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
      console.log("Mode: " + mode_names[modeIndex])
      var cof = this.rotateArray(Object.assign([], circle_of_fifths), modeIndex) // gets the COF for each mode
      for (var x = 0; x < circle_of_fifths.length + 1; x++) { // There are 8 sharp keys. Because one key has none, and then one for each entry in 'order_of_sharps'
        var scale = Object.assign([], note_letters); // make copy of note letters arr
        let index = this.wrapIndex(x); // Turns 8 into 0, because the key with 7 accidentals will start on the same 'root' note name as the key with none.
        // This loop applies the correct number of accidentals for the given step on the circle of fifths (sharps in this case).
        var accidentals: string[] = []; // we want to keep track of accidentals, so we can construct the appropriate chromatic note set for each key 
        for (var i = 0; i < x; i++) {
          accidentals.push(order_of_sharps[i]) // If a note is sharped, we know that the natural is now an accidental  // + "♮" fucks up sort for now so it's left out
          scale[this.deepIndexOf(scale, order_of_sharps[i])] += "#"
          // Remember our 'circle_of_fifths' array doesn't include the accidentals, so we need to apply them if the note should be accidentalised.
          if (cof[index] == order_of_sharps[i]) { // compares the string values, ie if 'C' = 'C' then make it C#
            cof[index] += "#"
          }
        }
        // in a diatonic key of 7 notes, there are always 5 accidentals.
        // Some of them are already known, because we've 'sharped' some notes already. 
        // If there are less than 5 accdentals known, the remaining accidentals will be the remaining sharps from the first 5 order_of_sharps that aren't already in the key.
        while (accidentals.length < 5) {
          accidentals.push(order_of_sharps[accidentals.length] + "#")
        }
        // If there are more than 5 items in the 'accidentals' array, it means we 'sharped' more than 5 notes.
        // if this happens, we know that the first one / two entries will be F and C natural, because they are the first notes in order_of_accidentals.
        // But in a key with 6 or 7 sharps, these won't be accidentals, as they are enharmonic with B# and E#. So we can remove them to get 5.
        while (accidentals.length > 5) {
          accidentals.shift()
        }
        // The chromatic scale that a key is based on is made up of the key, and its accidentals.
        var chromatic_scale: string[] = []
        accidentals.forEach(a => {
          chromatic_scale.push(a)
        });
        scale.forEach(s => {
          chromatic_scale.push(s)
        });
        // Test printing. 'rotateArray' is just used to have the first note of the scale be first in the list.
        scale = this.rotateArray(scale, this.deepIndexOf(scale, cof[index]));
        chromatic_scale = this.rotateArray(chromatic_scale, this.deepIndexOf(chromatic_scale.sort(), cof[index]));
        console.log("Scale: " + scale + "\t - (Diatonic): " + chromatic_scale + "\t - Accidentals: " + accidentals)
        // outSharps.push(cof[index] + ": " + this.rotateArray(scale, this.deepIndexOf(scale, cof[index])).toString() + ", Accidentals: " + accidentals.toString())
      }
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
