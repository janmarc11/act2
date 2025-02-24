import React, { useState } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  useWindowDimensions, 
  StyleSheet, 
  Pressable, 
  Animated 
} from "react-native";
import RenderHTML from "react-native-render-html";
import { useNavigation } from "@react-navigation/native";

export default function Exercise() {
  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const exercises = [
    { title: 'Exercise 3', description: 
      `<p>Create a login screen and add a title and description to the card.</p>
      <p>When the card is clicked, it should redirect to the login screen.</p>
      <ul>
        <li>Email</li>
        <li>Password (Text Input)</li>
        <li>Login (Button)</li>
      </ul>` 
    },
    { title: 'Exercise 4', description: 'Create a stopwatch with two buttons.' },
    { title: 'Exercise 5', description: 
      `<p>Create a register screen and add a title and description to the card.</p>
        <p>When the card is clicked, it should redirect to the register screen.</p>
           <ul>
             <li>Image (Image picker when image selected should display the image selected)</li>
               <li>Name (Text Input)</li>
             <li>Email (Text Input)</li>
           <li>Password (Text Input)</li>
        <li>Register (Button)</li>
      </ul>`
    },
    { title: 'Exercise 6', description: 'Create a simple CRUD using useContext and useReducer' },
    { title: 'Exercise 7', description: '...' },
    { title: 'Exercise 8', description: '...' },
    { title: 'Exercise 9', description: '...' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {exercises.map((exercise, index) => {
        const scrollY = new Animated.Value(0);
        return (
          <Pressable 
            key={index} 
            style={[
              styles.card, 
              hoveredIndex === index && styles.hoveredCard 
            ]}
            onPress={() => {
              if (exercise.title === "Exercise 3") {
                navigation.navigate("login"); 
              } else if (exercise.title === "Exercise 4") {
                navigation.navigate("stopwatch"); // ✅ Mag-navigate sa Stopwatch
              }
            }}
            onMouseEnter={() => setHoveredIndex(index)} 
            onMouseLeave={() => setHoveredIndex(null)} 
          >
            <Text style={styles.title}>{exercise.title}</Text>
            {hoveredIndex === index && (
              <View style={styles.descriptionWrapper}>
                <Animated.ScrollView 
                  style={styles.descriptionContainer} 
                  showsVerticalScrollIndicator={false} 
                  onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                  )}
                >
                  <RenderHTML contentWidth={width - 32} source={{ html: exercise.description }} />
                </Animated.ScrollView>
                <Animated.View style={[styles.customScrollbar, { opacity: scrollY.interpolate({
                  inputRange: [0, 50],
                  outputRange: [0, 1]
                }) }]} />
              </View>
            )}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "black",
    flexGrow: 1, 
  },
  card: {
    backgroundColor: "#ff8a00",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  hoveredCard: {
    backgroundColor: "darkorange", 
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  descriptionWrapper: {
    position: "relative",
    maxHeight: 150,
  },
  descriptionContainer: {
    maxHeight: 150,
    paddingRight: 10,
  },
  customScrollbar: {
    position: "absolute",
    right: 4,
    width: 4,
    height: "50%",
    backgroundColor: "#d47f00", 
    borderRadius: 2,
  },
});
