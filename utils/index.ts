import fs from "fs-extra";
import path from "path";

export async function updateExtendsInTsConfig(dest) {
  const pathToBaseConfig = path.join(path.resolve(), "tsconfig.base.json");
  const relativePathToBaseConfig = path.relative(dest, pathToBaseConfig);

  const destinationCofigFile = path.join(dest, "tsconfig.json");
  await modifyPropertyInJsonFile(
    destinationCofigFile,
    "extends",
    relativePathToBaseConfig
  );
}

export async function updateEsLintrc(dest) {
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

export async function updateJestConfig(dest) {
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
    '$schema',
    relativeBaseProjectSchemaPath
  );

  updateFeaturePath(destFilePath,src, dest);
}

export async function updateFeaturePath(filePath, src, dest){
  const find = src.substring(src.indexOf("libs/features"));
  const replace = dest.substring(dest.indexOf("libs/features"));
  await updateJSONFile(filePath, find, replace);
}

async function updatePreset(filePath: string, newPreset: string): Promise<void> {
  try {
    let data = await fs.readFile(filePath, "utf8");
    data = data.replace(/preset:.*,/g, `preset: '${newPreset}',`);
    await fs.writeFile(filePath, data);
    Promise.resolve();
  } catch (err) {
    console.error(err);
    Promise.reject(); 
  }
}

async function modifyPropertyInJsonFile(
  filePath: string,
  key: string,
  newValue: string | Array<string>
): Promise<void> {
  if (!fs.existsSync(filePath)) {
    console.error(`${filePath} does not exist`);
    return;
  }
  try {
    // Read the JSON file
    const jsonObject = await fs.readJson(filePath);

    const pathKeys = key.split(".");
    const lastKey = pathKeys.pop();
    const nestedObject = pathKeys.reduce((obj, k) => obj[k], jsonObject);
    // Modify the object as needed
    nestedObject[lastKey] = newValue;

    // Write the modified object back to the file
    await fs.writeJson(filePath, jsonObject, { spaces: 2 });
    Promise.resolve();
    console.log("The file has been saved!");
  } catch (err) {
    console.error(err);
    Promise.reject();
  }
}

const replaceStringInObject = async (obj, find, replace) => {
  for (const key in obj) {
    if (typeof obj[key] === "string") {
      obj[key] = obj[key].replace(find, replace);
    } else if (typeof obj[key] === "object") {
      await replaceStringInObject(obj[key], find, replace);
    }
  }
};

const updateJSONFile = async (filePath, find, replace): Promise<void> => {
  try {
    const data = await fs.readJson(filePath);
    await replaceStringInObject(data, find, replace);
    await fs.writeJson(filePath, data, { spaces: 2 });
    Promise.resolve();
  } catch (error) {
    console.error(error);
    Promise.reject();
  }
};
