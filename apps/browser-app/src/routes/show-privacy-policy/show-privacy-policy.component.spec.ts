import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowPrivacyPolicyComponent } from './show-privacy-policy.component';

describe('ShowPrivacyPolicyComponent', () => {
  let component: ShowPrivacyPolicyComponent;
  let fixture: ComponentFixture<ShowPrivacyPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowPrivacyPolicyComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ShowPrivacyPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
