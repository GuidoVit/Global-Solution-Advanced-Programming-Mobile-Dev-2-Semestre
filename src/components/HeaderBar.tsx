import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  onBack: () => void;
};

export default function HeaderBar({ onBack }: Props) {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.back} onPress={onBack}>
        <Ionicons name="chevron-back" size={24} color="#009688" />
        <Text style={styles.backText}>VOLTAR</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  back: { flexDirection: "row", alignItems: "center" },
  backText: { color: "#009688", fontWeight: "bold", fontSize: 20, marginLeft: 2 },
});
