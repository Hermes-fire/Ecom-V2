import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import { useState } from "react";
import axios from "axios";

function Login() {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const login = () => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/api/v1/login`, user, {
        withCredentials: true,
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  const googleAuth = () => {
    window.open(`${process.env.REACT_APP_API_URL}/api/v1/auth/google`, "_self");
  };
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Log in Form</h1>
      <div className={styles.form_container}>
        <div className={styles.left}>
          <img className={styles.img} src="./images/login.jpg" alt="login" />
        </div>
        <div className={styles.right}>
          <h2 className={styles.from_heading}>Members Log in</h2>
          <input
            type="text"
            className={styles.input}
            placeholder="Username"
            name="username"
            value={user.username}
            onChange={handleChange}
          />
          <input
            type="text"
            className={styles.input}
            placeholder="Password"
            name="password"
            value={user.password}
            onChange={handleChange}
          />
          <button className={styles.btn} onClick={login}>
            Log In
          </button>
          <p className={styles.text}>or</p>
          <button className={styles.google_btn} onClick={googleAuth}>
            <img src="./images/google.png" alt="google icon" />
            <span>Sing in with Google</span>
          </button>
          <p className={styles.text}>
            New Here ? <Link to="/signup">Sing Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
