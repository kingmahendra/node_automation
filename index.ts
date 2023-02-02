#!/usr/bin/env ts-node

import * as yargs from 'yargs';
import {moveFeatureCommand} from './move-feature'



yargs
  .usage('Rabobank Senses CLI - Dev Tools')
  .command(moveFeatureCommand)
  .demandCommand()
  .version()
  .help()
  .scriptName('feature')
  .strictCommands()
  .showHelpOnFail(false, 'Specify --help for available options')
  // .epilog('For more information, read the senses documentation')
  .wrap(yargs.terminalWidth()).argv;

