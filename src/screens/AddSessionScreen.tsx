import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList, CompetencyType, SessionType } from "../App";
import HeaderBar from "../components/HeaderBar";

type AddSessionParams = {
  competency: CompetencyType;
  updateCompetencies: (list: CompetencyType[]) => void;
  session?: SessionType;
};

type Props = {
  navigation: StackNavigationProp<RootStackParamList, "AddSession">;
  route: RouteProp<RootStackParamList, "AddSession">;
};

export default function AddSessionScreen({ route, navigation }: Props) {
  const { competency, updateCompetencies, session } = route.params as AddSessionParams;
  const [sessionNumber, setSessionNumber] = useState(
    session ? String(session.sessionNumber) : String(competency.sessions.length + 1)
  );
  const [title, setTitle] = useState(session ? session.title : "");
  const [content, setContent] = useState(session ? session.content : "");
  const [progress, setProgress] = useState(session ? String(session.progress) : "");
  const [notes, setNotes] = useState(session ? session.notes : "");

  useEffect(() => {
    if (session) {
      setSessionNumber(String(session.sessionNumber));
      setTitle(session.title);
      setContent(session.content);
      setProgress(String(session.progress));
      setNotes(session.notes);
    } else {
      setSessionNumber(String(competency.sessions.length + 1));
    }
  }, [session, competency.sessions.length]);

  const saveSession = async () => {
    if (!title || !content || !progress || !sessionNumber) return;
    const newSession: SessionType = {
      id: session?.id || Date.now().toString(),
      sessionNumber: parseInt(sessionNumber, 10),
      title,
      content,
      progress: parseInt(progress, 10),
      notes,
      date: session?.date || new Date().toLocaleDateString("pt-BR"),
    };
    let updatedSessions;
    if (session) {
      updatedSessions = competency.sessions.map(s => s.id === session.id ? newSession : s);
    } else {
      updatedSessions = [...competency.sessions, newSession];
    }
    const updatedCompetency: CompetencyType = { ...competency, sessions: updatedSessions };
    const competenciesData = await AsyncStorage.getItem("competencies");
    let competencies: CompetencyType[] = JSON.parse(competenciesData || "[]");
    competencies = competencies.map(c => (c.id === competency.id ? updatedCompetency : c));
    await AsyncStorage.setItem("competencies", JSON.stringify(competencies));
    updateCompetencies(competencies);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <HeaderBar onBack={() => navigation.goBack()} />
      <Text style={styles.title}>
        {session ? "Editar sessao de estudo" : "Nova sessao de estudo"}
      </Text>
      <TextInput
        placeholder="Numero da sessao"
        value={sessionNumber}
        onChangeText={setSessionNumber}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Titulo da sessao"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Conteudo estudado"
        value={content}
        onChangeText={setContent}
        style={styles.input}
      />
      <TextInput
        placeholder="Progresso atual (%)"
        value={progress}
        onChangeText={setProgress}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Observacoes/Dificuldades"
        value={notes}
        onChangeText={setNotes}
        style={styles.input}
      />
      <TouchableOpacity
        style={styles.btnSaveOutline}
        onPress={saveSession}
        activeOpacity={0.85}
      >
        <Text style={styles.btnSaveOutlineText}>
          {session ? "Salvar alteracoes" : "Salvar sessao"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#B2F2E9" },
  title: { fontWeight: "bold", fontSize: 20, marginBottom: 16, color: "#00796B" },
  input: {
    borderBottomWidth: 1,
    marginBottom: 10,
    backgroundColor: "#FFF",
    borderRadius: 6,
    padding: 10,
    borderColor: "#86d1c7"
  },
  btnSaveOutline: {
    borderColor: "#009688",
    borderWidth: 2,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  btnSaveOutlineText: {
    color: "#009688",
    fontWeight: "bold",
    fontSize: 16
  }
});
