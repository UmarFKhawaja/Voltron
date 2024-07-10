import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DisconnectGoogleComponent } from './disconnect-google.component';

describe('DisconnectGoogleComponent', () => {
  let component: DisconnectGoogleComponent;
  let fixture: ComponentFixture<DisconnectGoogleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisconnectGoogleComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DisconnectGoogleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
