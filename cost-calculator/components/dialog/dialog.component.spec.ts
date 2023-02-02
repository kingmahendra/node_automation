import { CostCalculatorFeatureDialogComponent } from './dialog.component';
import {
  SensesTranslateMockService,
  SensesTranslateService,
} from '@senses/shared-translate';

describe('CostCalculatorDialogComponent', () => {
  let component: CostCalculatorFeatureDialogComponent;
  const translateMockService: SensesTranslateService =
    SensesTranslateMockService as any;

  beforeEach(() => {
    component = new CostCalculatorFeatureDialogComponent(translateMockService);
  });

  it('should instantiate', () => {
    expect(component).toBeInstanceOf(CostCalculatorFeatureDialogComponent);
  });
});
