import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderCardUsersInfoComponent } from './header-card-users-info.component';

describe('HeaderCardUsersInfoComponent', () => {
  let component: HeaderCardUsersInfoComponent;
  let fixture: ComponentFixture<HeaderCardUsersInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderCardUsersInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderCardUsersInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
