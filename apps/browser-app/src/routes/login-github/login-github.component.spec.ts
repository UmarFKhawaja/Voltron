import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginGitHubComponent } from './login-github.component';

describe('LoginGitHubComponent', () => {
  let component: LoginGitHubComponent;
  let fixture: ComponentFixture<LoginGitHubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginGitHubComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginGitHubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
