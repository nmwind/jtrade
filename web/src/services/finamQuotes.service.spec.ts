/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FinamQuotesService } from './finamQuotes.service';

describe('Service: FinamQuotes', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FinamQuotesService]
    });
  });

  it('should ...', inject([FinamQuotesService], (service: FinamQuotesService) => {
    expect(service).toBeTruthy();
  }));
});
