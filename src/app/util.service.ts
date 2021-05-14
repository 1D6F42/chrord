import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  sortArrayOfNotes(array: string[]): any[] {
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

  swapArrayElements(array: any[], a: number, b: number) {
    const temp = array[a];
    array[a] = array[b];
    array[b] = temp;
  }

  findIndexOf(arr: any[], obj: any): number {
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

}
