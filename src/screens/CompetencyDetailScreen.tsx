import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp, useFocusEffect } from "@react-navigation/native";
import { RootStackParamList, CompetencyType, SessionType } from "../App";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import HeaderBar from "../components/HeaderBar";

type Props = {
  navigation: StackNavigationProp<RootStackParamList, "CompetencyDetail">;
  route: RouteProp<RootStackParamList, "CompetencyDetail">;
};

function getProgressColor(value: number) {
  if (value <= 30) return "#c80000";
  if (value <= 70) return "#e2c400";
  return "#00796B";
}

export default function CompetencyDetailScreen({ route, navigation }: Props) {
  const { competency, updateCompetencies } = route.params;
  const [competencyData, setCompetencyData] = useState<CompetencyType>(competency);

  useFocusEffect(
    useCallback(() => {
      const fetchCompetency = async () => {
        const competenciesData = await AsyncStorage.getItem("competencies");
        let competencies: CompetencyType[] = JSON.parse(competenciesData || "[]");
        const found = competencies.find(c => c.id === competency.id);
        if (found) setCompetencyData(found);
      };
      fetchCompetency();
    }, [competency.id])
  );

  const addSession = () => {
    navigation.navigate("AddSession", {
      competency: competencyData,
      updateCompetencies,
    });
  };

  const editSession = (session: SessionType) => {
    navigation.navigate("AddSession", {
      competency: competencyData,
      updateCompetencies,
      session,
    });
  };

  const deleteSession = (sessionId: string) => {
    const runDelete = async () => {
      const updatedSessions = competencyData.sessions.filter(s => s.id !== sessionId);
      const updatedCompetency: CompetencyType = {
        ...competencyData,
        sessions: updatedSessions,
      };
      const competenciesData = await AsyncStorage.getItem("competencies");
      let competencies: CompetencyType[] = JSON.parse(competenciesData || "[]");
      competencies = competencies.map((c) =>
        c.id === competencyData.id ? updatedCompetency : c
      );
      await AsyncStorage.setItem("competencies", JSON.stringify(competencies));
      updateCompetencies(competencies);
      setCompetencyData(updatedCompetency);
    };

    if (typeof window !== "undefined" && window.confirm) {
      if (window.confirm("Tem certeza que deseja excluir esta sessao?")) {
        runDelete();
      }
    } else {
      // @ts-ignore
      import("react-native").then(RN => {
        RN.Alert.alert(
          "Excluir sessao",
          "Tem certeza que deseja excluir esta sessao?",
          [
            { text: "Cancelar", style: "cancel" },
            { text: "Excluir", style: "destructive", onPress: runDelete },
          ]
        );
      });
    }
  };

  const changeProgress = async (sessionId: string, delta: number) => {
    const updatedSessions = competencyData.sessions.map((s) => {
      if (s.id === sessionId) {
        let proposed = s.progress + delta;
        if (proposed > 100) proposed = 100;
        if (proposed < 0) proposed = 0;
        return { ...s, progress: proposed };
      }
      return s;
    });
    const updatedCompetency: CompetencyType = { ...competencyData, sessions: updatedSessions };
    const competenciesData = await AsyncStorage.getItem("competencies");
    let competencies: CompetencyType[] = JSON.parse(competenciesData || "[]");
    competencies = competencies.map((c) => (c.id === competencyData.id ? updatedCompetency : c));
    await AsyncStorage.setItem("competencies", JSON.stringify(competencies));
    updateCompetencies(competencies);
    setCompetencyData(updatedCompetency);
  };

  const getSortedSessions = () => {
    return [...competencyData.sessions].sort((a, b) => a.sessionNumber - b.sessionNumber);
  };

  return (
    <View style={styles.container}>
      <HeaderBar onBack={() => navigation.goBack()} />
      <Text style={styles.title}>{competencyData.name}</Text>
      <FlatList
        data={getSortedSessions()}
        keyExtractor={(s) => s.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>
                Sessao {item.sessionNumber} - {item.title}
              </Text>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity onPress={() => editSession(item)}>
                  <Ionicons name="pencil" size={20} color="#009688" style={{ marginHorizontal: 4 }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteSession(item.id)}>
                  <Ionicons name="trash" size={20} color="#c80000" style={{ marginHorizontal: 4 }} />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.cardContent}>{item.content}</Text>
            <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 6 }}>
              <Text>Progresso: </Text>
              <Text style={{
                fontWeight: "bold",
                color: getProgressColor(item.progress),
                fontSize: 16,
                marginRight: 8
              }}>
                {item.progress}%
              </Text>
              <TouchableOpacity onPress={() => changeProgress(item.id, 10)}>
                <Ionicons name="arrow-up" size={22} color="#00796B" style={{ marginRight: 3 }} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => changeProgress(item.id, -10)}>
                <Ionicons name="arrow-down" size={22} color="#c80000" />
              </TouchableOpacity>
            </View>
            <Text>Observacoes: {item.notes}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ textAlign: "center" }}>Nenhuma sessao registrada.</Text>}
      />
      <TouchableOpacity style={styles.btnAddOutline} onPress={addSession} activeOpacity={0.85}>
        <Ionicons name="add" size={24} color="#009688" />
        <Text style={styles.btnAddOutlineText}>Adicionar sessao</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#B2F2E9", paddingBottom: 10 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 15, color: "#00796B", paddingHorizontal: 20 },
  card: { backgroundColor: "#ffffff", borderRadius: 14, marginVertical: 8, padding: 16, shadowColor: "#00796B", shadowOpacity: 0.09, shadowRadius: 6, elevation: 3 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  cardTitle: { fontWeight: "bold", fontSize: 16, color: "#00796B" },
  cardContent: { marginVertical: 6 },
  btnAddOutline: {
    borderColor: "#009688",
    borderWidth: 2,
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    flexDirection: "row",
    marginHorizontal: 20,
  },
  btnAddOutlineText: {
    color: "#009688",
    fontWeight: "bold",
    marginLeft: 8,
    fontSize: 16
  },
});
