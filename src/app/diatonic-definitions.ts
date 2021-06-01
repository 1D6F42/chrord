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
    public static text = ["I", "II", "III", "IV", "V", "VI", "VII"];
}

export class ChordShapes {
    public static major = [Intervals.majorThird, Intervals.minorThird];
    public static minor = [Intervals.minorThird, Intervals.majorThird];
    public static diminished = [Intervals.minorThird, Intervals.minorThird];
    public static augmented = [Intervals.majorThird, Intervals.majorThird];
    public static sus2 = [Intervals.majorSecond, Intervals.perfectFourth];
    public static sus4 = [Intervals.perfectFourth, Intervals.majorSecond];
    public static maj7 =  [Intervals.majorThird, Intervals.minorThird, Intervals.majorThird];
    public static dom7 =  [Intervals.majorThird, Intervals.minorThird, Intervals.majorThird];
    public static dim7 =  [Intervals.minorThird, Intervals.majorSecond, Intervals.minorThird];
}
