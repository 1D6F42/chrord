export enum MODES {
    Lydian,
    Ionian,
    Mixolydian,
    Dorian,
    Aeolian,
    Phrygian,
    Locrian
}

export class Intervals { // this could be an enum idiot
    public static unison = 0;
    public static minorSecond = 1; // semitone
    public static majorSecond = 2; // tone
    public static minorThird = 3;
    public static majorThird = 4;
    public static perfectFourth = 5;
    public static tritone = 6; // dim 5th, aug 4th
    public static perfectFifth = 7;
    public static minorSixth = 8;
    public static majorSixth = 9;
    public static minorSeventh = 10;
    public static majorSeventh = 11;
    public static octave = 12;
}

export class Degrees {
    public static tonic = "1";
    public static supertonic = "2";
    public static mediant = "3";
    public static subdominant = "4";
    public static dominant = "5";
    public static submediant = "6";
    public static leadingTone = "7";
    public static text = ["-", "I", "II", "III", "IV", "V", "VI", "VII"];
}

export class Scale {
    notes: string[];        // Text representation of notes in the scale, e.g. ["C", "D", "E", "F", "G", "A", "B"];
    c_index: number;        // The index of c-natural (or B#) in the scale, used to determine pitch notation, e.g. C#4
    accidentals: string[];  // The notes that are not natural to the scale. Not used anywhere yet.
    chromatic: string[];    // The chromatic scale of 12 notes that this scale of 7 notes is based on. 
    mode: string;           // The mode...

    constructor(notes: string[], c_index: number, accidentals: string[], chromatic: string[], mode: string) {
        this.notes = notes;
        this.c_index = c_index;
        this.accidentals = accidentals;
        this.chromatic = chromatic;
        this.mode = mode;
    }
}

export class Chord {
    // ... a chord is defined by it's chromatic intervals and the degree that it starts on. 
    // The degree is optional, because we might want to treat the chord only according to its shape.

    degree: number;
    intervals: number[]

    constructor(intervals: number[], degree?: number){
        this.intervals = intervals;
        this.degree = degree;
    }

    matchShape(shape: number[]): boolean {

        if (shape === this.intervals) return true;
        if (shape == null || this.intervals == null) return false;
        if (shape.length !== this.intervals.length) return false;

        for (var i = 0; i < shape.length; ++i) {
            if (shape[i] !== this.intervals[i]) return false;
        }

        return true;
    }
}

export class ChordShapes {
    public static major = [Intervals.majorThird, Intervals.minorThird];
    public static minor = [Intervals.minorThird, Intervals.majorThird];
    public static diminished = [Intervals.minorThird, Intervals.minorThird];
    public static augmented = [Intervals.majorThird, Intervals.majorThird];
    public static sus2 = [Intervals.majorSecond, Intervals.perfectFourth];
    public static sus4 = [Intervals.perfectFourth, Intervals.majorSecond];
}
