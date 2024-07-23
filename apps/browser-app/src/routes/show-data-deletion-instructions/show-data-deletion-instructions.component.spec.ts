import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowDataDeletionInstructionsComponent } from './show-data-deletion-instructions.component';

describe('ShowDataDeletionInstructionsComponent', () => {
  let component: ShowDataDeletionInstructionsComponent;
  let fixture: ComponentFixture<ShowDataDeletionInstructionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowDataDeletionInstructionsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ShowDataDeletionInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
