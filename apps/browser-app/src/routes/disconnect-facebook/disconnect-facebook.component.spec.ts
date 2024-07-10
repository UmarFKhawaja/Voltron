import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DisconnectFacebookComponent } from './disconnect-facebook.component';

describe('DisconnectFacebookComponent', () => {
  let component: DisconnectFacebookComponent;
  let fixture: ComponentFixture<DisconnectFacebookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisconnectFacebookComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DisconnectFacebookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
