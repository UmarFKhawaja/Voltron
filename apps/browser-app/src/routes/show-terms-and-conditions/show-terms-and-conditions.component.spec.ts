import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowTermsAndConditionsComponent } from './show-terms-and-conditions.component';

describe('ShowTermsAndConditionsComponent', () => {
  let component: ShowTermsAndConditionsComponent;
  let fixture: ComponentFixture<ShowTermsAndConditionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowTermsAndConditionsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ShowTermsAndConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
