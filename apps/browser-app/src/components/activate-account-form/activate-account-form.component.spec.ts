import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivateAccountFormComponent } from './activate-account-form.component';

describe('ActivateAccountFormComponent', () => {
  let component: ActivateAccountFormComponent;
  let fixture: ComponentFixture<ActivateAccountFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivateAccountFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ActivateAccountFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
