import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageBgSmallComponent } from './page-bg-small.component';

describe('PageBgSmallComponent', () => {
  let component: PageBgSmallComponent;
  let fixture: ComponentFixture<PageBgSmallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageBgSmallComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageBgSmallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
