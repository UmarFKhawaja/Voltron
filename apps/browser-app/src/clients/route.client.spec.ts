import { TestBed } from '@angular/core/testing';
import { RouteClient } from './route.client';

describe('RouteClient', () => {
  let client: RouteClient;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    client = TestBed.inject(RouteClient);
  });

  it('should be created', () => {
    expect(client).toBeTruthy();
  });
});
