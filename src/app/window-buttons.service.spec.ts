import { TestBed } from '@angular/core/testing';

import { WindowButtonsService } from './window-buttons.service';

describe('WindowButtonsService', () => {
  let service: WindowButtonsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WindowButtonsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
