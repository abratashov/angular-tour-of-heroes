import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { RouterTestingModule } from '@angular/router/testing';

import { HeroService } from '../hero.service';
import { HeroesComponent } from './heroes.component';
import { defer } from 'rxjs';

export function fakeAsyncResponse<T>(data: T) {
  return defer(() => Promise.resolve(data));
}

const newHeroName = 'new hero';

const serviceStub = {
  getHeroes() {
    return fakeAsyncResponse([
      { id: 1, name: 'A' },
      { id: 2, name: 'B' }
    ]);
  },

  addHero(hero: any) {
    return fakeAsyncResponse(
      { id: 3, name: newHeroName }
    );
  },

  deleteHero(hero: any) {
    return fakeAsyncResponse(
      { id: 4, name: '' }
    );
  }
};

fdescribe('HeroesComponent', () => {
  let component: HeroesComponent;
  let fixture: ComponentFixture<HeroesComponent>;
  let ui: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeroesComponent ],
      imports: [ RouterModule, RouterTestingModule, HttpClientModule ],
      providers: [ { provide: HeroService, useValue: serviceStub } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroesComponent);
    component = fixture.componentInstance;
    ui = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render heroes list', async(async() => {
    await fixture.whenStable();
    fixture.detectChanges();

    expect(ui.querySelectorAll('.badge').length).toEqual(2);
  }));

  it('add new item', async(async() => {
    let input = ui.querySelector('.new-hero-name')
    input.value = newHeroName;
    ui.querySelector('button.add-btn').click()

    await fixture.whenStable();
    fixture.detectChanges();

    expect(ui.querySelectorAll('.badge').length).toEqual(3);
    expect(ui.querySelectorAll('ul.heroes > li:last-child')[0].textContent).toContain(newHeroName);
  }));

  it('remove item', async(async() => {
    await fixture.whenStable();
    fixture.detectChanges();
    ui.querySelectorAll('ul.heroes > li > .delete')[0].click();

    fixture.detectChanges();
    expect(ui.querySelectorAll('.badge').length).toEqual(1);
  }));
});
