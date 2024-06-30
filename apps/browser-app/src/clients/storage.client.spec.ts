import { TestBed } from '@angular/core/testing';
import { StorageClient } from './storage.client';

describe('StorageClient', () => {
  let client: StorageClient;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    client = TestBed.inject(StorageClient);
  });

  it('should be created', () => {
    expect(client).toBeTruthy();
  });
});
