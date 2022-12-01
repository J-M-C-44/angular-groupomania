import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEmailFormComponent } from './user-email-form.component';

describe('UserEmailFormComponent', () => {
  let component: UserEmailFormComponent;
  let fixture: ComponentFixture<UserEmailFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserEmailFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserEmailFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
