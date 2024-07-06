import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SetPasswordFormComponent } from './set-password-form.component';

describe('SetPasswordFormComponent', () => {
  let component: SetPasswordFormComponent;
  let fixture: ComponentFixture<SetPasswordFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetPasswordFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SetPasswordFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
