import 'zone.js';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { CostCalculatorCustomElementModule } from './cost-calculator-custom-element.module';

enableProdMode();
platformBrowserDynamic()
  .bootstrapModule(CostCalculatorCustomElementModule)
  .catch(err => console.error(err));
