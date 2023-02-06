import { CommandModule } from "yargs";
import { Arguments, Argv } from "yargs";
import fs from "fs-extra";
import path from "path";
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import {
  modifyPropertyInJsonFile,
  updateJSONFile,
  updatePreset,
} from "./utils";
import { exit } from "process";

export interface MoveFeatureArgs extends Arguments {
  source: string;
  destination: string;
}

const rl = readline.createInterface({ input, output });

export const moveFeatureCommand: CommandModule = {
  command: "move",
  describe:
    "Move feature from one directory to new directory inside libs/features in senses and updates related configs files",
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

export async function moveFeatureHandler(
  parsedArgs: MoveFeatureArgs
): Promise<void> {
  const isDestinationOk =
    parsedArgs.destination.indexOf("libs/features") !== -1;
  if (!isDestinationOk) {
    console.log("Destination should be inside libs/features.");
    process.exit(1);
  }

  const answer = await rl.question(`Are you sure to move feature \n
    from: ${parsedArgs.source} \n
    to: ${parsedArgs.destination}\n
    (y|n)
  `);
  rl.close();

  if (answer !== "y") {
    exit(1);
  }

  const src = path.join(path.resolve(), parsedArgs.source);
  const dest = path.join(path.resolve(), parsedArgs.destination);

  if (fs.existsSync(dest)) {
    console.log("Destination directory already exist.");
    process.exit(1);
  }

  // move directory to new location
  console.log("Moving features.......");

  moveDirectory(src, dest).then(() => {
    updateExtendsInTsConfig(dest);
    updateEsLintrc(dest);
    updateJestConfig(dest);
    updateOutDirPath(dest);
    updateProjectJson(src, dest);
    updateFeaturePath("workspace.json", src, dest);
    updateFeaturePath("tsconfig.base.json", src, dest);
    updateFeaturePath("code-owners.json", src, dest);
  });

  // updateFeaturePath("code-owners.json", src, dest);
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

async function updateExtendsInTsConfig(dest) {
  const pathToBaseConfig = path.join(path.resolve(), "tsconfig.base.json");
  const relativePathToBaseConfig = path.relative(dest, pathToBaseConfig);

  const destinationCofigFile = path.join(dest, "tsconfig.json");
  await modifyPropertyInJsonFile(
    destinationCofigFile,
    "extends",
    relativePathToBaseConfig
  );
}

async function updateEsLintrc(dest) {
  const isFeatureInInvestment = dest.split(path.sep).includes("investments");
  const currentEslintrcPath = isFeatureInInvestment
    ? path.join(
        path.resolve(),
        "libs/features/investments/config/.eslintrc.json"
      )
    : path.join(path.resolve(), ".eslintrc.json");
  const newRelativeEsLintrcPath = path.relative(dest, currentEslintrcPath);
  const destinationEsLintrcPath = path.join(
    path.resolve(dest),
    ".eslintrc.json"
  );
  await modifyPropertyInJsonFile(destinationEsLintrcPath, "extends", [
    newRelativeEsLintrcPath,
  ]);
}

async function updateJestConfig(dest) {
  const baseJestConfigPath = path.join(path.resolve(), "jest.preset.js");
  const newRelativeJestConfigPath = path.relative(dest, baseJestConfigPath);
  const newFilePath = path.join(path.resolve(dest), "jest.config.ts");
  await updatePreset(newFilePath, newRelativeJestConfigPath);
}

export async function updateOutDirPath(dest) {
  const pathOfOutDir = path.join(path.resolve(), "dist", "out-tsc");
  const relativePathOfOutDir = path.relative(dest, pathOfOutDir);
  const destPathFromRoot = dest.substring(dest.indexOf("/libs"));
  const updatedPathForConfg = path.join(relativePathOfOutDir, destPathFromRoot);

  const tsConfigLibPath = path.join(path.resolve(dest), "tsconfig.lib.json");
  const tsConfigSpecPath = path.join(path.resolve(dest), "tsconfig.spec.json");
  await modifyPropertyInJsonFile(
    tsConfigLibPath,
    "compilerOptions.outDir",
    updatedPathForConfg
  );
  await modifyPropertyInJsonFile(
    tsConfigSpecPath,
    "compilerOptions.outDir",
    updatedPathForConfg
  );
}

export async function updateProjectJson(src, dest) {
  const baseProjectSchemaPath = path.resolve(
    "node_modules/nx/schemas/project-schema.json"
  );
  const relativeBaseProjectSchemaPath = path.relative(
    dest,
    baseProjectSchemaPath
  );
  const destFilePath = path.join(path.resolve(dest), "project.json");

  // update $schema with value with path relative to destination
  await modifyPropertyInJsonFile(
    destFilePath,
    "$schema",
    relativeBaseProjectSchemaPath
  );

  updateFeaturePath(destFilePath, src, dest);
}

export async function updateFeaturePath(filePath, src, dest) {
  const find = src.substring(src.indexOf("libs/features"));
  const replace = dest.substring(dest.indexOf("libs/features"));
  await updateJSONFile(filePath, find, replace);
  console.log(`The ${path.basename(filePath)} has been updated!`);
}
