import React, { useState } from "react";
import { View, StyleSheet, Text, ScrollView, Alert } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import colors from "../misc/colors";
import RoundIconBtn from "./RoundIconBtn";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNotes } from "../contexts/NoteProvider";
import NoteInputModal from "./NoteInputModal";

const formatDate = ms => {
  const date = new Date(ms);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hrs = date.getHours();
  const min = date.getMinutes();
  const sec = date.getSeconds();
  return `${day}/${month}/${year} On ${hrs}:${min}:${sec}`;
};

const NoteDetail = props => {
  const [note, setNote] = useState(props.route.params.note);
  const headerHeight = useHeaderHeight();
  const { setNotes } = useNotes();
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const deleteNote = async () => {
    const result = await AsyncStorage.getItem("notes");
    let notes = [];
    if (result !== null) notes = JSON.parse(result);
    const newNotes = notes.filter(n => n.id !== note.id);
    setNotes(newNotes);
    await AsyncStorage.setItem("notes", JSON.stringify(newNotes));
    props.navigation.goBack();
  };
  const displayDeleteAlert = () => {
    Alert.alert(
      "Are You Sure!",
      "This action will permanently delete your note!",
      [
        {
          text: "Delete",
          onPress: deleteNote,
        },
        {
          text: "No Thanks",
          onPress: () => console.log("no thanks"),
        },
      ],
      {
        cancelable: true,
      }
    );
  };

  const handleUpdate = async (title, desc, time) => {
    const result = await AsyncStorage.getItem("notes");
    let notes = [];
    if (result !== null) notes = JSON.parse(result);

    const newNotes = notes.filter(n => {
      if (n.id === note.id) {
        n.title = title;
        n.desc = desc;
        n.time = time;
        n.isUpdated = true;

        setNote(n);
      }
      return n;
    });
    setNotes(newNotes);
    await AsyncStorage.setItem("notes ", JSON.stringify(newNotes));
  };
  const handleOnClose = () => setShowModal(false);
  const openEditModal = () => {
    setIsEdit(true);
    setShowModal(true);
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingTop: headerHeight },
        ]}>
        <Text style={styles.time}>
          {note.isUpdated
            ? `Updated At ${formatDate(note.time)}`
            : `Created At ${formatDate(note.time)}`}
        </Text>
        <Text style={styles.title}>{note.title}</Text>
        <Text style={styles.desc}>{note.desc}</Text>
      </ScrollView>
      <View style={styles.btnContainer}>
        <RoundIconBtn
          antIconName="edit"
          style={{ backgroundColor: colors.PRIMARY4, marginBottom: 10 }}
          onPress={openEditModal}
        />

        <RoundIconBtn
          antIconName="delete"
          style={{ backgroundColor: colors.ERROR }}
          onPress={displayDeleteAlert}
        />
      </View>
      <NoteInputModal
        isEdit={isEdit}
        note={note}
        onClose={handleOnClose}
        onSubmit={handleUpdate}
        visible={showModal}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 35,
    color: colors.PRIMARY5,
    fontWeight: "bold",
  },
  desc: {
    fontSize: 25,
    color: colors.PRIMARY3,
    opacity: 0.7,
  },
  time: {
    textAlign: "right",
    fontSize: 13,
    opacity: 0.6,
    color: colors.PRIMARY3,
  },
  btnContainer: {
    position: "absolute",
    right: 15,
    bottom: 50,
    padding: 15,
  },
});

export default NoteDetail;
