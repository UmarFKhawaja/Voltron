import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeEmailAddressFormComponent } from './change-email-address-form.component';

describe('ChangeEmailAddressFormComponent', () => {
  let component: ChangeEmailAddressFormComponent;
  let fixture: ComponentFixture<ChangeEmailAddressFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeEmailAddressFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ChangeEmailAddressFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
