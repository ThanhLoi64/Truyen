import React, { Component } from "react";
import {
  Text,
  View,
  SafeAreaView,
  Platform,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import { showMessage } from "react-native-flash-message";
import { connect } from "react-redux";
import { register } from "../../redux/actions/register";
import styles from "./styles";

class RegisterScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
      retypePassword: "",
    };
  }

  setUserValue = (text) => {
    this.setState({ username: text });
  };

  setEmailValue = (text) => {
    this.setState({ email: text });
  };

  setPassValue = (text) => {
    this.setState({ password: text });
  };

  setRetypePassValue = (text) => {
    this.setState({ retypePassword: text });
  };

  handleButtonPress = () => {
    const { username, email, password, retypePassword } = this.state;

    const customMessageStyle = {
      alignItems: 'center',
    };

    if (!username || !email || !password || !retypePassword) {
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

    if (password !== retypePassword) {
      showMessage({
        message: "Nhập lại mật khẩu không khớp nhau.",
        type: "danger",
        duration: 3000,
        icon: "danger",
        hideStatusBar: true,
        floating: true,
        style: customMessageStyle,
      });
      return;
    }

    let emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,10})+$/;
    if (!emailReg.test(email)) {
      showMessage({
        message: "Email không hợp lệ.",
        type: "danger",
        duration: 3000,
        icon: "danger",
        hideStatusBar: true,
        floating: true,
        style: customMessageStyle,
      });
      return;
    }

    let passwordReg = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;
    if (!passwordReg.test(password)) {
      showMessage({
        message: "Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa và ký tự đặc biệt.",
        type: "danger",
        duration: 3000,
        icon: "danger",
        hideStatusBar: true,
        floating: true,
        style: customMessageStyle,
      });
      return;
    }
    let Userdata = {
      username: username,
      email: email,
      password: password,
      retypePassword: retypePassword
    };
    this.props.register(Userdata)
      .then(() => {
        showMessage({
          message: "Đăng ký thành công!",
          type: "success",
          duration: 3000,
          icon: "success",
          hideStatusBar: true,
          floating: true,
          style: customMessageStyle,
        });
        this.props.navigation.navigate("LoginScreen");
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          const { Code, Message } = error.response.data;
          if (Code === "DuplicateUserName") {
            showMessage({
              message: "Tên đăng nhập đã tồn tại",
              type: "danger",
              duration: 3000,
              icon: "danger",
              hideStatusBar: true,
              floating: true,
              style: customMessageStyle,
            });
          } else if (Message === "EmailAlreadyInUse") {
            showMessage({
              message: "Email đã được sử dụng",
              type: "danger",
              duration: 3000,
              icon: "danger",
              hideStatusBar: true,
              floating: true,
              style: customMessageStyle,
            });
          } else {
            showMessage({
              message: `Đăng ký thất bại. ${Message || "Vui lòng thử lại sau."}`,
              type: "danger",
              duration: 3000,
              icon: "danger",
              hideStatusBar: true,
              floating: true,
              style: customMessageStyle,
            });
          }
        } else {
          showMessage({
            message: "Đăng ký thất bại. Vui lòng thử lại sau.",
            type: "danger",
            duration: 3000,
            icon: "danger",
            hideStatusBar: true,
            floating: true,
            style: customMessageStyle,
          });
        }
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
                <Text style={styles.headerText}>Đăng ký</Text>
                <TextInput
                  placeholder="Tên đăng nhập"
                  placeholderTextColor="#7A7B7B"
                  style={styles.input}
                  onChangeText={this.setUserValue}
                />
                <TextInput
                  placeholder="Email"
                  placeholderTextColor="#7A7B7B"
                  style={styles.input}
                  textContentType="email"
                  onChangeText={this.setEmailValue}
                />
                <TextInput
                  placeholder="Mật khẩu"
                  placeholderTextColor="#7A7B7B"
                  style={styles.input}
                  secureTextEntry={true}
                  onChangeText={this.setPassValue}
                />
                <TextInput
                  placeholder="Nhập lại mật khẩu"
                  placeholderTextColor="#7A7B7B"
                  style={styles.input}
                  secureTextEntry={true}
                  onChangeText={this.setRetypePassValue}
                />
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    onPress={this.handleButtonPress}
                    style={styles.registerButton}
                  >
                    <Text style={styles.registerButtonText}>Đăng ký</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.row}>
                  <Text>Bạn đã có tài khoản? </Text>
                  <TouchableOpacity onPress={() => this.props.navigation.navigate("LoginScreen")}>
                    <Text style={styles.link}>Đăng nhập</Text>
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
  register,
};

export default connect(null, mapDispatchToProps)(RegisterScreen);
