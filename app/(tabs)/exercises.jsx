import React from "react";
import { View, Text, ScrollView, useWindowDimensions, StyleSheet } from "react-native";
import RenderHTML from "react-native-render-html";

export default function Exercise() {
  const { width } = useWindowDimensions();

  const exercises = [
    { title: 'Exercises 3', description: 'desc' },
    { title: 'Exercises 4', description: 'desc' },
    { title: 'Exercises 5', description: 'desc' },
    { title: 'Exercises 5', description: 'desc' },
    { title: 'Exercises 5', description: '<ul><li>Email (Text Input)</li></ul>' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {exercises.map((exercise, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.title}>{exercise.title}</Text>
          <RenderHTML
            contentWidth={width - 32} // minus padding, kung nais mo ng spacing
            source={{ html: exercise.description }}
          />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    // Opsyonal: shadow/elevation para card effect
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
});
