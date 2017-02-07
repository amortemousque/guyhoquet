/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AgenciesService } from './agencies.service';

describe('ManagersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AgenciesService]
    });
  });

  it('should ...', inject([AgenciesService], (service: AgenciesService) => {
    expect(service).toBeTruthy();
  }));
});
