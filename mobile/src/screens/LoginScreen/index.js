import React, { Component } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  KeyboardAvoidingView
} from "react-native";
import { login, setIsLoggedIn } from "../../redux/actions/login";
import { connect } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showMessage } from "react-native-flash-message";
import styles from "./styles";
class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  get initialState() {
    return {
      email: "",
      password: "",
      loading: false,
      rememberMe: true,
    };
  }

  componentDidMount = async () => {
    let userEmail = await AsyncStorage.getItem("rememberEmail");
    let userPass = await AsyncStorage.getItem("rememberPass");
    if (userEmail !== null) {
      this.setState({ email: userEmail });
    }
    if (userPass !== null) {
      this.setState({ password: '' });
    }
  };

  setUserValue = (text) => {
    this.setState({ email: text });
  };

  setPassValue = (text) => {
    this.setState({ password: text });
  };

  handleButtonRegisterPress = async () => {
    this.props.navigation.navigate("RegisterScreen");
  };

  handleButtonPress = async () => {
    const { email, password } = this.state;
    await this.onLogin();
  };

  handleLoginSuccess = () => {
    this.props.navigation.navigate("HomeScreen");
  };

  onLogin = async () => {
    const isConnected = true;
    const customMessageStyle = {
      alignItems: 'center',
    };
    if (!isConnected) {
      showMessage({
        message: "Kiểm tra lại kết nối internet",
        type: "danger",
        duration: 3000,
        icon: "danger",
        style: customMessageStyle,
      });
      return;
    }
    const { email, password, rememberMe } = this.state;
    let emailErr = "";
    let passErr = "";
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,10})+$/;
    let isValid = true;

    if (!email || !password) {
      showMessage({
        message: "Vui lòng điền đầy đủ thông tin.",
        type: "danger",
        duration: 3000,
        icon: "danger",
        hideStatusBar: true,
        floating: true,
        style: customMessageStyle,
      });
      return;
    }

    let passwordReg = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;

    if (!passwordReg.test(password)) {
      passErr = "Mật khẩu trên 6 ký tự, in hoa, chữ số và ký tự";
      isValid = false;
    }

    if (!isValid) {
      showMessage({
        message: `${emailErr ? emailErr : ""} ${passErr ? passErr : ""}`,
        type: "danger",
        duration: 4000,
        icon: "danger",
        hideStatusBar: true,
        floating: true,
        style: customMessageStyle,
      });
      return;
    }

    this.setState({ loading: true });
    let data = {
      userName: email,
      password: password,
    };

    this.props.login(data)
      .then((res) => {
        this.setState({ loading: false });
        if (res.accessToken) {
          if (rememberMe) {
            AsyncStorage.setItem("rememberEmail", email);
            AsyncStorage.setItem("rememberPass", password);
          } else {
            AsyncStorage.removeItem("rememberEmail");
            AsyncStorage.removeItem("rememberPass");
          }
          // this.props.setIsLoggedIn(true);
          this.props.navigation.navigate("Home");
          showMessage({
            message: "Đăng nhập thành công",
            type: "success",
            duration: 3000,
            style: customMessageStyle,
            hideStatusBar: true,
            floating: true,
            icon: "success",
          });
        } else if (res.meta && res.meta.status === false) {
          showMessage({
            message: "Đăng nhập thất bại",
            type: "danger",
            duration: 3000,
            style: customMessageStyle,
            hideStatusBar: true,
            floating: true,
            icon: "danger",
          });
        }
      })
      .catch((err) => {
        showMessage({
          message: "Tên đăng nhập hoặc mật khẩu không hợp lệ",
          type: "danger",
          duration: 5000,
          style: customMessageStyle,
          hideStatusBar: true,
          floating: true,
          icon: "danger",
        });
        console.log(err);
        this.setState({ loading: false });
      });

  };
  dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  render() {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.select({ ios: 0 })}
      >
        <TouchableWithoutFeedback onPress={this.dismissKeyboard}>
          <View style={styles.container} className="w-[100%]">
            <View style={styles.wrapper}>
              <SafeAreaView style={styles.formContainer}>
                <Text style={styles.headerText}>Đăng nhập </Text>
                <TextInput
                  placeholder="Tên đăng nhập"
                  placeholderTextColor="#7A7B7B"
                  style={styles.input}
                  value={this.state.email}
                  onChangeText={this.setUserValue}
                />
                <TextInput
                  placeholder="Mật khẩu"
                  placeholderTextColor="#7A7B7B"
                  style={styles.input}
                  secureTextEntry={true}
                  onChangeText={this.setPassValue}
                />
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    onPress={this.handleButtonPress}
                    style={styles.loginButton}
                  >
                    <Text style={styles.loginButtonText}>Đăng nhập</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.row}>
                  <Text>Bạn chưa có tài khoản? </Text>
                  <TouchableOpacity onPress={this.handleButtonRegisterPress}>
                    <Text style={styles.link}>Đăng ký ngay</Text>
                  </TouchableOpacity>
                </View>
              </SafeAreaView>

            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

    );
  }
}

const mapDispatchToProps = {
  login,
  setIsLoggedIn,
};

export default connect(null, mapDispatchToProps)(LoginScreen);
