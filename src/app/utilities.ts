export abstract class Util {
  public static sortArrayOfNotes(array: string[]): any[] {
    array.sort();
    array.forEach((element, index) => {
      if (element.length > 1) {
        switch (element[1]) {
          case "#": // sharps go after
            if (array[index + 1] == element[0]) {
              this.swapArrayElements(array, index, index + 1);
            }
            break;
          case "b": // flats go before
            if (array[index - 1] == element[0]) {
              this.swapArrayElements(array, index, index - 1);
            }
            break;
        }
      }
    });
    return array;
  }

  public static swapArrayElements(array: any[], a: number, b: number) {
    const temp = array[a];
    array[a] = array[b];
    array[b] = temp;
  }

  public static rotateArray(array: any[], count: number): any[] {
    while (count--) {
      var tmp = array.shift();
      array.push(tmp);
    }
    return array;
  }

  public static wrapIndex(i: number, atValue?: number): number {
    // This function defaults to 7 because we pretty much always want to wrap at 7
    if (atValue === undefined) {
      atValue = 7;
    }

    // this is magic that makes scale degrees above 'atValue' map to the correct value.

    return (i % atValue + atValue) % atValue;
  }
}