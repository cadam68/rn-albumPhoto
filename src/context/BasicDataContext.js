import createDataContext from "./createDataContext";
import BasicData from "./../classes/BasicData";
import { LANGUAGES } from "./../config/languages";
import { STORAGE, LOG } from "./../hooks/useTools";
import { CONST } from "./../config/default";

const basicDataReducer = (state, action) => {
  switch (action.type) {
    case "load_basicData":
      return action.payload;
    default:
      return state;
  }
};

const loadBasicData = dispatch => async () => {
  try {
    LOG.console("- load basicData -");
    let basicData = await STORAGE.getItem("basicData");
    if (!basicData) {
      LOG.console("- initialise basicData -");
      basicData = CONST.basicData;
      await STORAGE.setItem("basicData", basicData);
    }
    basicData = basicData.map(item => BasicData.Build(item.domain, item.mode == "RO" ? LANGUAGES.translate(item.label) : item.label, item.value, item.mode));
    basicData.forEach(item => LOG.console(`load ${item.toString()}`));
    dispatch({ type: "load_basicData", payload: basicData });
  } catch (err) {
    LOG.console(err);
  }
};

const resetBasicData = dispatch => async () => {
  try {
    LOG.console("- reset basicData -");
    await STORAGE.removeItem("basicData");
    await loadBasicData(dispatch)();
  } catch (err) {
    LOG.console(err);
  }
};

const updateDomain = dispatch => async (domain, newItems) => {
  try {
    LOG.console(`- update ${domain} basicData -`);
    newItems.forEach(item => LOG.console(`new ${item.toString()}`));
    let basicData = await STORAGE.getItem("basicData");
    basicData = [...basicData.filter(item => item.domain != domain), ...CONST.basicData.filter(item => item.domain == domain), ...newItems].map(item => BasicData.Build(item.domain, item.label, item.value, item.mode));
    basicData.forEach(item => LOG.console(`save ${item.toString()}`));
    await STORAGE.setItem("basicData", basicData);
    basicData = basicData.map(item => BasicData.Build(item.domain, item.mode == "RO" ? LANGUAGES.translate(item.label) : item.label, item.value, item.mode));
    basicData.forEach(item => LOG.console(`load ${item.toString()}`));
    dispatch({ type: "load_basicData", payload: basicData });
  } catch (err) {
    LOG.console(err);
  }
};

export const { Provider, Context } = createDataContext(basicDataReducer, { resetBasicData, updateDomain }, [], loadBasicData);
