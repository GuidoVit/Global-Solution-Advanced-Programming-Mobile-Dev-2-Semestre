import React, { useState, useCallback, useEffect } from "react";
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList, CompetencyType } from "../App";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  navigation: StackNavigationProp<RootStackParamList, "Competencies">;
};

export default function CompetenciesScreen({ navigation }: Props) {
  const [competencies, setCompetencies] = useState<CompetencyType[]>([]);
  const [newCompetency, setNewCompetency] = useState("");

  const loadData = async () => {
    const data = await AsyncStorage.getItem("competencies");
    if (data) setCompetencies(JSON.parse(data));
  };

  useEffect(() => { loadData(); }, []);
  useFocusEffect(useCallback(() => { loadData(); }, []));

  const addCompetency = async () => {
    if (!newCompetency) return;
    const updated = [
      ...competencies,
      { id: Date.now().toString(), name: newCompetency, sessions: [] },
    ];
    setCompetencies(updated);
    await AsyncStorage.setItem("competencies", JSON.stringify(updated));
    setNewCompetency("");
  };

  const goToDetail = (item: CompetencyType) => {
    navigation.navigate("CompetencyDetail", {
      competency: item,
      updateCompetencies,
    });
  };

  const updateCompetencies = async (updatedCompetencies: CompetencyType[]) => {
    setCompetencies(updatedCompetencies);
    await AsyncStorage.setItem("competencies", JSON.stringify(updatedCompetencies));
  };

  const deleteCompetency = async (competencyId: string) => {
    const runDelete = () => {
      const updated = competencies.filter((c) => c.id !== competencyId);
      setCompetencies(updated);
      AsyncStorage.setItem("competencies", JSON.stringify(updated));
    };

    if (typeof window !== "undefined" && window.confirm) {
      if (window.confirm("Tem certeza que deseja excluir esta competencia?")) {
        runDelete();
      }
    } else {
      // @ts-ignore
      import("react-native").then(RN => {
        RN.Alert.alert(
          "Excluir competencia",
          "Tem certeza que deseja excluir esta competencia?",
          [
            { text: "Cancelar", style: "cancel" },
            { text: "Excluir", style: "destructive", onPress: runDelete },
          ]
        );
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas Competencias</Text>
      <FlatList
        data={competencies}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <TouchableOpacity
              style={styles.compBtn}
              onPress={() => goToDetail(item)}
            >
              <Text style={styles.compBtnText}>{item.name}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteIcon}
              onPress={() => deleteCompetency(item.id)}
            >
              <Ionicons name="trash" size={20} color="#009688" />
            </TouchableOpacity>
          </View>
        )}
      />
      <TextInput
        style={styles.input}
        placeholder="Nova competencia"
        value={newCompetency}
        onChangeText={setNewCompetency}
      />
      <TouchableOpacity
        style={styles.btnAddOutline}
        onPress={addCompetency}
        activeOpacity={0.85}
      >
        <Text style={styles.btnAddOutlineText}>
          ADICIONAR COMPETENCIA
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#B2F2E9" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 14, color: "#00796B" },
  cardWrapper: {
    marginBottom: 10,
    position: "relative",
  },
  compBtn: {
    backgroundColor: "#99DFD6",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    elevation: 1,
  },
  compBtnText: { color: "#00796B", fontWeight: "bold", fontSize: 18 },
  deleteIcon: {
    position: "absolute",
    top: 12,
    right: 12,
    padding: 4,
  },
  input: { borderWidth: 1, borderColor: "#86d1c7", borderRadius: 5, padding: 12, marginVertical: 10, backgroundColor: "#fff" },
  btnAddOutline: {
    borderColor: "#009688",
    borderWidth: 2,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  btnAddOutlineText: {
    color: "#009688",
    fontWeight: "bold",
    fontSize: 16
  },
});
