import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Vibration, TextInput } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { GUI, STRING, LOG } from "./../hooks/useTools";
import { STYLES } from "../config/default";
import { LANGUAGES } from "../config/languages";
import BasicData from "./../classes/BasicData";

// usage : DropDownInput( 'category', categories, setCategories, setCategoriesUpdated )
// note : ddiItems item schema  schema={{ label: 'label', (required), value: 'value', (required), ... }
const DropDownInput = ({ ddiDomain, ddiItems, setDdiItems, setDdiUpdated, ddiControllerState }) => {
  const [open, setOpen] = useState(false); // DropDownPicker open state
  const [value, setValue] = useState(null); // DropDownPicker value
  const [ddiLabel, setDdiLabel] = useState(""); // label in the TextInput component
  const [ddiMessage, setDdiMessage] = useState(""); // error or notification message
  const [ddiItem, setDdiItem] = useState(new BasicData()); // Item corresponding to the DropDownPicker value

  useEffect(() => {
    if (!ddiMessage) return;
    const timeout = setTimeout(() => {
      setDdiMessage("");
    }, 2000);
    return () => clearTimeout(timeout);
  }, [ddiMessage]);

  useEffect(() => {
    if (ddiControllerState?.open) {
      setOpen(true);
    }
  }, [ddiControllerState]);

  LOG.console(`ddiItem=${JSON.stringify(ddiItem)}`);
  LOG.console(`ddiItems`, ddiItems);
  LOG.console(`ddiLabel=${ddiLabel}`);

  return (
    <>
      <Text style={STYLES.label}>{STRING.toTitleCase(LANGUAGES.translate(ddiDomain))}</Text>
      <DropDownPicker
        open={open}
        value={value}
        items={ddiItems} // Objects
        setOpen={setOpen}
        setValue={setValue}
        setItems={setDdiItems}
        placeholder={LANGUAGES.translate("Select an item")}
        containerStyle={{ marginBottom: 20, height: 40, width: "100%" }}
        itemStyle={{ justifyContent: "flex-start", height: 35 }}
        dropDownMaxHeight={120}
        onChangeValue={selectedValue => {
          const selectedItem = ddiItems.find(item => item.value === selectedValue);
          if (!selectedItem) return;
          const label = selectedItem?.mode === "RO" ? LANGUAGES.translate(selectedItem.value) : selectedItem?.value;
          setDdiItem(BasicData.Build(selectedItem.domain, label, selectedItem.value, selectedItem.mode));
          setDdiLabel(label);
        }}
      />
      <GUI.Spacer style={{ margin: 0, marginTop: 5, height: open ? 140 : 0 }} />

      <TextInput
        value={ddiLabel}
        onChangeText={text => {
          if (text.length <= 25) setDdiLabel(text);
        }}
        editable={ddiItem.mode === "RW"}
        style={[STYLES.dropDownTextInput]}
        onEndEditing={() => {
          const label = STRING.alphanumeric(ddiLabel.trim());
          if (label === "" && ddiItem.value !== "" && ddiItem.mode === "RW") {
            // Delete case
            setDdiItems(ddiItems.filter(item => item.value.toUpperCase() !== ddiItem.value.toUpperCase()));
            setValue(null);
            if (setDdiUpdated) setDdiUpdated(true);
            setDdiMessage(LANGUAGES.translate("Value deleted"));
          } else if (label !== "" && ddiItem.mode === "RW") {
            if (ddiLabel.trim() !== ddiItem.label && ddiItems.some(item => item.label.toUpperCase() === label.toUpperCase() || item.value.toUpperCase() === label.toUpperCase())) {
              Vibration.vibrate(50);
              setDdiMessage(LANGUAGES.translate("This value already exists"));
            } else {
              if (ddiItem.value === "") {
                // Insert case
                const ddiItemsUpdated = [
                  ...ddiItems.filter(item => item.value !== "").map(item => (item.mode === "RO" ? item : BasicData.Build(item.domain, `(*) ${item.value}`, item.value, item.mode))),
                  BasicData.Build(ddiDomain, `(*) ${label}`, label, "RW"), // new item
                  BasicData.Build(ddiDomain, LANGUAGES.translate("(*) New item"), "", "RW"),
                ];
                LOG.console("ddiItems updated after insert", ddiItemsUpdated);

                setDdiItems(ddiItemsUpdated);
                if (setDdiUpdated) setDdiUpdated(true);
                setDdiMessage(LANGUAGES.translate("New value added"));
                setDdiLabel("");
                setValue(null);
              } else if (ddiItem.value !== label) {
                // Update case
                const ddiItemsUpdated = [
                  ...ddiItems.filter(item => item.value !== "").map(item => (item.mode === "RO" ? item : BasicData.Build(item.domain, `(*) ${ddiItem.value == item.value ? label : item.value}`, ddiItem.value == item.value ? label : item.value, item.mode))),
                  BasicData.Build(ddiDomain, LANGUAGES.translate("(*) New item"), "", "RW"),
                ];
                LOG.console("ddiItems updated after update", ddiItemsUpdated);

                setDdiItems(ddiItemsUpdated);
                if (setDdiUpdated) setDdiUpdated(true);
                setDdiMessage(LANGUAGES.translate("Value updated"));
                setDdiLabel("");
                setValue(null);
              }
            }
          }
        }}
      />

      <Text style={STYLES.errorMessage}>{ddiMessage}</Text>
    </>
  );
};

const styles = StyleSheet.create({});

export default DropDownInput;
