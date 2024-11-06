import createStateContext from "./createStateContext";
import BasicData from "./../classes/BasicData";
import { LANGUAGES } from "./../config/languages";
import { LOG } from "./../hooks/useTools";

async function loader(setter) {
  LOG.console("- initialise basicData -");
  const basicData = [];
  basicData.push(BasicData.Build("imageSize", LANGUAGES.translate("Optimised"), 500));
  basicData.push(BasicData.Build("imageSize", LANGUAGES.translate("Standard resolution"), 1024));
  basicData.push(BasicData.Build("imageSize", LANGUAGES.translate("High resolution"), 2024));
  basicData.push(BasicData.Build("category", LANGUAGES.translate("Holidays"), "holidays"));
  basicData.push(BasicData.Build("category", LANGUAGES.translate("Events"), "events"));
  basicData.push(BasicData.Build("category", LANGUAGES.translate("Family"), "family"));
  basicData.push(BasicData.Build("category", LANGUAGES.translate("Others"), "others"));
  setter(basicData);
}

export const { Provider, Context } = createStateContext(loader, []);
