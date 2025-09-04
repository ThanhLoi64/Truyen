import React from 'react'
import { showMessage } from "react-native-flash-message";
const customMessageStyle = {
    alignItems: 'center',
};
export const showMessagesucces = (message) => {
    showMessage({
        message,
        type: "success",
        duration: 3000,
        icon: "success",
        hideStatusBar: true,
        floating: true,
        style: customMessageStyle,
    });

}
export const showMessageError = (message) => {
    showMessage({
        message,
        type: "danger",
        duration: 3000,
        icon: "danger",
        hideStatusBar: true,
        floating: true,
        style: customMessageStyle,
    });
};
export const showMessageWarning = (message) => {
    showMessage({
        message,
        type: "warning",
        duration: 3000,
        icon: "warning",
        hideStatusBar: true,
        floating: true,
        style: customMessageStyle,
    });
};
