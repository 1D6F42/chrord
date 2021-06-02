export enum MODES {
    Lydian,
    Ionian,
    Mixolydian,
    Dorian,
    Aeolian,
    Phrygian,
    Locrian
}

export const enum Intervals {
    unison,
    minorSecond, // semitone
    majorSecond, // tone
    minorThird,
    majorThird,
    perfectFourth,
    tritone, // dim 5th, aug 4th
    perfectFifth,
    minorSixth,
    majorSixth,
    minorSeventh,
    majorSeventh,
    octave
}

export enum Degrees {
    "I",
    "II",
    "III",
    "IV",
    "V",
    "VI",
    "VII"
}

export enum DegreeNames { // unused
    tonic,
    supertonic,
    mediant,
    subdominant,
    dominant,
    submediant,
    leadingTone
}

export enum ChordColors {
    major = "#A53F2B",
    minor = "#81A4CD",
    diminished = "#AEC5EB",
    augmented = "#78BC61",
    sus2 = "#388659",
    sus4 = "#388659",
    maj7 = "#F7B538",
    dom7 = "#F7B538",
    dim7 = "#AEC5EB",
    major1nv = "#A53F2B",
    major2nv = "#A53F2B",
    minor1nv = "#81A4CD",
    minor2nv = "#81A4CD",
    default = "#424C55"
}

export class ChordShapes {
    public static major = [Intervals.majorThird, Intervals.minorThird];
    public static minor = [Intervals.minorThird, Intervals.majorThird];
    public static diminished = [Intervals.minorThird, Intervals.minorThird];
    public static augmented = [Intervals.majorThird, Intervals.majorThird];
    public static sus2 = [Intervals.majorSecond, Intervals.perfectFourth];
    public static sus4 = [Intervals.perfectFourth, Intervals.majorSecond];
    public static maj7 = [Intervals.majorThird, Intervals.minorThird, Intervals.majorThird];
    public static dom7 = [Intervals.majorThird, Intervals.minorThird, Intervals.majorThird];
    public static dim7 = [Intervals.minorThird, Intervals.majorSecond, Intervals.minorThird];
    public static major1nv = [Intervals.minorThird, Intervals.perfectFourth];
    public static major2nv = [Intervals.perfectFourth, Intervals.majorThird];
    public static minor1nv = [Intervals.majorThird, Intervals.perfectFourth];
    public static minor2nv = [Intervals.perfectFourth, Intervals.minorThird];

}
