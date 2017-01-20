/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CollaboratersService } from './collaboraters.service';

describe('CollaboratersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CollaboratersService]
    });
  });

  it('should ...', inject([CollaboratersService], (service: CollaboratersService) => {
    expect(service).toBeTruthy();
  }));
});
