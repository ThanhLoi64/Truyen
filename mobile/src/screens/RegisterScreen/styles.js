import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingTop:50,
    paddingLeft:20,
    fontSize: 24,
    fontWeight: 'bold',
  },
  head: {
    fontSize: 18,
    paddingLeft:20,
  
  },
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    paddingTop:10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
  },
  input: {
    width: '90%',
    height: 50,
    borderColor: '#DDDDDD',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  buttonContainer: {
    width: '90%',
    marginVertical: 10,
    borderRadius: 8,
  },
  messageContainer: {
    marginVertical: 10,
  },
  messageText: {
    color: '#FF0000',
  },
  errorText: {
    marginTop: 10,
    color: '#FF0000',
  },
  row: {
    flexDirection: 'row',
    marginTop: 20,
  },
  link: {
    fontWeight: 'bold',
    color: "#3471A2",
  },
  registerButton: {
    backgroundColor: 'rgb(226, 198, 150)',
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  textf: {
    fontSize: 20,
    marginRight:20,
  },
  textg: {
    fontSize: 20,
    marginRight:50,
  },
});

export default styles;
