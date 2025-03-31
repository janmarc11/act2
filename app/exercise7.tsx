import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import he from 'he';

type QuestionType = {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
};

const QuizApp = () => {
  const [numQuestions, setNumQuestions] = useState('');
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const fetchQuestions = async () => {
    const amount = Math.max(10, Math.min(parseInt(numQuestions) || 10, 30));
    const url = `https://opentdb.com/api.php?amount=${amount}&type=multiple`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setQuestions(
        data.results.map((q: any) => ({
          question: he.decode(q.question),
          correct_answer: he.decode(q.correct_answer),
          incorrect_answers: q.incorrect_answers.map((ans: string) => he.decode(ans)),
        }))
      );
      setCurrentQuestionIndex(0);
      setScore(0);
      setSelectedAnswer(null);
      setQuizCompleted(false);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleAnswer = (answer: string) => {
    if (answer === questions[currentQuestionIndex].correct_answer) {
      setScore((prevScore) => prevScore + 1);
    }
    setSelectedAnswer(answer);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setSelectedAnswer(null);
    } else {
      setQuizCompleted(true);
    }
  };

  return (
    <View style={styles.container}>
      {!questions.length ? (
        <View style={styles.inputContainer}>
          <Text style={styles.title}>Enter Number of Questions (10-30)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Enter number..."
            placeholderTextColor="#00ffcc"
            value={numQuestions}
            onChangeText={setNumQuestions}
          />
          <View style={styles.buttonContainer}>
            <Button title="Start Quiz" onPress={fetchQuestions} color="#00ffcc" />
          </View>
        </View>
      ) : quizCompleted ? (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Quiz Completed!</Text>
          <Text style={styles.resultScore}>
            Your Score: {score} / {questions.length}
          </Text>
          <View style={styles.buttonContainer}>
            <Button title="Restart Quiz" onPress={() => setQuestions([])} color="#ff007f" />
          </View>
        </View>
      ) : (
        <View style={styles.quizContainer}>
          <Text style={styles.questionText}>{questions[currentQuestionIndex].question}</Text>
          <FlatList
            data={[...questions[currentQuestionIndex].incorrect_answers, questions[currentQuestionIndex].correct_answer].sort(() => Math.random() - 0.5)}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.option, selectedAnswer === item ? styles.selectedOption : null]}
                onPress={() => handleAnswer(item)}
              >
                <Text style={styles.optionText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
          <View style={styles.buttonContainer}>
            <Button title="Next" onPress={nextQuestion} disabled={!selectedAnswer} color="#ff007f" />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30, backgroundColor: '#000' },
  title: { fontSize: 22, color: '#00ffcc', marginBottom: 15, textAlign: 'center', fontWeight: 'bold' },
  inputContainer: { alignItems: 'center', padding: 20, backgroundColor: '#111', borderRadius: 10, width: '90%', borderWidth: 2, borderColor: '#00ffcc' },
  input: { borderBottomWidth: 1, width: '80%', textAlign: 'center', color: '#00ffcc', fontSize: 18, marginBottom: 15, borderBottomColor: '#00ffcc' },
  buttonContainer: { marginTop: 15, width: '80%' },
  quizContainer: { alignItems: 'center', padding: 25, backgroundColor: '#111', borderRadius: 10, width: '90%', borderWidth: 2, borderColor: '#ff007f' },
  questionText: { fontSize: 20, color: '#00ffcc', marginBottom: 20, textAlign: 'center', fontWeight: 'bold' },
  option: { backgroundColor: '#222', padding: 15, marginVertical: 8, borderRadius: 8, width: '100%', alignItems: 'center', borderWidth: 2, borderColor: '#444' },
  selectedOption: { backgroundColor: '#ff007f', borderColor: '#ffcc00' },
  optionText: { color: '#00ffcc', fontSize: 16, fontWeight: 'bold' },
  resultContainer: { alignItems: 'center', padding: 25, backgroundColor: '#111', borderRadius: 10, width: '90%', borderWidth: 2, borderColor: '#00ffcc' },
  resultText: { fontSize: 24, color: '#ffcc00', fontWeight: 'bold', marginBottom: 10 },
  resultScore: { fontSize: 20, color: '#ff007f', marginVertical: 10, fontWeight: 'bold' },
});

export default QuizApp;
