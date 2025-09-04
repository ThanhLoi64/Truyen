import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { Colors } from '../../constants';
import { connect } from "react-redux";
import { logout } from "../../redux/actions/login";

class ProfileScreen extends Component {
  handleButtonLoginPress = () => {
    this.props.navigation.navigate('LoginScreen');
  };
  handleButtonChangePass = () => {
    this.props.navigation.navigate('ProfileChangePass');
  };
  render() {
    const { user, isLoggedIn } = this.props
    return (

      <View style={styles.container} className=" w-full ">
        {isLoggedIn &&
          <SafeAreaView className=" flex-1    w-full ">
            <View className=" items-center flex-row p-4 border-b border-solid border-[#a1a1a15b]">
              <Image source={require('./icon.png')} className="w-[70px] h-[70px] rounded-full" />

              <View

                className="flex-1 ml-4"
              >
                <Text style={styles.loginText}>{user && user.userName}</Text>
              </View>
              <TouchableOpacity
                onPress={() => this.props.logout()}
                style={styles.loginButtonLogout}

              >
                <Text className="text-white font-bold text-sm " >Đăng xuất</Text>
              </TouchableOpacity >

            </View>
            <View className="flex-row justify-around mt-4 p-2">
              <TouchableOpacity
                style={{ backgroundColor: 'rgb(226, 198, 150)', padding: 10, borderRadius: 10 }}
                onPress={() => this.props.navigation.navigate('ProfileChangePass')}
              >
                <Text className="text-white font-bold"> Thay đổi mật khẩu</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ backgroundColor: 'rgb(226, 198, 150)', padding: 10, borderRadius: 10 }}
                onPress={() => this.props.navigation.navigate('ProfileChangeName')}
              >
                <Text className="text-white font-bold"> Thay đổi thông tin</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>


        }
        {!isLoggedIn &&
          <SafeAreaView className="flex-1    w-full   ">
            <View className="items-center flex-row p-4 border-b border-solid border-[#a1a1a15b]">
              <Image source={require('./icon.png')} className="w-[70px] h-[70px] rounded-full" />

              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('LoginScreen')}
                style={styles.loginButton}
              >
                <Text style={styles.loginText}>Đăng nhập</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        }

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'start',
    alignItems: 'start',

    backgroundColor: '#fff',
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,

  },
  loginButtonLogout: {
    backgroundColor: 'rgb(226, 198, 150)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,

  },
  loginText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

const mapStateToProps = (state) => ({
  isLoggedIn: state.login.isLoggedIn,
  user: state.login.user,
});
const mapDispatchToProps = {
  logout
}


export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);