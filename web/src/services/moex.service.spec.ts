/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MoexService } from './moex.service';

describe('Service: Moex', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MoexService]
    });
  });

  it('should ...', inject([MoexService], (service: MoexService) => {
    expect(service).toBeTruthy();
  }));
});
