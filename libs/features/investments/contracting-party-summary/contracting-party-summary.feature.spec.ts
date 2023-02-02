import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';
import { ApolloQueryResult, NetworkStatus } from '@apollo/client/core';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
  SpyObject,
} from '@ngneat/spectator/jest';
import { TranslatePipe } from '@ngx-translate/core';
import {
  AgreementAccountsService,
  AgreementCustomerType,
  AgreementPart,
  AgreementVersion,
  AgreementVersionField,
  AgreementVersionResetGQL,
  AgreementVersionsGQL,
  AgreementVersionsQueryResult,
  AgreementVersionStatus,
  ContractingPartyType,
  DisplayMode,
  ErrorHandlerService,
  EventType,
  InvestmentProductType,
  Journey,
  JourneyChannel,
  JourneyToneOfVoice,
  JourneyType,
  LatestAgreementVersionGQL,
  LatestAgreementVersionQueryResult,
  Modification,
  NavigationType,
  ValidationErrorSeverity,
  ValidationResult,
  ValidationSubject,
} from '@senses/investments-shared-lib';
import { SensesTranslateService } from '@senses/shared-translate';
import { MockPipe } from 'ng-mocks';
import { noop, of, throwError } from 'rxjs';

import {
  ContractingParties,
  ContractingPartySummaryFeature,
} from './contracting-party-summary.feature';
import {
  pbTranslations,
  translations,
} from './contracting-party-summary.translate';

