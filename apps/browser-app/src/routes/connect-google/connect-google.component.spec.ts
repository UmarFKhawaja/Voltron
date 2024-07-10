import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConnectGoogleComponent } from './connect-google.component';

describe('ConnectGoogleComponent', () => {
  let component: ConnectGoogleComponent;
  let fixture: ComponentFixture<ConnectGoogleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectGoogleComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ConnectGoogleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
