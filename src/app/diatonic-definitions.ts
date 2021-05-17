export class Intervals {
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

export enum MODES {
    Lydian,
    Ionian,
    Mixolydian,
    Dorian,
    Aeolian,
    Phrygian,
    Locrian
}

export class ModeIntervals {

    // Defines the interval values of the diatonic modes, with the first entry denoting the interval from degree i to ii
    // same order as above.
    public static all = [[2, 2, 2, 1, 2, 2, 1],
                        [2, 2, 1, 2, 2, 2, 1],
                        [2, 2, 1, 2, 2, 1, 2],
                        [2, 1, 2, 2, 2, 1, 2],
                        [2, 1, 2, 2, 1, 2, 2],
                        [1, 2, 2, 2, 1, 2, 2],
                        [1, 2, 2, 1, 2, 2, 2]];
}

export class Scale {
    notes: string[];
    accidentals: string[];
    chromatic: string[];
    mode: string;

    constructor(notes: string[], accidentals: string[], chromatic: string[], mode: string) {
        this.notes = notes;
        this.accidentals = accidentals;
        this.chromatic = chromatic;
        this.mode = mode;
    }
}

export class Triad {

    // A triad is defined by the intervals between its notes, and optionally, the scale degree that it starts on.

    degree: number;
    intervals: number[]

    constructor(firstInterval: number, secondInterval: number, degree?: number) {
        this.intervals = [Intervals.unison, firstInterval, secondInterval];
        this.degree = degree;
    }

    // todo: create second constructor taking array of 3 intervals, for making from TriadShapes

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

export class TriadShapes {
    public static major = [Intervals.unison, Intervals.majorThird, Intervals.minorThird];
    public static minor = [Intervals.unison, Intervals.minorThird, Intervals.majorThird];
    public static diminished = [Intervals.unison, Intervals.minorThird, Intervals.minorThird];
    public static augmented = [Intervals.unison, Intervals.majorThird, Intervals.majorThird];
    public static sus2 = [Intervals.unison, Intervals.majorSecond, Intervals.perfectFourth];
    public static sus4 = [Intervals.unison, Intervals.perfectFourth, Intervals.majorSecond];
}
