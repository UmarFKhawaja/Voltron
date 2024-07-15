import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmEmailAddressChangeComponent } from './confirm-email-address-change.component';

describe('ConfirmEmailAddressChangeComponent', () => {
  let component: ConfirmEmailAddressChangeComponent;
  let fixture: ComponentFixture<ConfirmEmailAddressChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmEmailAddressChangeComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmEmailAddressChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
