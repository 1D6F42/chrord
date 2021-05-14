import { Injectable, ɵCompiler_compileModuleSync__POST_R3__ } from '@angular/core';
import { Triad, TriadShapes, Degrees, Scale, MODE, ModeIntervals } from './diatonic-definitions'
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root'
})

export class DiatonicService {

  public generated_scales: Scale[] = [];

  constructor(private readonly util: UtilService) {
  }

  // @brief  knows all scales
  knowAllScales() {

    // Mode	  Tonic relative
    //        to major scale	    Interval sequence	    Example
    // Ionian	      I	            W–W–H–W–W–W–H	    C–D–E–F–G–A–B–C
    // Dorian	      ii	          W–H–W–W–W–H–W	    D–E–F–G–A–B–C–D
    // Phrygian	    iii	          H–W–W–W–H–W–W	    E–F–G–A–B–C–D–E
    // Lydian	      IV	          W–W–W–H–W–W–H	    F–G–A–B–C–D–E–F
    // Mixolydian	  V	            W–W–H–W–W–H–W	    G–A–B–C–D–E–F–G
    // Aeolian	    vi	          W–H–W–W–H–W–W	    A–B–C–D–E–F–G–A
    // Locrian	    viiø	        H–W–W–H–W–W–W	    B–C–D–E–F–G–A–B

    // Test code to generate all 'sharp' scales for all modes. A 'sharp' scale is a scale with sharps in it, instead of flats.
    // Flat scales will work the same way, but will rotate the opposite way through the arrays, because the order of sharps is opposite to the order of flats

    let order_of_sharps = ["F", "C", "G", "D", "A", "E", "B"];
    let order_of_flats = ["B", "E", "A", "D", "G", "C", "F"];

    let num_modes = 7;
    let num_scales = 8;

    // Basically, the way this function works is:
    // - For each mode, create a rotated copy of the order_of_sharps array, moving the tonic of the scale with no sharps to the start.
    // - There are 8 sharp keys, so iterate 8 times. Each time, create a 'blank' scale, and then add 0 - 7 sharps to it depending on the iterator value
    // - Rotate each scale so that the tonic of the scale (given the mode we're in) lies at the start.
    // - Track which notes aren't in the scale, so we can build the correct set of 12 notes around the scale.

    for (var modeIndex = 0; modeIndex < num_modes; modeIndex++) {
      var mode_sharps = this.util.rotateArray(Object.assign([], order_of_sharps), modeIndex); // rotate order_of_sharps so the 0-sharp scale is at the start
      var mode_flats = this.util.rotateArray(Object.assign([], order_of_flats), modeIndex); // rotate order_of_flats so the 0-flat scale is at the start
      for (var scale_num = 0; scale_num < num_scales; scale_num++) { // One scale has 0 sharps, so we need to add 1 to the length.
        // Create a scale containing just the note names. We use this as a base scale to modify later.
        var sharp_scale = Object.assign([], order_of_sharps).sort();
        var flat_scale = Object.assign([], order_of_flats).sort();

        // We need our array index to wrap, because a scale with 7 sharps will start on the same natural note name as the scale with no sharps.
        let wrapped = this.util.wrapIndex(scale_num);

        var sharp_accidentals: string[] = []; // we want to keep track of accidentals, so we can construct the appropriate chromatic note set for each scale
        var flat_accidentals: string[] = [];

        // This loop will execute the same number of times that there are sharps, and sharp that many notes
        for (var i = 0; i < scale_num; i++) {
          sharp_accidentals.push(order_of_sharps[i]); // If a note is sharped, we know that the natural is now an accidental, so add it to the accidentals array
          flat_accidentals.push(order_of_flats[i]);
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
        while (sharp_accidentals.length < 5) {
          sharp_accidentals.push(order_of_sharps[sharp_accidentals.length] + "#");
          flat_accidentals.push(order_of_flats[flat_accidentals.length] + "b");
        }

        // If there are more than 5 items in the 'accidentals' array, it means we 'sharped' more than 5 notes.
        // if this happens, we know that the first one / two entries in 'accidentals' will be F and C natural, because they are the first notes in order_of_accidentals.
        // But in a scale with 6 or 7 sharps, these won't be accidentals, as they are enharmonic with B# and E#. So we can remove them to get 5.
        while (sharp_accidentals.length > 5) {
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

        sharp_chromatic_scale = this.util.rotateArray(sharp_chromatic_scale, this.util.sortArrayOfNotes(sharp_chromatic_scale).indexOf(mode_sharps[wrapped]));
        flat_chromatic_scale = this.util.rotateArray(flat_chromatic_scale, this.util.sortArrayOfNotes(flat_chromatic_scale).indexOf(mode_flats[wrapped]));

        // 'rotateArray' puts the correct note at the start of the scale. 
        sharp_scale = this.util.rotateArray(sharp_scale, sharp_scale.indexOf(mode_sharps[wrapped]));
        flat_scale = this.util.rotateArray(flat_scale, flat_scale.indexOf(mode_flats[wrapped]));

        // the 6 - modeIndex is because we're going backwards for flat scales
        this.generated_scales.push(new Scale(sharp_scale, sharp_accidentals, sharp_chromatic_scale, MODE[modeIndex]));
        this.generated_scales.push(new Scale(flat_scale, flat_accidentals, flat_chromatic_scale, MODE[6 - modeIndex]));
      }
    }
  }

  getDiatonicTriadForScaleDegree(scaleDegree: number, mode: number): Triad { // TODO: mode should be refactored out of this class, the function should take it as an input.

    // This function creates a Triad for given scale degree. 'Diatonic Triad' means that the notes of the triad
    // will fall within the selected diatonic mode, no funky business.

    // Start by getting the array indexes that we need to add up

    let i = scaleDegree - 2; // arrays start at 0, but scale degrees start at 1, and there's no interval entry for the tonic.

    let ii = this.util.wrapIndex(i + 1);
    let iii = this.util.wrapIndex(ii + 1);
    let iv = this.util.wrapIndex(iii + 1);
    let v = this.util.wrapIndex(iv + 1);

    let firstInterval = ModeIntervals.all[mode][ii] + ModeIntervals.all[mode][iii];
    let secondInterval = ModeIntervals.all[mode][iv] + ModeIntervals.all[mode][v];

    let triad = new Triad(firstInterval, secondInterval, scaleDegree);

    return triad;
  }

  getNotesForTriadInScale(triad: Triad, scale: Scale): string[] {
    let index = triad.degree - 1;
    let root = scale.notes[index];
    let rotatedChroma = this.util.rotateArray(Object.assign([], scale.chromatic), scale.chromatic.indexOf(root));
    // TODO: red alert, red alert, i think the findindexof function is FUCKED AND NEEDS TO BE REWRITTEN
    let thirdIndex = triad.intervals[1];
    let fifthIndex = thirdIndex + triad.intervals[2];

    return [root, rotatedChroma[thirdIndex], rotatedChroma[fifthIndex]];
  }

  getLabelForTriadInScale(triad: Triad, scale: Scale) {

    // uppercase is default, as it lets me use lowercase b as flat symbol more easily

    let note = scale.notes[triad.degree-1];
    let degree = Degrees.text[triad.degree];

    if (triad.matchShape(TriadShapes.major)) {
      return note + " - " + degree;
    }
    if (triad.matchShape(TriadShapes.minor)) {
      return note.toLowerCase() + " - " + degree.toLowerCase();
    }
    if (triad.matchShape(TriadShapes.diminished)) {
      return note.toLowerCase() + " dim" + " - " + degree.toLowerCase() + "o";
    }
    if (triad.matchShape(TriadShapes.augmented)) {
      return note + " aug" + " - " + degree + "+";
    }
    if (triad.matchShape(TriadShapes.sus2)) {
      return note + " sus2" + " - " + degree + "sus2";
    }
    if (triad.matchShape(TriadShapes.sus4)) {
      return note + " sus4" + " - " + degree + "sus4";
    }
    return "?"
  }
}
