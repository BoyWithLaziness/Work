import { TestBed } from '@angular/core/testing';

import { HttpHanderService } from './http-hander.service';

describe('HttpHanderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HttpHanderService = TestBed.get(HttpHanderService);
    expect(service).toBeTruthy();
  });
});
