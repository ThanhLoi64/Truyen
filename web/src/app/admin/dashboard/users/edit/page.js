'use client'
import React, { useState, useEffect } from "react";
import { updateAdminUser } from "@/app/api/user";
import Cookies from "js-cookie";
import { EDIT_SUCCES, EMPTY_FIELD_ERROR } from '../../../../../../errorConstants';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { OutlinedInput, Snackbar, Alert, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";



const EditUserPage = ({ user, onCancel, onSave }) => {
  const userRoles = Cookies.get("roles") ? Cookies.get("roles").split(",") : [];
  const [userData, setUserData] = useState({
    id: user ? user.id : "",
    newPassword: "",
    firstName: user ? user.firstName : "",
    lastName: user ? user.lastName : "",
    dateOfBirth: user ? user.dateOfBirth : "",
    roles: user ? (user.roles || []) : [],
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");
  const rolesOptions = [
    { value: "admin", label: "Admin" },
    { value: "customer", label: "Customer" },
    { value: "staff", label: "Staff" },
    { value: "guest", label: "Guest" },
    { value: "user", label: "User" },
  ];
  const formatDateForAPI = (date) => {
    if (!date) return "";
    const isoDate = new Date(date).toISOString();
    return isoDate;
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  useEffect(() => {
    if (user) {
      setUserData({
        id: user.id || "",
        newPassword: "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        dateOfBirth: formatDateForAPI(user.dateOfBirth) || "",
        roles: user.roles || [],
      });
    }
  }, [user]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idFromUrl = params.get('id');

    if (idFromUrl) {
      setUserData((prevUser) => ({
        ...prevUser,
        id: idFromUrl,
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevUser) => {
      return {
        ...prevUser,
        [name]: value,
      };
    });
  };

  const handleRolesChange = (event) => {
    const {
      target: { value },
    } = event;
    setUserData((prevUser) => ({
      ...prevUser,
      roles: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { id, ...userDataWithoutId } = userData;
      if (!userData.firstName || !userData.lastName || !userData.dateOfBirth || !userData.roles) {
        setSnackbarSeverity("error");
        setSnackbarMessage(EMPTY_FIELD_ERROR);
        setOpenSnackbar(true);
        return;
      }
      userDataWithoutId.dateOfBirth = formatDateForAPI(userDataWithoutId.dateOfBirth);
      await updateAdminUser(id, userDataWithoutId);
      setSnackbarSeverity("success");
      setSnackbarMessage(EDIT_SUCCES);
      setOpenSnackbar(true);
      setErrors([]);
    } catch (error) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Lỗi cập nhật người dùng: " + error.message);
      setOpenSnackbar(true);
      setErrors(["Lỗi cập nhật người dùng: " + error.message]);
      setSuccessMessage("");
    }
  };

  return (
    <div className="py-3">
      <h2 className="text-center mb-1 mt-2 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
        Chỉnh sửa người dùng
      </h2>

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="grid gap-6 mb-6 md:grid-cols-2">

          <TextField
            label="Họ"
            value={userData.firstName}
            name="firstName"
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Tên"
            value={userData.lastName}
            name="lastName"
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Mật khẩu mới"
            type={showPassword ? "text" : "password"}
            value={userData.newPassword}
            name="newPassword"
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Ngày Sinh"
            type="date"
            value={userData.dateOfBirth}
            name="dateOfBirth"
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="roles-label">Roles</InputLabel>
            <Select
              labelId="roles-label"
              multiple
              value={userData.roles}
              onChange={handleRolesChange}
              renderValue={(selected) => selected.join(', ')}
              input={<OutlinedInput label="Roles" />}
            >
              {rolesOptions.map((role) => (
                <MenuItem key={role.value} value={role.value}>
                  <Checkbox checked={userData.roles.indexOf(role.value) > -1} />
                  <ListItemText primary={role.label} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <Button
          type="submit"
          variant="contained"
          className="text-center bg-[var(--button)] "
          sx={{ mt: 2 }}
        >
          Sửa người dùng
        </Button>
      </form>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          variant="filled"
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default EditUserPage;
