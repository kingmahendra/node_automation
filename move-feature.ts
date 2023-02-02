import { CommandModule } from "yargs";
import { Arguments, Argv } from "yargs";
import fs from "fs-extra";
import path from "path";
import {
  updateExtendsInTsConfig,
  updateEsLintrc,
  updateJestConfig,
  updateOutDirPath,
  updateProjectJson,
  updateFeaturePath,
} from "./utils";

export interface MoveFeatureArgs extends Arguments {
  source: string;
  destination: string;
}

export const moveFeatureCommand: CommandModule = {
  command: "move",
  describe: "Move feature from one directory to new directory",
  builder: withMoveFeatureOptions,
  handler: moveFeatureHandler,
};

export function withMoveFeatureOptions(yargs: Argv): Argv<MoveFeatureArgs> {
  return yargs
    .option("source", {
      describe: "Path of source directory",
      type: "string",
    })
    .option("destination", {
      describe: "Path of destination directory",
      type: "string",
    })
    .demandOption(
      ["source"],
      `Please provide path of source feature you want move.`
    );
}

export function moveFeatureHandler(parsedArgs: MoveFeatureArgs): Promise<void> {
  const src = path.join(path.resolve(), parsedArgs.source);
  const dest = path.join(path.resolve(), parsedArgs.destination);
  // if(fs.existsSync(dest)) {
  //     console.log('Destination directory already exist.');
  //     process.exit(1);
  //    // return;
  // }
  // move directory to new location

  // moveDirectory(src, dest)
  //  .then(() => {
  //     updateExtendsInTsConfig(dest)
  //     updateEsLintrc(dest);
  //     updateJestConfig(dest);
  //     updateOutDirPath(dest);
  //     updateProjectJson(src, dest);
  //     updateFeaturePath("workspace.json", src, dest);
  //     updateFeaturePath("tsconfig.base.json", src, dest);
  //     updateFeaturePath("code-owners.json", src, dest);
  //  });

  updateFeaturePath("code-owners.json", src, dest);
  return Promise.resolve();
}

async function moveDirectory(src, dest) {
  try {
    await fs.move(src, dest);
    console.log("Directory moved successfully!");
  } catch (err) {
    console.error(err);
  }
}
