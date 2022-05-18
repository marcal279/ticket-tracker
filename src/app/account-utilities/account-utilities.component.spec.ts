import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountUtilitiesComponent } from './account-utilities.component';

describe('AccountUtilitiesComponent', () => {
  let component: AccountUtilitiesComponent;
  let fixture: ComponentFixture<AccountUtilitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountUtilitiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountUtilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
