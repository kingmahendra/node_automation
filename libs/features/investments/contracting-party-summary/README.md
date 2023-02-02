## This is part of the employee app summary screen, it's one of the cards of the page. You can find the full screen here
libs/pages/employee/investments/portfolio-dashboard/agreement-summary

## Use this command to unit test the feature
yarn test investments-contracting-party-summary

## Use this command to test a specific file
yarn test investments-contracting-party-summary --test-file=libs/features/investments/contracting-party-summary/*filename* --codeCoverage=true

## Location of mocks used for this feature
libs/mocks/employee/__files/investments/agreements/graphql/latestAgreementVersion/investments-agreement-summary/agreement-version-latest.json

## Use this command to build the application
yarn start employee

## URL for local test
http://localhost:8765/investments/portfolio-dashboard/agreement?agreementId=IVB&relationId=person

## Stub agreements for the PCF test
https://confluence.dev.rabobank.nl/display/BSEB/Cactus+Stub+Data

## Confluence page
https://confluence.dev.rabobank.nl/display/BSEB/06+-+FE+Module