describe('ContractingPartySummaryFeature', () => {
  let spectator: Spectator<ContractingPartySummaryFeature>;

  const contractantWithValidationErrors: ContractingParties = [
    {
      contactDetails: {
        displayName: 'A.F.M. van de Plas',
        dateOfBirth: '1983-12-01',
      },
      customerType: AgreementCustomerType.NaturalPerson,
      modification: null,
      primaryFlag: true,
      relationId: '000000111395100',
      type: ContractingPartyType.MainContractor,
      validationErrors: [
        {
          subject: ValidationSubject.ContractingPartyCustomerType,
          severity: ValidationErrorSeverity.Error,
          code: '',
        },
        {
          subject: ValidationSubject.ContractingPartyLegalRestraints,
          severity: ValidationErrorSeverity.Info,
          code: '',
        },
      ],
    },
    {
      contactDetails: {
        displayName: 'THREE',
        dateOfBirth: '1985-12-01',
      },
      customerType: AgreementCustomerType.NaturalPerson,
      modification: null,
      primaryFlag: false,
      relationId: '000000111395101',
      type: ContractingPartyType.MainContractor,
      validationErrors: [
        {
          subject: ValidationSubject.ContractingPartyKi,
          severity: ValidationErrorSeverity.Warning,
          code: '',
        },
        {
          subject: ValidationSubject.ContractingPartyUsPerson,
          severity: ValidationErrorSeverity.Error,
          code: '',
        },
      ],
    },
  ] as unknown as ContractingParties;
  const latestAgreementVersionResponse: ApolloQueryResult<LatestAgreementVersionQueryResult> =
    {
      data: {
        latestAgreementVersion: {
          id: '123',
          investmentArrangementNumber: '12345678',
          contractingParties: contractantWithValidationErrors,
        } as unknown as AgreementVersion,
      },
      loading: false,
      networkStatus: NetworkStatus.ready,
    };

  const activeAgreementVersion: AgreementVersion = {
    id: '123',
    status: 'ACTIVE',
    investmentArrangementNumber: '12345678',
    contractingParties: contractantWithValidationErrors,
  } as unknown as AgreementVersion;

  const activeAgreementVersionResponse: ApolloQueryResult<AgreementVersionsQueryResult> =
    {
      data: {
        agreementVersions: [
          activeAgreementVersion,
        ] as unknown as AgreementVersion[],
      },
      loading: false,
      networkStatus: NetworkStatus.ready,
    };

  const currentAscriptionValue = {
    siebelAscriptionId: '000000238238',
    raboRelationName: 'A.F.M. van de Plas',
    addressLine: 'Ververstraat 12A,1021 AK Amsterdam',
    type: 'AND_OR',
  };

  const currentContractingPartiesValue = [
    {
      relationId: '000000111395100',
      type: 'MAIN_CONTRACTOR',
      modification: null,
      contactDetails: {
        customerType: 'PERSON',
        displayName: 'A.F.M. van de Plas',
        dateOfBirth: '1983-12-01',
      },
      validationErrors: [
        {
          subject: 'CONTRACTING_PARTY_CUSTOMER_TYPE',
          severity: 'ERROR',
          code: ' ',
        },
        {
          subject: 'CONTRACTING_PARTY_MIFID',
          severity: 'INFO',
          code: ' ',
        },
      ],
    },
    {
      relationId: '000000111395101',
      type: 'MAIN_CONTRACTOR',
      modification: 'REMOVED',
      contactDetails: {
        customerType: 'PERSON',
        displayName: 'TWO',
        dateOfBirth: '1985-12-01',
      },
      validationErrors: [
        {
          subject: 'CONTRACTING_PARTY_KI',
          severity: 'WARNING',
          code: ' ',
        },
        {
          subject: 'CONTRACTING_PARTY_US_PERSON',
          severity: 'INFO',
          code: ' ',
        },
      ],
    },
    {
      relationId: '000000111395102',
      type: 'MAIN_CONTRACTOR',
      modification: null,
      contactDetails: {
        customerType: 'PERSON',
        displayName: 'THREE',
        dateOfBirth: '1985-12-01',
      },
      validationErrors: [
        {
          subject: 'CONTRACTING_PARTY_KI',
          severity: 'WARNING',
          code: ' ',
        },
        {
          subject: 'CONTRACTING_PARTY_US_PERSON',
          severity: 'INFO',
          code: ' ',
        },
      ],
    },
  ];

  const resetAgreementResponse = {
    data: {
      resetAgreement: {
        investmentArrangementNumber: '80001001',
        status: AgreementVersionStatus.Active,
        changedFields: [],
        hasOptions: false,
        ascription: {
          siebelAscriptionId: '000000238238',
          raboRelationName: 'A.F.M. van de Plas - Reset',
          addressLine: 'Ververstraat 12A,1021 AK Amsterdam',
          type: 'AND_OR',
        },
        contractingParties: [
          {
            relationId: '000000111395100',
            type: 'MAIN_CONTRACTOR',
            modification: null,
            contactDetails: {
              customerType: 'PERSON',
              displayName: 'A.F.M. van de Plas',
              dateOfBirth: '1983-12-01',
            },
            validationErrors: [
              {
                subject: 'CONTRACTING_PARTY_CUSTOMER_TYPE',
                severity: 'ERROR',
                code: ' ',
              },
              {
                subject: 'CONTRACTING_PARTY_MIFID',
                severity: 'INFO',
                code: ' ',
              },
            ],
          },
          {
            relationId: '000000111395101',
            type: 'MAIN_CONTRACTOR',
            modification: null,
            contactDetails: {
              customerType: 'PERSON',
              displayName: 'TWO',
              dateOfBirth: '1985-12-01',
            },
            validationErrors: [
              {
                subject: 'CONTRACTING_PARTY_KI',
                severity: 'WARNING',
                code: ' ',
              },
              {
                subject: 'CONTRACTING_PARTY_US_PERSON',
                severity: 'INFO',
                code: ' ',
              },
            ],
          },
          {
            relationId: '000000111395102',
            type: 'MAIN_CONTRACTOR',
            modification: 'REMOVED',
            contactDetails: {
              customerType: 'PERSON',
              displayName: 'THREE',
              dateOfBirth: '1985-12-01',
            },
            validationErrors: [
              {
                subject: 'CONTRACTING_PARTY_KI',
                severity: 'WARNING',
                code: ' ',
              },
              {
                subject: 'CONTRACTING_PARTY_US_PERSON',
                severity: 'INFO',
                code: ' ',
              },
            ],
          },
        ],
        validationResult: ValidationResult.Valid,
        validationErrors: [],
      },
    },
  };

  const createComponent = createComponentFactory({
    component: ContractingPartySummaryFeature,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    declarations: [MockPipe(TranslatePipe, val => val)],
    componentMocks: [SensesTranslateService],
    providers: [
      mockProvider(LatestAgreementVersionGQL, {
        fetch: () => of({}),
      }),
      mockProvider(AgreementVersionsGQL, {
        fetch: () => of({}),
      }),
      mockProvider(AgreementVersionResetGQL, {
        mutate: () => of({}),
      }),
      mockProvider(SensesTranslateService, {
        instant: noop,
      }),
      mockProvider(ErrorHandlerService, {
        handleHttpError: () => 'some error text',
        handleGraphQLErrorIfPresent: noop,
      }),
      mockProvider(AgreementAccountsService, {
        refreshAccountSummary: noop,
      }),
    ],
    detectChanges: false,
  });

  const mockJourney: Journey = {
    channel: JourneyChannel.Employee,
    flow: JourneyType.Modify,
    agreement: {
      investmentArrangementNumber: '80001001',
      productType: InvestmentProductType.IndividualWealthManagement,
      commercialName: 'Individueel Vermogensbeheer',
    },
    toneOfVoice: JourneyToneOfVoice.Single,
    viewMode: DisplayMode.Edit,
    showActive: false,
  };

  beforeEach(() => {
    spectator = createComponent();
    spectator.component.querySubscription = {
      unsubscribe: noop,
    } as any;
  });

  it('should instantiate', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should set translations', () => {
    // spectator = createComponent();
    const translateServiceMock = spectator.inject(SensesTranslateService, true);

    spectator.component.journey = mockJourney;

    // trigger ngOnInit()
    spectator.detectChanges();

    expect(translateServiceMock.setTranslations).toHaveBeenCalledTimes(1);
    expect(translateServiceMock.setTranslations).toHaveBeenCalledWith(
      translations
    );
  });

  it('should set private banking translations', () => {
    spectator.component.isPrivateBanking = true;
    const translateServiceMock = spectator.inject(SensesTranslateService, true);

    spectator.component.ngOnInit();

    expect(translateServiceMock.setTranslations).toHaveBeenCalledWith(
      pbTranslations
    );
  });

  it('ngOnChanges active', () => {
    const active = spectator.inject(AgreementVersionsGQL);
    jest
      .spyOn(active, 'fetch')
      .mockReturnValue(of(activeAgreementVersion) as any);

    const errorHandlingService =
      spectator.inject<ErrorHandlerService>(ErrorHandlerService);
    jest
      .spyOn(errorHandlingService, 'handleGraphQLErrorIfPresent')
      .mockReturnValue(activeAgreementVersionResponse);
    const activeMockJourney = {
      ...mockJourney,
      showActive: true,
    };
    const mockChange = {
      journey: new SimpleChange(null, activeMockJourney, true),
    };
    spectator.component.ngOnChanges(mockChange);
    expect(spectator.component.journey).toEqual(activeMockJourney);
    expect(spectator.component.showEmployeeOnlyBanner).toBeFalsy();
    expect(active.fetch).toHaveBeenCalledWith({
      investmentArrangementNumber:
        activeMockJourney.agreement.investmentArrangementNumber,
      status: AgreementVersionStatus.Active,
    });
    expect(spectator.component.agreementVersion).toExist();
    expect(spectator.component.contractants).toExist();
  });

  it('ngOnChanges latest', () => {
    const latest = spectator.inject(LatestAgreementVersionGQL);
    jest
      .spyOn(latest, 'fetch')
      .mockReturnValue(of(latestAgreementVersionResponse) as any);

    const errorHandlingService =
      spectator.inject<ErrorHandlerService>(ErrorHandlerService);
    jest
      .spyOn(errorHandlingService, 'handleGraphQLErrorIfPresent')
      .mockReturnValue(latestAgreementVersionResponse);
    const mockChange = {
      journey: new SimpleChange(null, mockJourney, true),
    };
    spectator.component.ngOnChanges(mockChange);
    expect(spectator.component.journey).toEqual(mockJourney);
    expect(spectator.component.showEmployeeOnlyBanner).toBeFalsy();
    expect(latest.fetch).toHaveBeenCalledWith({
      investmentArrangementNumber:
        mockJourney.agreement.investmentArrangementNumber,
    });
    expect(spectator.component.agreementVersion).toExist();
    expect(spectator.component.contractants).toExist();
  });

  it('ngOnChanges - error', () => {
    const latest = spectator.inject(LatestAgreementVersionGQL);
    jest
      .spyOn(latest, 'fetch')
      .mockReturnValue(throwError(new Error('Async error')));

    const mockChange = {
      journey: new SimpleChange(null, mockJourney, true),
    };
    spectator.component.ngOnChanges(mockChange);
    expect(spectator.component.journey).toEqual(mockJourney);
    expect(latest.fetch).toHaveBeenCalledWith({
      investmentArrangementNumber:
        mockJourney.agreement.investmentArrangementNumber,
    });
    expect(spectator.component.agreementVersion).not.toExist();
    expect(spectator.component.contractants).not.toExist();
    expect(spectator.component.error).toBe('some error text');
  });

  it('should set the validation errors', () => {
    const getTranslatedMessageSpy = jest.spyOn(
      spectator.component,
      'getTranslatedMessage'
    );
    spectator.component.contractants = contractantWithValidationErrors;
    spectator.component.setValidationErrors();
    expect(spectator.component.validationErrors?.length).toEqual(4);
    expect(getTranslatedMessageSpy).toHaveBeenCalledTimes(4);
    expect(getTranslatedMessageSpy).toHaveBeenCalledWith(
      'A.F.M. van de Plas',
      'CONTRACTING_PARTY_CUSTOMER_TYPE'
    );
    expect(getTranslatedMessageSpy).toHaveBeenCalledWith(
      'A.F.M. van de Plas',
      'CONTRACTING_PARTY_LEGAL_RESTRAINTS'
    );
    expect(getTranslatedMessageSpy).toHaveBeenCalledWith(
      'THREE',
      'CONTRACTING_PARTY_KI'
    );
    expect(getTranslatedMessageSpy).toHaveBeenCalledWith(
      'THREE',
      'CONTRACTING_PARTY_US_PERSON'
    );
  });

  it('getTranslatedMessage', () => {
    const translateServiceMock: SpyObject<SensesTranslateService> =
      spectator.inject(SensesTranslateService, true);
    spectator.component.getTranslatedMessage('displayName', 'subject');
    expect(translateServiceMock.instant).toHaveBeenCalledWith('subject', {
      displayName: 'displayName',
    });
  });

  it('getTranslatedLabel', () => {
    const translateServiceMock: SpyObject<SensesTranslateService> =
      spectator.inject(SensesTranslateService, true);
    spectator.component.getTranslatedLabel('label');
    expect(translateServiceMock.instant).toHaveBeenCalledWith('label');
  });

  it('ngOnDestroy', () => {
    spectator.component.querySubscription = {
      unsubscribe: jest.fn(),
    } as any;
    spectator.component.resetSubscription = {
      unsubscribe: jest.fn(),
    } as any;
    spectator.component.ngOnDestroy();
    expect(
      spectator.component.querySubscription?.unsubscribe
    ).toHaveBeenCalled();
    expect(
      spectator.component.resetSubscription?.unsubscribe
    ).toHaveBeenCalled();
  });

  it('containsAnyDraft', () => {
    spectator.component.agreementVersion = {
      status: AgreementVersionStatus.Draft,
      changedFields: [AgreementVersionField.ContractingParties],
    } as any;
    expect(spectator.component.containsAnyDraft()).toBeTruthy();

    spectator.component.agreementVersion = {
      status: AgreementVersionStatus.Pending,
      changedFields: [AgreementVersionField.ContractingParties],
    } as any;
    expect(spectator.component.containsAnyDraft()).toBeFalsy();

    spectator.component.agreementVersion = {
      status: AgreementVersionStatus.Draft,
      changedFields: [AgreementVersionField.Ascription],
    } as any;
    expect(spectator.component.containsAnyDraft()).toBeTruthy();
  });

  it('showActualizeMessage', () => {
    spectator.component.agreementVersion = {
      status: AgreementVersionStatus.Draft,
      changedFields: [AgreementVersionField.ContractingParties],
    } as any;
    spectator.component.journey = mockJourney;
    expect(spectator.component.showActualizeMessage()).toBeTruthy();

    spectator.component.agreementVersion = {
      status: AgreementVersionStatus.Pending,
      changedFields: [AgreementVersionField.ContractingParties],
    } as any;
    expect(spectator.component.showActualizeMessage()).toBeFalsy();

    spectator.component.agreementVersion = {
      status: AgreementVersionStatus.Draft,
      changedFields: [AgreementVersionField.Ascription],
    } as any;
    expect(spectator.component.showActualizeMessage()).toBeFalsy();

    spectator.component.agreementVersion = {
      status: AgreementVersionStatus.Draft,
      changedFields: [AgreementVersionField.ContractingParties],
    } as any;
    spectator.component.journey.agreement.productType =
      InvestmentProductType.SelfManaged;
    expect(spectator.component.showActualizeMessage()).toBeFalsy();
  });

  it('onContractingPartyEdit', () => {
    spectator.component.contractingPartySummaryEvent = {
      emit: jest.fn(),
    } as any;
    spectator.component.onContractingPartyEdit();
    expect(
      spectator.component.contractingPartySummaryEvent.emit
    ).toHaveBeenCalledWith({
      type: EventType.NAVIGATE,
      navigation: NavigationType.FORWARD,
    });
  });

  it('openModal', () => {
    spectator.component.resetDialog = {
      nativeElement: {
        present: jest.fn(),
      },
    };
    spectator.component.openModal();
    expect(
      spectator.component.resetDialog.nativeElement.present
    ).toHaveBeenCalled();
  });

  it('openValidationModal', () => {
    spectator.component.validationDialog = {
      nativeElement: {
        present: jest.fn(),
      },
    };
    spectator.component.openValidationModal();
    expect(
      spectator.component.validationDialog.nativeElement.present
    ).toHaveBeenCalled();
  });

  it('handleResetDialog', () => {
    spectator.component.journey = mockJourney;
    jest
      .spyOn(spectator.component, 'resetContractingPartyAndAscription')
      .mockImplementation(jest.fn());
    const mockEvent = {
      detail: {
        confirmed: true,
      },
    };
    spectator.component.handleResetDialog(mockEvent as unknown as CustomEvent);
    expect(
      spectator.component.resetContractingPartyAndAscription
    ).toHaveBeenCalled();

    jest.clearAllMocks();

    mockEvent.detail.confirmed = false;
    spectator.component.handleResetDialog(mockEvent as unknown as CustomEvent);
    expect(
      spectator.component.resetContractingPartyAndAscription
    ).not.toHaveBeenCalled();
  });

  it('resetContractingPartyAndAscription', () => {
    spectator.component.journey = mockJourney;
    spectator.component.agreementVersion = {
      status: AgreementVersionStatus.Draft,
      changedFields: [
        AgreementVersionField.Ascription,
        AgreementVersionField.ContractingParties,
      ],
      ascription: currentAscriptionValue,
      contractingParties: currentContractingPartiesValue,
      validationResult: ValidationResult.Valid,
      validationErrors: [],
    } as any;

    const agreementVersion = expectToBeDefined(
      spectator.component.agreementVersion
    );

    expect(agreementVersion.ascription.raboRelationName).toEqual(
      'A.F.M. van de Plas'
    );
    expect(
      agreementVersion.contractingParties[1].contactDetails?.displayName
    ).toEqual('TWO');
    expect(
      spectator.component.agreementVersion?.contractingParties[1].modification
    ).toEqual(Modification.Removed);

    const reset = spectator.inject(AgreementVersionResetGQL);
    jest
      .spyOn(reset, 'mutate')
      .mockReturnValue(of(resetAgreementResponse) as any);

    spectator.component.contractingPartySummaryEvent = {
      emit: jest.fn(),
    } as any;

    spectator.component.resetContractingPartyAndAscription();

    expect(
      spectator.component.contractingPartySummaryEvent.emit
    ).toHaveBeenCalledTimes(2);
    expect(reset.mutate).toHaveBeenCalledWith({
      investmentArrangementNumber: '80001001',
      input: [AgreementPart.AscriptionAndContractingParties],
    });
    expect(
      spectator.component.contractingPartySummaryEvent.emit
    ).toHaveBeenCalledWith({ type: EventType.RESET_START });
    expect(
      spectator.component.contractingPartySummaryEvent.emit
    ).toHaveBeenCalledWith({ type: EventType.RESET_COMPLETED });

    const updatedAgreementVersion = expectToBeDefined(
      spectator.component.agreementVersion
    );
    expect(updatedAgreementVersion.changedFields.length).toEqual(0);
    expect(updatedAgreementVersion.ascription.raboRelationName).toEqual(
      'A.F.M. van de Plas - Reset'
    );

    const contractants = expectToBeDefined(spectator.component.contractants);
    expect(contractants.length).toBe(2);

    const secondContractant = contractants[1];
    expect(secondContractant.contactDetails?.displayName).toEqual('TWO');
    expect(secondContractant.modification).toBeNull();
  });

  it('noValidationErrors()', () => {
    spectator.component.validationErrors = [
      {
        message: ' ',
        severity: ValidationErrorSeverity.Error,
      },
      {
        message: ' ',
        severity: ValidationErrorSeverity.Error,
      },
    ];
    expect(spectator.component.noValidationErrors()).toBeFalsy();

    spectator.component.validationErrors = [];
    expect(spectator.component.noValidationErrors()).toBeTruthy();
  });

  it('resetContractingPartyAndAscription - error', () => {
    spectator.component.journey = mockJourney;
    spectator.component.agreementVersion = {
      status: AgreementVersionStatus.Draft,
      changedFields: [
        AgreementVersionField.Ascription,
        AgreementVersionField.ContractingParties,
      ],
      ascription: currentAscriptionValue,
      contractingParties: currentContractingPartiesValue,
      validationResult: ValidationResult.Valid,
      validationErrors: [],
    } as any;

    const agreementVersion = expectToBeDefined(
      spectator.component.agreementVersion
    );

    expect(agreementVersion.ascription.raboRelationName).toEqual(
      'A.F.M. van de Plas'
    );
    const contractingParties = expectToBeDefined(
      agreementVersion.contractingParties
    );
    const secondContractant = expectToBeDefined(contractingParties[1]);

    expect(secondContractant.contactDetails?.displayName).toEqual('TWO');
    expect(secondContractant.modification).toEqual(Modification.Removed);

    const reset = spectator.inject(AgreementVersionResetGQL);
    jest.spyOn(reset, 'mutate').mockReturnValue(throwError('Async error'));
    spectator.component.contractingPartySummaryEvent = {
      emit: jest.fn(),
    } as any;
    spectator.component.resetContractingPartyAndAscription();
    expect(
      spectator.component.contractingPartySummaryEvent.emit
    ).toHaveBeenCalledTimes(2);
    expect(reset.mutate).toHaveBeenCalledWith({
      investmentArrangementNumber: '80001001',
      input: [AgreementPart.AscriptionAndContractingParties],
    });
    expect(
      spectator.component.contractingPartySummaryEvent.emit
    ).toHaveBeenCalledWith({ type: EventType.RESET_START });
    expect(
      spectator.component.contractingPartySummaryEvent.emit
    ).toHaveBeenCalledWith({ type: EventType.RESET_ERROR });

    const updatedAgreementVersion = expectToBeDefined(
      spectator.component.agreementVersion
    );
    expect(updatedAgreementVersion.changedFields.length).toEqual(2);
    expect(updatedAgreementVersion.ascription.raboRelationName).toEqual(
      'A.F.M. van de Plas'
    );

    const updatedSecondContractant = expectToBeDefined(
      updatedAgreementVersion.contractingParties[1]
    );
    expect(updatedSecondContractant.contactDetails?.displayName).toEqual('TWO');
    expect(updatedSecondContractant.modification).toEqual(Modification.Removed);
  });
});

function expectToBeDefined<T>(object: T | null | undefined): T {
  expect(object).toBeDefined();
  if (typeof object === 'undefined' || object === null) {
    throw new Error(`Invariant failed`);
  }
  return object;
}
