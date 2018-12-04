import { TestBed } from '@angular/core/testing';

import { DcmaService } from './dcma.service';

describe('DcmaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DcmaService = TestBed.get(DcmaService);
    expect(service).toBeTruthy();
  });
});
