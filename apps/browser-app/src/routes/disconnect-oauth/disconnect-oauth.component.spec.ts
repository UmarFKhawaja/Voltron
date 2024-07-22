import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DisconnectOAuthComponent } from './disconnect-oauth.component';

describe('DisconnectOAuthComponent', () => {
  let component: DisconnectOAuthComponent;
  let fixture: ComponentFixture<DisconnectOAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisconnectOAuthComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DisconnectOAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
