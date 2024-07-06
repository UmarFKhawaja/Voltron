import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UnsetPasswordComponent } from './unset-password.component';

describe('UnsetPasswordComponent', () => {
  let component: UnsetPasswordComponent;
  let fixture: ComponentFixture<UnsetPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnsetPasswordComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(UnsetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
