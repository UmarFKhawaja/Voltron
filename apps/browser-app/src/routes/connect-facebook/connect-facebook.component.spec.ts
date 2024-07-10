import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConnectFacebookComponent } from './connect-facebook.component';

describe('ConnectFacebookComponent', () => {
  let component: ConnectFacebookComponent;
  let fixture: ComponentFixture<ConnectFacebookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectFacebookComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ConnectFacebookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
