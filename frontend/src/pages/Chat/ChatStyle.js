import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0E1331",
    padding: 10,
  },
  messageList: {
    flex: 1,
    marginBottom: 10,
  },
  messageContainer: {
    backgroundColor: "#1E2A48",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  messageText: {
    color: "#FFFFFF",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#1E2A48",
  },
  textInput: {
    flex: 1,
    backgroundColor: "#1E2A48",
    color: "#FFFFFF",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#3498db",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
