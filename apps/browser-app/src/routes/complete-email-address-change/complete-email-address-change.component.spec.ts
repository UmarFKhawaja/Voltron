import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompleteEmailAddressChangeComponent } from './complete-email-address-change.component';

describe('CompleteEmailAddressChangeComponent', () => {
  let component: CompleteEmailAddressChangeComponent;
  let fixture: ComponentFixture<CompleteEmailAddressChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompleteEmailAddressChangeComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CompleteEmailAddressChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
