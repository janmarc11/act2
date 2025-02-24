import React, { useState, useRef } from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function StopwatchScreen() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const startStopwatch = () => {
    if (!isRunning) {
      setIsRunning(true);
      startTimeRef.current = performance.now() - time;

      intervalRef.current = setInterval(() => {
        setTime(performance.now() - startTimeRef.current!);
      }, 10);
    }
  };

  const stopStopwatch = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  };

  const resetStopwatch = () => {
    stopStopwatch();
    setTime(0);
  };

  // Convert milliseconds to HH:MM:SS:MS format
  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10); // Get 2-digit milliseconds

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(ms).padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>{formatTime(time)}</Text>
      <View style={styles.buttonContainer}>
        <View style={{ marginHorizontal: 10 }}>
          <Button title="Start" onPress={startStopwatch} color="green" />
        </View>
        <View style={{ marginHorizontal: 10 }}>
          <Button title="Stop" onPress={stopStopwatch} color="red" />
        </View>
        <View style={{ marginHorizontal: 10 }}>
          <Button title="Reset" onPress={resetStopwatch} color="orange" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  timer: {
    fontSize: 40,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
});
