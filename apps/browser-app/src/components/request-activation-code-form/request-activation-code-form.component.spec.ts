import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequestActivationCodeFormComponent } from './request-activation-code-form.component';

describe('RequestActivationCodeFormComponent', () => {
  let component: RequestActivationCodeFormComponent;
  let fixture: ComponentFixture<RequestActivationCodeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestActivationCodeFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(RequestActivationCodeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
