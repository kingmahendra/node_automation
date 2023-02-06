import fs from "fs-extra";
import path from "path";

export async function updatePreset(filePath: string, newPreset: string): Promise<void> {
  try {
    let data = await fs.readFile(filePath, "utf8");
    data = data.replace(/preset:.*,/g, `preset: '${newPreset}',`);
    await fs.writeFile(filePath, data);
    Promise.resolve();
    console.log(`The ${path.basename(filePath)} has been updated!`);
  } catch (err) {
    console.error(err);
    Promise.reject(); 
  }
}

export async function modifyPropertyInJsonFile(
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
    console.log(`The ${path.basename(filePath)} has been updated!`);
  } catch (err) {
    console.error(err);
    Promise.reject();
  }
}

export const replaceStringInObject = async (obj, find, replace) => {
  for (const key in obj) {
    if (typeof obj[key] === "string") {
      obj[key] = obj[key].replace(find, replace);
    } else if (typeof obj[key] === "object") {
      await replaceStringInObject(obj[key], find, replace);
    }
  }
};

export const updateJSONFile = async (filePath, find, replace): Promise<void> => {
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
