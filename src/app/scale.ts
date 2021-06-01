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

    // Simple function to get pitch notation for notes in a scale
    getPitches(scale_octave: number): string[] {
        var notes = [];
        this.notes.forEach(note => {
            if (this.chromatic.indexOf(note) >= this.c_index) {
                notes.push(note + (scale_octave + 1));
            } else {
                notes.push(note + scale_octave);
            }
        });
        return notes;
    }
}