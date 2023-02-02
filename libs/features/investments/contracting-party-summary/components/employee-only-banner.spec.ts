import { EmployeeOnlyBannerComponent } from './employee-only-banner';
import { SensesTranslateService } from '@senses/shared-translate';
import { translations } from './employee-only-banner.translate';

describe('Employee only banner component', () => {
  let component: EmployeeOnlyBannerComponent;

  const translateMockService: SensesTranslateService = {
    setTranslations: jest.fn(),
  } as unknown as SensesTranslateService;

  beforeEach(() => {
    component = new EmployeeOnlyBannerComponent(translateMockService);
  });

  it('should initiate', () => {
    expect(component).toBeDefined();
    expect(translateMockService.setTranslations).toHaveBeenCalledWith(
      translations
    );
  });
});
