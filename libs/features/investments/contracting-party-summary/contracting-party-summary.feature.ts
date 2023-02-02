import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  AgreementAccountsService,
  AgreementCustomerType,
  AgreementPart,
  AgreementVersionField,
  AgreementVersionResetGQL,
  AgreementVersionsGQL,
  AgreementVersionStatus,
  SummaryCardHeaderConfig,
  DisplayMode,
  ErrorHandlerService,
  EventType,
  FeatureOutputEvent,
  InvestmentProductType,
  Journey,
  LatestAgreementVersionGQL,
  LatestAgreementVersionQueryResult,
  Modification,
  NavigationType,
  showEmployeeOnlyBanner,
  ValidationErrorSeverity,
  SummaryCardHeaderTitle,
  isPrivateBankingProduct,
} from '@senses/investments-shared-lib';
import { SensesTranslateService } from '@senses/shared-translate';
import { isNil } from 'lodash-es';
import { Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import {
  pbTranslations,
  translations,
} from './contracting-party-summary.translate';

export type LatestAgreementVersion =
  LatestAgreementVersionQueryResult['latestAgreementVersion'];
export type ContractingParties =
  NonNullable<LatestAgreementVersion>['contractingParties'];
type ValidationError = {
  message: string;
  severity: ValidationErrorSeverity;
};
@Component({
  selector: 'feature-contracting-party-summary',
  templateUrl: './contracting-party-summary.feature.html',
  styleUrls: ['./contracting-party-summary.feature.css'],
})
export class ContractingPartySummaryFeature
  implements OnInit, OnChanges, OnDestroy
{
  @Input()
  journey: Journey;

  @Output()
  contractingPartySummaryEvent: EventEmitter<FeatureOutputEvent> = new EventEmitter<FeatureOutputEvent>();
  @ViewChild('contractingPartyResetDialog', { static: true })
  resetDialog?: ElementRef;
  @ViewChild('contractingPartyValidationDialog', { static: true })
  validationDialog?: ElementRef;

  loading: boolean = true;
  error?: string;
  isPrivateBanking: boolean = false;
  showEmployeeOnlyBanner: boolean = false;
  showActive: boolean = false;

  querySubscription?: Subscription;
  resetSubscription?: Subscription;
  agreementVersion: LatestAgreementVersion;
  contractants?: ContractingParties;
  validationErrors?: ValidationError[];

  constructor(
    private readonly _translateService: SensesTranslateService,
    private readonly latestAgreement: LatestAgreementVersionGQL,
    private readonly resetAgreement: AgreementVersionResetGQL,
    private readonly agreementVersionService: AgreementVersionsGQL,
    private agreementAccountsService: AgreementAccountsService,
    private errorHandlerService: ErrorHandlerService
  ) {
    this.journey = null as unknown as Journey; // required @Input; make tsc happy
  }

  get headerConfig(): SummaryCardHeaderConfig {
    return {
      title: SummaryCardHeaderTitle.ContractingParty,
      showEditButton: this.showEditResetButtons,
      showResetButton: this.showEditResetButtons && this.containsAnyDraft(),
    };
  }

  get showEditResetButtons(): boolean {
    return (
      this.journey.viewMode === DisplayMode.Edit &&
      !this.error &&
      !this.showActive
    );
  }

  ngOnInit(): void {
    this._translateService.setTranslations(
      this.isPrivateBanking ? pbTranslations : translations
    );
  }

  /**
   * @param changes : It will contain the most recent value of angular variables
   * which are globally available. In this class, all the inputs we have. Basically
   * the hash table of changes.
   * Update the journey in the class with the latest value.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (isNil(changes.journey)) {
      return;
    }
    const journey: Journey = changes.journey.currentValue;
    const { productType, investmentArrangementNumber } = journey.agreement;
    this.isPrivateBanking = productType
      ? isPrivateBankingProduct(productType)
      : false;
    this.showEmployeeOnlyBanner = showEmployeeOnlyBanner(
      productType || InvestmentProductType.IndividualWealthManagement
    );
    this.journey = journey;
    this.showActive = journey.showActive ?? false;

    // unsubscribe any existing subscription
    this.querySubscription?.unsubscribe();

    if (!this.showActive) {
      this.fetchLatestAgreement(investmentArrangementNumber);
    } else {
      this.fetchActiveAgreement(investmentArrangementNumber);
    }
  }

  private fetchActiveAgreement(investmentArrangementNumber: string): void {
    this.querySubscription = this.agreementVersionService
      .fetch({
        investmentArrangementNumber,
        status: AgreementVersionStatus.Active,
      })
      .pipe(
        catchError(error => {
          throw this.errorHandlerService.handleHttpError(error);
        }),
        map(response =>
          this.errorHandlerService.handleGraphQLErrorIfPresent(
            response,
            'ERROR_QUERY'
          )
        ),
        map(response => response.data.agreementVersions[0])
      )
      .subscribe({
        next: data => {
          this.agreementVersion = data;
          // filter contractants to remove contracting party with modification flag removed
          this.excludeRemovedContractants();
          this.loading = false;
          this.setValidationErrors();
        },
        error: error => {
          this.error = error;
          this.loading = false;
        },
      });
  }

  private fetchLatestAgreement(investmentArrangementNumber: string): void {
    this.querySubscription = this.latestAgreement
      .fetch({
        investmentArrangementNumber,
      })
      .pipe(
        catchError(error => {
          throw this.errorHandlerService.handleHttpError(error);
        }),
        map(response =>
          this.errorHandlerService.handleGraphQLErrorIfPresent(
            response,
            'ERROR_QUERY'
          )
        ),
        map(response => response.data.latestAgreementVersion)
      )
      .subscribe({
        next: data => {
          this.agreementVersion = data;
          // filter contractants to remove contracting party with modification flag removed
          this.excludeRemovedContractants();
          this.loading = false;
          this.setValidationErrors();
        },
        error: error => {
          this.error = error;
          this.loading = false;
        },
      });
  }

  private excludeRemovedContractants(): void {
    this.contractants = this.agreementVersion?.contractingParties?.filter(
      contractant => contractant.modification !== Modification.Removed
    );
  }

  setValidationErrors(): void {
    this.validationErrors = [];
    this.contractants?.forEach(contractant => {
      const { validationErrors } = contractant;
      const displayName = contractant.contactDetails?.displayName ?? '';
      const errors = validationErrors.map(error => {
        return {
          message: this.getTranslatedMessage(displayName, error.subject),
          severity: error.severity,
        };
      });

      this.validationErrors = [...(this.validationErrors ?? []), ...errors];
    });
  }

  getTranslatedMessage(displayName: string, subject: string): string {
    return this._translateService.instant(subject, { displayName });
  }

  ngOnDestroy(): void {
    this.querySubscription?.unsubscribe();
    this.resetSubscription?.unsubscribe();
  }

  /**
   * Function to determine if either of contracting party or ascription contains
   * any draft data and returns a boolean
   */
  containsAnyDraft(): boolean {
    return !!(
      this.agreementVersion &&
      this.agreementVersion.status === AgreementVersionStatus.Draft &&
      (this.agreementVersion.changedFields.includes(
        AgreementVersionField.ContractingParties
      ) ||
        this.agreementVersion.changedFields.includes(
          AgreementVersionField.Ascription
        ))
    );
  }

  showActualizeMessage(): boolean {
    return (
      this.agreementVersion?.status === AgreementVersionStatus.Draft &&
      this.agreementVersion?.changedFields.includes(
        AgreementVersionField.ContractingParties
      ) &&
      this.journey?.agreement?.productType !== InvestmentProductType.SelfManaged
    );
  }

  noValidationErrors(): boolean {
    return (this.validationErrors ?? []).length === 0;
  }

  /**
   * Function for sending the event to parent flow for edit contracting party flow
   * on click of edit button
   * */
  onContractingPartyEdit(): void {
    const successCallBackEvent: FeatureOutputEvent = {
      type: EventType.NAVIGATE,
      navigation: NavigationType.FORWARD,
    };
    this.contractingPartySummaryEvent.emit(successCallBackEvent);
  }

  /**
   *
   * Function to trigger the opening of a modal
   */
  openModal(): void {
    this.resetDialog?.nativeElement.present();
  }

  /**
   *
   * Function to trigger handle the user action inside
   * reset dialog
   * @event : object :
   */
  handleResetDialog(event: CustomEvent): void {
    if (event.detail.confirmed) {
      this.resetContractingPartyAndAscription();
    }
  }

  /**
   * Function for sending the event to parent flow to reset Contracting Party and Ascription flow
   * on click of reset button.
   * Delete all the available drafts and upon completion, send a complete event
   * */
  resetContractingPartyAndAscription(): void {
    if (!this.agreementVersion) {
      throw new Error(
        'Cannot invoke resetContractingPartyAndAscription without an agreementVersion'
      );
    }
    const resetStartEvent: FeatureOutputEvent = {
      type: EventType.RESET_START,
    };
    const investmentArrangementNumber =
      this.journey.agreement.investmentArrangementNumber;
    this.contractingPartySummaryEvent.emit(resetStartEvent);
    this.resetSubscription = this.resetAgreement
      .mutate({
        investmentArrangementNumber,
        input: [AgreementPart.AscriptionAndContractingParties],
      })
      .subscribe({
        next: response => {
          if (!this.agreementVersion) {
            throw new Error('Invariant failed, missing agreement version');
          }
          const data = response.data;
          if (!data) {
            // TODO: Use graphql error handler to prevent missing data
            throw new Error('Missing data in reset response');
          }
          this.agreementVersion = {
            ...this.agreementVersion,
            changedFields: data.resetAgreement.changedFields,
            ascription: data.resetAgreement.ascription,
            contractingParties: data.resetAgreement.contractingParties.map(
              cp => ({
                ...cp,
                // TODO: fix missing type by including customerType in GQL
                customerType: AgreementCustomerType.NaturalPerson,
              })
            ),
          };
          this.excludeRemovedContractants();
          this.agreementAccountsService.refreshAccountSummary();
          this.contractingPartySummaryEvent.emit({
            type: EventType.RESET_COMPLETED,
          });
        },
        error: () => {
          this.contractingPartySummaryEvent.emit({
            type: EventType.RESET_ERROR,
          });
        },
      });
  }

  getTranslatedLabel(label: string): string {
    return this._translateService.instant(label);
  }

  openValidationModal(): void {
    this.validationDialog?.nativeElement.present();
  }
}
