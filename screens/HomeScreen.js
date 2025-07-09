import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
  useColorScheme,
} from 'react-native';
import quotes from '../data/quotes.json';

export default function HomeScreen() {
  const [quote, setQuote] = useState({ text: '', author: '' });
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const fallAnim = useRef(new Animated.Value(0)).current;
  const colorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');

  useEffect(() => {
    setQuote(getRandomQuote());
  }, []);

  const getRandomQuote = () => {
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  const triggerAnimation = (nextQuote) => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fallAnim, {
          toValue: 30,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setQuote(nextQuote);
      fadeAnim.setValue(0);
      fallAnim.setValue(-20);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(fallAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handlePress = () => {
    triggerAnimation(getRandomQuote());
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const backgroundColor = isDarkMode ? '#121212' : '#F2F2F2';
  const textColor = isDarkMode ? '#FFFFFF' : '#000000';

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={[styles.container, { backgroundColor }]}>
        <Animated.Text
          style={[
            styles.quote,
            {
              color: textColor,
              opacity: fadeAnim,
              transform: [{ translateY: fallAnim }],
            },
          ]}
        >
          {quote.text}
        </Animated.Text>

        <Text style={[styles.author, { color: textColor }]}>
          — {quote.author}
        </Text>

        <Text style={[styles.toggleText, { color: textColor }]} onPress={toggleTheme}>
          Toggle {isDarkMode ? 'Light' : 'Dark'} Mode
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  quote: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  author: {
    fontSize: 16,
    marginTop: 10,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  toggleText: {
    fontSize: 14,
    marginTop: 40,
    textDecorationLine: 'underline',
  },
});
