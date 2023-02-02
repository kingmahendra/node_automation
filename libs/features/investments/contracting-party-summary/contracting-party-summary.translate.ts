import { ISensesTranslation } from '@senses/shared-translate';

export const translations: ISensesTranslation = {
  en: {
    CONTRACTANTEN: 'Contracting Parties',
    CONTRACTING_PARTIES: 'Account Holders',
    ASCRIPTION: 'Ascription',
    MORE_INFO: 'More information',
    RESET_DIALOG_TEXT: 'Are you sure that you want to reverse your changes?',
    CONFIRM: 'Yes',
    CANCEL: 'No',
    CONTRACTS_MODIFIED_MESSAGE: 'There are changes ready to be signed.',
    CONTRACTANTS_MODIFIED_MESSAGE:
      'There are changes ready to be signed. The contracting parties have changed, you therefore need to actualize the Investment principles before proceeding with Printing and Signing. If you want to replace a contracting party then only actualize after adding the new contracting party.',
    CONTRACTS_INCOMPLETE_WARNING_MESSAGE:
      'The submitted changes are not complete. Please correct.',
    CONTRACTS_INVALID_WARNING_MESSAGE:
      'The submitted changes are not valid. Please correct.',
    CONTRACTS_ERROR_MESSAGE:
      'Validate customer check results and missing data.',
    CONTRACTS_ERROR_MESSAGE_TITLE: 'Check results and missing data.',
    CONTRACTING_PARTY_CUSTOMER_TYPE:
      'The desired new account holder {{displayName}} is an organisation and therefore cannot be added into a private agreement.',
    CONTRACTING_PARTY_LEGAL_RESTRAINTS:
      'Account holder {{displayName}} is under guardianship or administration.',
    CONTRACTING_PARTY_KI:
      'KI test for {{displayName}} is not approved. Change can only be approved after a successfully completed KI test.',
    CONTRACTING_PARTY_US_PERSON:
      'Account holder {{displayName}} is classified as a US person and does not have a W9 form. The change can be resumed after registration of a signed W9 form (redirects this signal to the CRS-FATCA desk).',
    CONTRACTING_PARTY_SANCTIONED_COUNTRY:
      'Account holder {{displayName}} comes from a sanctioned country.',
    CONTRACTING_PARTY_NON_SERVICED_COUNTRY:
      'Account holder {{displayName}} is a resident of the United States, Australia or Switzerland.',
    CONTRACTING_PARTY_CRS:
      'Fiscal data is missing for {{displayName}}. Changes can be printed but can only be activated after registration of a signed CRS form (possible via the CRS-FATCA desk).',
    CONTRACTING_PARTY_MIFID:
      "Identification information is missing for {{displayName}}. Complete this by clicking on 'Edit'.",
  },
  nl: {
    CONTRACTANTEN: 'Contractanten',
    CONTRACTING_PARTIES: 'Rekeninghouders',
    ASCRIPTION: 'Tenaamstelling',
    MORE_INFO: 'Meer informatie',
    RESET_DIALOG_TEXT: 'Weet je zeker dat je alle wijzigingen wil weggooien?',
    CONFIRM: 'Ja',
    CANCEL: 'Nee',
    CONTRACTS_MODIFIED_MESSAGE:
      'Er staan wijzigingen klaar om te worden ondertekend.',
    CONTRACTANTS_MODIFIED_MESSAGE:
      'De rekeninghouders zijn gewijzigd, je dient daarom de Uitgangspunten te actualiseren voordat je naar Printen en Ondertekenen gaat. Indien je een rekeninghouder wilt vervangen door een andere, dan actualiseer je de Uitgangspunten nadat je de nieuwe rekeninghouder hebt toegevoegd.',
    CONTRACTS_INCOMPLETE_WARNING_MESSAGE:
      'De aangebrachte wijzigingen zijn niet compleet. Corrigeer dit.',
    CONTRACTS_INVALID_WARNING_MESSAGE:
      'De aangebrachte wijzigingen zijn niet valide. Corrigeer dit.',
    CONTRACTS_ERROR_MESSAGE: 'Check toets resultaten en ontbrekende gegevens.',
    CONTRACTS_ERROR_MESSAGE_TITLE: 'Toets resultaten en ontbrekende gegevens.',
    CONTRACTING_PARTY_CUSTOMER_TYPE:
      'Gewenste nieuwe rekeninghouder {{displayName}} is een organisatie en kan daarom niet aan een particuliere overeenkomst worden toegevoegd.',
    CONTRACTING_PARTY_LEGAL_RESTRAINTS:
      'Rekeninghouder {{displayName}} staat onder curatele of bewind.',
    CONTRACTING_PARTY_KI:
      'KI toets voor {{displayName}} niet akkoord. Wijziging kan worden voortgezet na succesvol afgeronde KI toets.',
    CONTRACTING_PARTY_US_PERSON:
      'Rekeninghouder {{displayName}} is aangemerkt als een US person en heeft geen W9-formulier. Wijziging kan worden voortgezet na registratie van getekend W9 formulier (leidt dit signaal door naar  CRS-FATCA desk).',
    CONTRACTING_PARTY_SANCTIONED_COUNTRY:
      'Rekeninghouder {{displayName}} komt uit een sanctieland.',
    CONTRACTING_PARTY_NON_SERVICED_COUNTRY:
      'Rekeninghouder {{displayName}} is inwoner van de Verenigde Staten, Australië of Zwitserland.',
    CONTRACTING_PARTY_CRS:
      'Er ontbreken fiscale gegevens voor {{displayName}}. Wijziging kan worden geprint maar kan pas worden geactiveerd na registratie van een getekend CRS formulier (eventueel via CRS-FATCA desk).',
    CONTRACTING_PARTY_MIFID:
      "Er ontbreken identificatiegegevens voor {{displayName}}. Vul deze aan door op 'Wijzigen' te klikken.",
  },
};
export const pbTranslations: ISensesTranslation = {
  en: {
    CONTRACTANTEN: 'Contracting Parties',
    CONTRACTING_PARTIES: 'Account Holders',
    ASCRIPTION: 'Ascription',
    MORE_INFO: 'More information',
    RESET_DIALOG_TEXT: 'Are you sure that you want to reverse your changes?',
    CONFIRM: 'Yes',
    CANCEL: 'No',
    CONTRACTS_MODIFIED_MESSAGE: 'There are changes ready to be signed.',
    CONTRACTANTS_MODIFIED_MESSAGE: `The contracting parties have changed, you therefore need to actualize the Investment principles before proceeding with Printing and Signing.
       If you want to replace a contracting party then only actualize after adding the new contracting party.`,
    CONTRACTS_INCOMPLETE_WARNING_MESSAGE:
      'The submitted changes are not complete. Please correct.',
    CONTRACTS_INVALID_WARNING_MESSAGE:
      'The submitted changes are not valid. Please correct.',
    CONTRACTS_ERROR_MESSAGE:
      'Validate customer check results and missing data.',
    CONTRACTS_ERROR_MESSAGE_TITLE: 'Check results and missing data.',
    CONTRACTING_PARTY_CUSTOMER_TYPE:
      'The desired new account holder {{displayName}} is an organisation and therefore cannot be added into a private agreement.',
    CONTRACTING_PARTY_LEGAL_RESTRAINTS:
      'Account holder {{displayName}} is under guardianship or administration.',
    CONTRACTING_PARTY_KI:
      'KI test for {{displayName}} is not approved. Change can only be approved after a successfully completed KI test.',
    CONTRACTING_PARTY_US_PERSON: `Account holder {{displayName}} is classified as a US person and does not have a W9 form.
       The change can be resumed after registration of a signed W9 form (redirects this signal to the CRS-FATCA desk).`,
    CONTRACTING_PARTY_SANCTIONED_COUNTRY:
      'Account holder {{displayName}} comes from a sanctioned country.',
    CONTRACTING_PARTY_NON_SERVICED_COUNTRY:
      'Account holder {{displayName}} is a resident of the United States, Australia or Switzerland.',
    CONTRACTING_PARTY_CRS: `Fiscal data is missing for {{displayName}}.
      Changes can be printed but can only be activated after registration of a signed CRS form (possible via the CRS-FATCA desk).`,
    CONTRACTING_PARTY_MIFID:
      "Identification information is missing for {{displayName}}. Complete this by clicking on 'Edit'.",
  },
  nl: {
    CONTRACTANTEN: 'Contractanten',
    CONTRACTING_PARTIES: 'Rekeninghouders',
    ASCRIPTION: 'Tenaamstelling',
    MORE_INFO: 'Meer informatie',
    RESET_DIALOG_TEXT: 'Weet u zeker dat u alle wijzigingen wil weggooien?',
    CONFIRM: 'Ja',
    CANCEL: 'Nee',
    CONTRACTS_MODIFIED_MESSAGE:
      'Er staan wijzigingen klaar om te worden ondertekend.',
    CONTRACTANTS_MODIFIED_MESSAGE: `De rekeninghouders zijn gewijzigd, u dient daarom de Uitgangspunten te actualiseren voordat u naar Printen en Ondertekenen gaat.
       Indien u een rekeninghouder wilt vervangen door een andere, dan actualiseert u de Uitgangspunten nadat u de nieuwe rekeninghouder heeft toegevoegd.`,
    CONTRACTS_INCOMPLETE_WARNING_MESSAGE:
      'De aangebrachte wijzigingen zijn niet compleet. Corrigeer dit.',
    CONTRACTS_INVALID_WARNING_MESSAGE:
      'De aangebrachte wijzigingen zijn niet valide. Corrigeer dit.',
    CONTRACTS_ERROR_MESSAGE: 'Check toets resultaten en ontbrekende gegevens.',
    CONTRACTS_ERROR_MESSAGE_TITLE: 'Toets resultaten en ontbrekende gegevens.',
    CONTRACTING_PARTY_CUSTOMER_TYPE:
      'Gewenste nieuwe rekeninghouder {{displayName}} is een organisatie en kan daarom niet aan een particuliere overeenkomst worden toegevoegd.',
    CONTRACTING_PARTY_LEGAL_RESTRAINTS:
      'Rekeninghouder {{displayName}} staat onder curatele of bewind.',
    CONTRACTING_PARTY_KI:
      'KI toets voor {{displayName}} niet akkoord. Wijziging kan worden voortgezet na succesvol afgeronde KI toets.',
    CONTRACTING_PARTY_US_PERSON: `Rekeninghouder {{displayName}} is aangemerkt als een US person en heeft geen W9-formulier.
      Wijziging kan worden voortgezet na registratie van getekend W9 formulier (leidt dit signaal door naar  CRS-FATCA desk).`,
    CONTRACTING_PARTY_SANCTIONED_COUNTRY:
      'Rekeninghouder {{displayName}} komt uit een sanctieland.',
    CONTRACTING_PARTY_NON_SERVICED_COUNTRY:
      'Rekeninghouder {{displayName}} is inwoner van de Verenigde Staten, Australië of Zwitserland.',
    CONTRACTING_PARTY_CRS: `Er ontbreken fiscale gegevens voor {{displayName}}. Wijziging kan worden geprint maar kan pas worden geactiveerd
       na registratie van een getekend CRS formulier (eventueel via CRS-FATCA desk).`,
    CONTRACTING_PARTY_MIFID:
      "Er ontbreken identificatiegegevens voor {{displayName}}. Vul deze aan door op 'Wijzigen' te klikken.",
  },
};
