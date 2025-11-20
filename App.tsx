import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export type SessionType = {
  id: string;
  sessionNumber: number;              // Adicionado!
  title: string;
  content: string;
  progress: number;
  notes: string;
  date: string;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
