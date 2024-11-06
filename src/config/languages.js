import AsyncStorage from "@react-native-async-storage/async-storage";
import { sprintf } from "sprintf-js";
import { LOG } from "./../hooks/useTools";

const dictionary = {
  // ----------------- Splash screen -----------------
  Welcome: { FR: "Bonjour,\n\nMerci de partager vos souvenirs avec la famille.\n\nLaura", GB: "Hello,\n\nThank you for sharing your memories with the family.\n\nLaura", ES: "Hola,\n\nGracias por compartir tus recuerdos con la familia.\n\nLaura" },
  // ----------------- Settings screen -----------------
  Name: { FR: "Nom", GB: "Name", ES: "Nombre" },
  Resolution: { FR: "Resolution", GB: "Resolution", ES: "Resolución" },
  Save: { FR: "Sauvegarde", GB: "Save", ES: "Guardar" },
  "Version %s": { FR: "Version %s", GB: "Version %s", ES: "Versión %s" },
  "Configuration Saved": { FR: "Configuration Sauvegardée", GB: "Configuration Saved", ES: "Configuración guardada" },
  "Configuration Reset": { FR: "Réinitialisation de la configuration", GB: "Configuration Reset", ES: "Restablecimiento de la configuración" },
  "Please enter at least %d characters": { FR: "Veuillez entrer au moins %d caractères", GB: "Please enter at least %d characters", ES: "Ingresa al menos %d caracteres" },
  "Something went wrong...": { FR: "Une erreur s'est produite...", GB: "Something went wrong...", ES: "Algo salió mal..." },
  "Your Name": { FR: "Votre Nom", GB: "Your Name", ES: "Tu nombre" },
  "Select an item": { FR: "Sélectionnez un élément", GB: "Select an item", ES: "Selecciona un artículo" },
  Language: { FR: "Langue", GB: "Language", ES: "Idioma" },
  "Language set to %s, please restart the application": { FR: "Langue définie sur %s, veuillez redémarrer l'application", GB: "Language set to %s, please restart the application", ES: "Idioma configurado en %s, reinicia la aplicación" },
  "Value deleted": { FR: "Valeur effacée", GB: "Value deleted", ES: "Valor eliminado" },
  "This category already exists": { FR: "Cette valeur existe déjà", GB: "This value already exists", ES: "Este valor ya existe" },
  "New value added": { FR: "Valeur ajoutée", GB: "New value added", ES: "Nuevo valor agregado" },
  "Value updated": { FR: "Valeur modifiée", GB: "Value updated", ES: "Valor actualizado" },
  // ----------------- Photo screen -----------------
  "Send Photo": { FR: "Envoyer la photo", GB: "Send Photo", ES: "Enviar Foto" },
  "Photo successfully sent !": { FR: "Photo envoyée avec succès !", GB: "Photo successfully sent !", ES: "Foto enviada con éxito !" },
  "Sorry, we need camera roll permissions to allow you to upload your photo !": {
    FR: "Désolé, nous avons besoin des autorisations de pellicule pour vous permettre de télécharger votre photo !",
    GB: "Sorry, we need camera roll permissions to allow you to upload your photo !",
    ES: "Lo sentimos, necesitamos permisos de cámara para permitirle subir su foto.",
  },
  // ----------------- BasicData -----------------
  // 'Anniversary': {'FR':'Anniversaire', 'GB':'Anniversary', 'ES':'Aniversario'},
  // 'Holidays': {'FR':'Vacances', 'GB':'Holidays', 'ES':'Vacaciones'},
  // 'Celebrations': {'FR':'Fetes', 'GB':'Celebrations', 'ES':'Días festivos'},
  Optimised: { FR: "Optimisé", GB: "Optimised", ES: "Optimizado" },
  "Standard resolution": { FR: "Résolution standard", GB: "Standard resolution", ES: "Resolución estándar" },
  "High resolution": { FR: "Haute résolution", GB: "High resolution", ES: "Alta resolución" },
  Holidays: { FR: "Vacances", GB: "Holidays", ES: "Vacaciones" },
  Events: { FR: "Événements", GB: "Events", ES: "Eventos" },
  Family: { FR: "Famille", GB: "Family", ES: "Familia" },
  Others: { FR: "Autres", GB: "Others", ES: "Otras" },
  "New item": { FR: "Nouvelle valeur", GB: "New item", ES: "Nuevo valor" },
  Category: { FR: "Categorie", GB: "Category", ES: "Categoría" },
  City: { FR: "Ville", GB: "City", ES: "Ciudad" },
  Country: { FR: "Pays", GB: "Country", ES: "País" },
  // ----------------- Other -----------------
  "set language to %s": { FR: "définir la langue %s", GB: "set language to %s", ES: "establecer el idioma en %s" },
};

let availableLanguages = ["FR", "GB", "ES"];
let currentLanguage = "GB";

export const LANGUAGES = {
  setLanguage: async function (str) {
    if (availableLanguages.indexOf(str) != -1 && str != currentLanguage) {
      try {
        await AsyncStorage.setItem("currentLanguage", str);
        return true;
      } catch (error) {
        LOG.error("AsyncStorage#setItem error: " + error.message);
      }
    } else return false;
  },
  getLanguage: function (str) {
    return currentLanguage;
  },
  translate: function (str, ...param) {
    if (typeof str == undefined || str == "") return "";
    let entry = dictionary[str];
    if (!entry) entry = dictionary[Object.keys(dictionary).filter(key => key.toLowerCase() == str.toLowerCase())];
    if (!(entry && entry[currentLanguage])) LOG.warn(`/!\\ Missing dictionary.'${str}' entry`);
    return entry && entry[currentLanguage] ? sprintf(entry[currentLanguage], ...param) : sprintf(str, ...param);
  },
  restore: async function () {
    try {
      let val = await AsyncStorage.getItem("currentLanguage");
      if (val) currentLanguage = val;
      LOG.console(`get currentLanguage=[${currentLanguage}] from AsyncStorage`);
    } catch (error) {
      LOG.error("AsyncStorage#setItem error: " + error.message);
    }
  },
  clearPersistence: async function () {
    try {
      await AsyncStorage.removeItem("currentLanguage");
      currentLanguage = "GB";
    } catch (error) {
      LOG.error("AsyncStorage#setItem error: " + error.message);
    }
  },
};
