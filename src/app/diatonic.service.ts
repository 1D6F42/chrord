import { Injectable } from '@angular/core';
import { Modes, Triad, TriadShapes, Degrees, cof } from './diatonic'

@Injectable({
  providedIn: 'root'
})

export class DiatonicService {

  mode: number[];

  constructor() {
    this.mode = Modes.ionian;


    let notes = ["A", "B", "C", "D", "E", "F", "G"];
    let clockwise = ["C", "G", "D", "A", "E", "B", "F"];
    let counter = ["C", "F", "B", "E", "A", "D", "G"];
    let sharps = ["F", "C", "G", "D", "A", "E", "B"];
    let flats = ["B", "E", "A", "D", "G", "C", "F"];

    // I am become death

    for (var md = 0; md < 7; md++) {
      var outSharps: string[] = []
      console.log("Mode: " + Modes.offsets[md])
      this.rotateArray(Object.assign([], clockwise), md).forEach((key, index) => {
        var scale = Object.assign([], notes);
        for (var i = 0; i < index; i++) {
          scale[this.deepIndexOf(scale, sharps[i])] += "#"
          if (key == sharps[i]) {
            key += "#"
          }
        }
        outSharps.push(this.rotateArray(scale, this.deepIndexOf(scale, key)).toString())
      });

      // I think this is working but i need to work out why it's working

      var outFlats: string[] = []
      this.rotateArray(Object.assign([], counter), md).forEach((key, index) => {
        var scale = Object.assign([], notes);
        for (var i = 0; i < index; i++) {
          scale[this.deepIndexOf(scale, flats[i])] += "b"
          if (key == flats[i]) {
            key += "b"
          }
        }
        outFlats.push(this.rotateArray(scale, this.deepIndexOf(scale, key)).toString())
      });

      console.log(outSharps)
      console.log(outFlats)

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

  wrapIndex(i: number): number {

    // this is magic that makes scale degrees above 7 map to the correct value.

    return (i % this.mode.length + this.mode.length) % this.mode.length;
  }

}
