import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecoverAccountFormComponent } from './recover-account-form.component';

describe('RecoverAccountFormComponent', () => {
  let component: RecoverAccountFormComponent;
  let fixture: ComponentFixture<RecoverAccountFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecoverAccountFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(RecoverAccountFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
