import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

// Replace with your actual API URL
const API_URL = "http://10.0.2.2:8000/chat";

export default function ChatbotScreen() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Add an initial message when the component mounts
    setMessages([
      {
        id: Date.now(),
        text: "Hello! How can I assist you today?",
        sender: "ai",
      },
    ]);
  }, []);

  const sendMessage = async () => {
    if (inputText.trim() === "") return;

    const newMessage = { id: Date.now(), text: inputText, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    console.log("Sending message:", inputText);
    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_input: inputText }),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json(); 
      console.log("Received data:", data);

      const aiResponse = {
        id: Date.now() + 1,
        text: data.response,
        sender: "ai",
      };
      setMessages((prevMessages) => [...prevMessages, aiResponse]);
    } catch (error) {
      console.error("Error details:", error);
      Alert.alert(
        "Error",
        "Unable to connect to the chatbot. Please check your internet connection and try again."
      );
      const errorResponse = {
        id: Date.now() + 1,
        text: "Sorry, I couldn't process your request. Please try again.",
        sender: "ai",
      };
      setMessages((prevMessages) => [...prevMessages, errorResponse]);
    } finally {
      setIsLoading(false);
      setInputText("");
    }
  };

  const renderMessage = ({ item }) => (
    <ThemedView
      style={[
        styles.messageBubble,
        item.sender === "user" ? styles.userMessage : styles.aiMessage,
      ]}
    >
      <ThemedText>{item.text}</ThemedText>
    </ThemedView>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.messageList}
      />
      <ThemedView style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          placeholderTextColor="#999"
          editable={!isLoading}
        />
        <TouchableOpacity
          style={[styles.sendButton, isLoading && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={isLoading}
        >
          <ThemedText style={styles.sendButtonText}>
            {isLoading ? "Sending..." : "Send"}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageList: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  messageBubble: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: "80%",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C6",
  },
  aiMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#E5E5EA",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  sendButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#007AFF",
    borderRadius: 20,
    paddingHorizontal: 15,
  },
  sendButtonDisabled: {
    backgroundColor: "#999",
  },
  sendButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
