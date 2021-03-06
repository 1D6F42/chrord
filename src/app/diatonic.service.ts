import { Injectable } from '@angular/core';
import { MODES } from './diatonic-definitions'
import { Scale } from './scale';
import { Chord } from './chord';
import { Util } from './Utilities';

@Injectable({
  providedIn: 'root'
})

export class DiatonicService {

  public generated_scales: Scale[] = [];

  public activeScale: Scale;

  constructor() {
    this.knowAllScales();
  }

  // @brief  knows all scales
  knowAllScales() {

    // 	       Tonic relative
    // Mode    to major scale	  Interval sequence	      Example
    // Ionian	      I	            W–W–H–W–W–W–H	    C–D–E–F–G–A–B–C
    // Dorian	      ii	          W–H–W–W–W–H–W	    D–E–F–G–A–B–C–D
    // Phrygian	    iii	          H–W–W–W–H–W–W	    E–F–G–A–B–C–D–E
    // Lydian	      IV	          W–W–W–H–W–W–H	    F–G–A–B–C–D–E–F
    // Mixolydian	  V	            W–W–H–W–W–H–W	    G–A–B–C–D–E–F–G
    // Aeolian	    vi	          W–H–W–W–H–W–W	    A–B–C–D–E–F–G–A
    // Locrian	    viiø	        H–W–W–H–W–W–W	    B–C–D–E–F–G–A–B

    // This function generates all scales for all modes. Scales can either be 'flat' scales or 'sharp' scales. A sharp scale has sharps in it,
    // a flat scale has flats in it. There are 7 of each for every mode, not including the scale that has zero sharps or flats (this adds up to 15 overall).
    // Each consecutive sharp/flat key has one more sharp/flat than the one that came before it. The order in which notes get 'sharped' or 'flatted' is
    // predetermined, which is what makes this whole thing work.

    // These arrays define the order of sharping / flatting. They are opposite each other wow.

    let order_of_sharps = ["F", "C", "G", "D", "A", "E", "B"];
    let order_of_flats = Object.assign([], order_of_sharps).reverse();

    let num_modes = 7; // There are 7 diatonic modes
    let num_scales = 8; // There are 8 sharp scales and 8 flat scales (the no sharp/flat one gets duplicated...)

    // Basically, the way this function works is:
    // - For each mode, create a rotated copy of the order_of_[...] array, moving the tonic of the scale with no sharps/flats in that mode to the start.
    // - There are 8 sharp/flat keys, so iterate 8 times. Each time, create a 'blank' scale, and then add 0 - 7 sharps/flats to it depending on the iterator value
    // - Rotate each scale so that the tonic of the scale (given the mode we're in) lies at the start.
    // - Track which notes aren't in the scale, so we can build the correct set of 12 notes that make up the corresponding 'chromatic' scale.

    for (var modeIndex = 0; modeIndex < num_modes; modeIndex++) {
      var mode_sharps = Util.rotateArray(Object.assign([], order_of_sharps), modeIndex); // rotate order_of_sharps so the 0-sharp scale is at the start
      var mode_flats = Util.rotateArray(Object.assign([], order_of_flats), modeIndex); // rotate order_of_flats so the 0-flat scale is at the start
      for (var scale_num = 0; scale_num < num_scales; scale_num++) { // One scale has 0 sharps/flats, so we need to add 1 to the length.
        // Create a scale containing just the note names. We use this as a base scale to modify later.
        var sharp_scale = Object.assign([], order_of_sharps).sort();
        var flat_scale = Object.assign([], order_of_flats).sort();

        // We need our array index to wrap, because a scale with 7 sharps/flats will start on the same natural note name as the scale with no sharps/flats.
        let wrapped = Util.wrapIndex(scale_num);

        var sharp_accidentals: string[] = []; // we want to keep track of accidentals, so we can construct the appropriate chromatic note set for each scale
        var flat_accidentals: string[] = [];

        // This loop will execute the same number of times that there are sharps/flats, and sharp/flat that many notes
        for (var i = 0; i < scale_num; i++) {
          sharp_accidentals.push(order_of_sharps[i]); // If a note is sharped, we know that the natural is now an accidental, so add it to the accidentals array
          flat_accidentals.push(order_of_flats[i]); // same
          // "♮" 
          sharp_scale[sharp_scale.indexOf(order_of_sharps[i])] += "#" // find the note in our scale and sharp it
          flat_scale[flat_scale.indexOf(order_of_flats[i])] += "b"
          // This sharps the name / label of the scale if applicable.
          if (mode_sharps[wrapped] == order_of_sharps[i]) {
            mode_sharps[wrapped] += "#";
          }
          if (mode_flats[wrapped] == order_of_flats[i]) {
            mode_flats[wrapped] += "b";
          }
        }

        // in a diatonic scale of 7 notes, there are always 5 accidentals.
        // Some of them are already known, because we've 'sharped' some notes already. 

        // If there are less than 5 accidentals known, the remaining accidentals will be the remaining sharps from the first 5 order_of_sharps that aren't already in the scale.
        while (sharp_accidentals.length < 5) { // sharps / flats will have same length so don't have to repeat this for flats
          sharp_accidentals.push(order_of_sharps[sharp_accidentals.length] + "#");
          flat_accidentals.push(order_of_flats[flat_accidentals.length] + "b");
        }

        // If there are more than 5 items in the 'accidentals' array, it means we 'sharped' more than 5 notes.
        // if this happens, we know that the first one / two entries in 'accidentals' will be F and C natural, because they are the first notes in order_of_accidentals.
        // But in a scale with 6 or 7 sharps, these won't be accidentals, as they are enharmonic with B# and E#. So we can remove them to get 5.
        while (sharp_accidentals.length > 5) {// sharps / flats will have same length so don't have to repeat this for flats
          sharp_accidentals.shift();
          flat_accidentals.shift();
        }
        // The chromatic scale that a scale is based on is made up of the scale, and its accidentals.
        var sharp_chromatic_scale: string[] = []
        sharp_accidentals.forEach(a => {
          sharp_chromatic_scale.push(a);
        });
        sharp_scale.forEach(s => {
          sharp_chromatic_scale.push(s);
        });
        var flat_chromatic_scale: string[] = []
        flat_accidentals.forEach(a => {
          flat_chromatic_scale.push(a);
        });
        flat_scale.forEach(s => {
          flat_chromatic_scale.push(s);
        });

        sharp_chromatic_scale = Util.rotateArray(sharp_chromatic_scale, Util.sortArrayOfNotes(sharp_chromatic_scale).indexOf(mode_sharps[wrapped]));
        flat_chromatic_scale = Util.rotateArray(flat_chromatic_scale, Util.sortArrayOfNotes(flat_chromatic_scale).indexOf(mode_flats[wrapped]));

        // The octave component Scientific Pitch Notation (SPN, e.g. C#4, Eb2, etc) increments on each 'C' natural. We need to know what index in the
        // scale the next C-natural is at so that we can generate notes correctly later.

        var sharp_c_index = sharp_chromatic_scale.indexOf("C");
        var flat_c_index = flat_chromatic_scale.indexOf("C");

        // Sometimes C natural is called B Sharp because reasons
        sharp_c_index = sharp_c_index == -1 ? sharp_chromatic_scale.indexOf("B#") : sharp_c_index;
        flat_c_index = sharp_c_index == -1 ? flat_chromatic_scale.indexOf("B#") : flat_c_index;

        // If it's a C natural scale, the index of the _next_ C is 12...
        sharp_c_index = sharp_c_index == 0 ? 12 : sharp_c_index;
        flat_c_index = flat_c_index == 0 ? 12 : flat_c_index;

        // 'rotateArray' puts the correct note at the start of the scale. 
        sharp_scale = Util.rotateArray(sharp_scale, sharp_scale.indexOf(mode_sharps[wrapped]));
        flat_scale = Util.rotateArray(flat_scale, flat_scale.indexOf(mode_flats[wrapped]));

        // the '6 - modeIndex' is because we're going backwards for flat scales
        this.generated_scales.push(new Scale(sharp_scale, sharp_c_index, sharp_accidentals, sharp_chromatic_scale, MODES[modeIndex]));
        this.generated_scales.push(new Scale(flat_scale, flat_c_index, flat_accidentals, flat_chromatic_scale, MODES[6 - modeIndex]));
      }
    }
  }

  getDiatonicTriads(scale?: Scale): Chord[] {

    if (scale === undefined) {
      scale = this.activeScale;
    }

    // Returns all 7 diatonic triads for a given scale. Diatonic triads meaning triads containing only natural notes from the scale.

    // Getting the indices of the notes in this scale on the chromatic will let us find the intervals between notes on the diatonic triad.

    var indices: number[] = [];
    scale.notes.forEach(note => {
      indices.push(scale.chromatic.indexOf(note));
    });

    var triads: Chord[] = [];
    indices.forEach((value, index) => {

      // Get the 1, 3 and 5 notes:
      let i = value;
      let iii = indices[Util.wrapIndex(index + 2)]
      let v = indices[Util.wrapIndex(index + 4)]

      // Fix wrapping if necessary (if a note has trespassed into the next octave)
      if (iii < i) iii += 12;
      if (v < i) v += 12;

      triads.push(new Chord([iii - i, v - iii], value, this.activeScale));
    });
    return triads;
  }
}

