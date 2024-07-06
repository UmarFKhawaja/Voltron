import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UnsetPasswordFormComponent } from './unset-password-form.component';

describe('UnsetPasswordFormComponent', () => {
  let component: UnsetPasswordFormComponent;
  let fixture: ComponentFixture<UnsetPasswordFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnsetPasswordFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(UnsetPasswordFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
