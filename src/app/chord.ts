import { Scale } from './scale';
import { ChordShapes, Degrees } from './diatonic-definitions';
import { Util } from './Utilities';

// TODO: This class has become messy and needs cleaning up / refactoring

export class Chord {
    // ... a chord is defined by it's chromatic intervals and the chromatic index that it starts on. 
    // The chr_index is optional, because we might want to treat the chord only according to its shape.

    scale: Scale;
    chr_index: number;
    intervals: number[];
    octave: number;

    constructor(intervals: number[], chr_index?: number, scale?: Scale, octave?: number) {
        if (chr_index !== undefined) {
            this.chr_index = chr_index;
        }
        if (scale !== undefined) {
            this.scale = scale;
        }
        if (octave === undefined) {
            this.octave = 4;
        } else {
            this.octave = octave;
        }

        this.intervals = intervals;
    }

    private matchShape(shape: number[]): boolean {

        if (shape === this.intervals) return true;
        if (shape == null || this.intervals == null) return false;
        if (shape.length !== this.intervals.length) return false;

        for (var i = 0; i < shape.length; ++i) {
            if (shape[i] !== this.intervals[i]) return false;
        }

        return true;
    }

    modifyNote(index: number, mod: number) {

        // This function moves the note in the chord at 'index" up or down by the value of 'mod'
        // It won't allow notes to move above or below neighbouring notes. 
        // It doesn't currently stop notes moving out-of-bounds of tone.js.

        if (index === 0) {
            if (this.intervals[0] - mod > 0) {
                // We want to dec / increment the root octave of this chord of we're passing the c-index.
                // the % 12 on decrement is because c scales have a c_index of 12, rather than 0. TODO: might want to improve this.
                if (this.chr_index == this.scale.c_index % 12 && (this.chr_index + mod) <= this.scale.c_index % 12) {
                    this.octave--;
                }
                else if (this.chr_index < this.scale.c_index && (this.chr_index + mod) == this.scale.c_index) {
                    console.log("inc")
                    this.octave++;
                }
                this.chr_index = Util.wrapIndex(this.chr_index + mod, 12);
                this.intervals[0] = this.intervals[0] - mod;
            }
        } else {
            if (this.intervals[index - 1] + mod > 0) {
                if (index < this.intervals.length) {
                    if (this.intervals[index] - mod > 0) {
                        this.intervals[index] = this.intervals[index] - mod;
                        this.intervals[index - 1] = this.intervals[index - 1] + mod;
                    }
                } else {
                    this.intervals[index - 1] = this.intervals[index - 1] + mod;
                }
            }
        }
    }

    getNotes(): string[] {
        var notes: string[] = [];

        // get root note name
        var root = this.scale.chromatic[this.chr_index];

        // get the chromatic scale index of the root note
        var note_index = this.chr_index;

        notes.push(root);

        this.intervals.forEach(interval => {
            note_index += interval;
            notes.push(this.scale.chromatic[Util.wrapIndex(note_index, 12)]);
        });

        return notes;
    }


    // Gets the Scientific Pitch Notation. Returns an array of notes like "[A4, C#5, E5]"
    getPitchNotation(): string[] {

        var notes: string[] = [];

        // get root note name
        var root = this.scale.chromatic[this.chr_index];

        // get the chromatic scale index of the root note
        var note_index = this.chr_index;

        root += this.octave;

        // if the root is above the c-index, the later notes don't need to be bumped the first time that they are above it...
        var rootModifier = note_index >= this.scale.c_index ? 0 : 1;

        notes.push(root);

        this.intervals.forEach(interval => {
            note_index += interval;

            // The following line adds the correct octave number, based on:
            // - The input 'octave' var (base octave of the scale the chord is in)
            // - whether the note is passed the first 'C' (note index > c_index)
            // - whether the note is passed x additional 'C's (noteindex - c index) / 12

            let pitch_octave = note_index >= this.scale.c_index ? this.octave + rootModifier + Math.floor((note_index - this.scale.c_index) / 12) : this.octave;

            let note = this.scale.chromatic[Util.wrapIndex(note_index, 12)];
            notes.push(note + pitch_octave);
        });

        return notes;
    }

    getOctaveNumbers(): number[] {
        // Returns an array of octave offsets relative to the root note.

        var pitches = [0];

        let tally = 0;

        this.intervals.forEach(interval => {
            tally += interval;
            pitches.push(Math.floor(tally / 12));
        });

        return pitches;
    }

    getLabel(): string {

        // uppercase is default, as it lets me use lowercase b as flat symbol more easily
        // using the _actual_ flat symbol doesn't work with tone.js ironically.

        let note = this.scale.chromatic[this.chr_index];
        var degree = Degrees.text[this.scale.notes.indexOf(note)];

        if (degree === undefined) {
            degree = "-";
        }

        if (this.matchShape(ChordShapes.major)) {
            return note + " / " + degree;
        }
        if (this.matchShape(ChordShapes.minor)) {
            return note.toLowerCase() + " / " + degree.toLowerCase();
        }
        if (this.matchShape(ChordShapes.diminished)) {
            return note.toLowerCase() + " dim" + " / " + degree.toLowerCase() + "o";
        }
        if (this.matchShape(ChordShapes.augmented)) {
            return note + " aug" + " / " + degree + "+";
        }
        if (this.matchShape(ChordShapes.sus2)) {
            return note + " sus2" + " / " + degree + "sus2";
        }
        if (this.matchShape(ChordShapes.sus4)) {
            return note + " sus4" + " / " + degree + "sus4";
        }
        if (this.matchShape(ChordShapes.maj7)) {
            return note + "M7" + " / " + degree + " maj 7";
        }
        if (this.matchShape(ChordShapes.dom7)) {
            return note + "7" + " / " + degree + "7";
        }
        if (this.matchShape(ChordShapes.dim7)) {
            return note + "o7" + " / " + degree + " dim 7";
        }
        return ""
    }

    getColor(): string {
        if (this.matchShape(ChordShapes.major)) {
            return "#db4444"
        }
        if (this.matchShape(ChordShapes.minor)) {
            return "#4479db"
        }
        if (this.matchShape(ChordShapes.diminished)) {
            return "#5ed65c"
        }
        if (this.matchShape(ChordShapes.augmented)) {
            return "#8a44db"
        }
        if (this.matchShape(ChordShapes.sus2)) {
            return "#b844db"
        }
        if (this.matchShape(ChordShapes.sus4)) {
            return "#44db90"
        }
        if (this.matchShape(ChordShapes.maj7)) {
            return "#de7a40"
        }
        if (this.matchShape(ChordShapes.dom7)) {
            return "#40afdb"
        }
        if (this.matchShape(ChordShapes.dim7)) {
            return "#6440db"
        }
        return "#888"
    }
}
