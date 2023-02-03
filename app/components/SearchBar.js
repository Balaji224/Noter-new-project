import React from "react";
import { View, StyleSheet, TextInput } from "react-native";
import colors from "../misc/colors";
import { AntDesign } from "@expo/vector-icons";

const SearchBar = ({ containerStyle, value, onChangeText, onClear }) => {
  return (
    <View style={[styles.container, { ...containerStyle }]}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={styles.SearchBar}
        placeholder="Search here.."
      />
      {value ? (
        <AntDesign
          name="close"
          size={20}
          color={colors.PRIMARY4}
          onPress={onClear}
          style={styles.clearIcon}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  SearchBar: {
    borderWidth: 3,
    borderColor: colors.PRIMARY2,
    opacity: 0.6,
    height: 40,
    borderRadius: 40,
    paddingLeft: 15,
    fontSize: 30,
  },
  container: {
    justifyContent: "center",
  },
  clearIcon: {
    position: "absolute",
    right: 9,
    fontSize: 23,
    fontWeight: "bold",
  },
});

export default SearchBar;
