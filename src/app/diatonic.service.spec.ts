import { TestBed } from '@angular/core/testing';

import { DiatonicService } from './diatonic.service';

describe('DiatonicService', () => {
  let service: DiatonicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiatonicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
