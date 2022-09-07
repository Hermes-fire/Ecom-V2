import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import { useState } from "react";
import axios from "axios";

function Signup() {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const signup = () => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/api/v1/register`, user)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  /* const googleAuth = () => {
    window.open(
      `${process.env.REACT_APP_API_URL}/auth/google/callback`,
      "_self"
    );
  }; */

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Sign up Form</h1>
      <div className={styles.form_container}>
        <div className={styles.left}>
          <img className={styles.img} src="./images/signup.jpg" alt="signup" />
        </div>
        <div className={styles.right}>
          <h2 className={styles.from_heading}>Create Account</h2>
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
            placeholder="Email"
            name="email"
            value={user.email}
            onChange={handleChange}
          />
          <input
            type="password"
            className={styles.input}
            placeholder="Password"
            name="password"
            value={user.password}
            onChange={handleChange}
          />
          <button className={styles.btn} onClick={signup}>
            Sign Up
          </button>
          <p className={styles.text}>or</p>
          {/* <button className={styles.google_btn} onClick={googleAuth}>
            <span>Sing up with Google</span>
          </button> */}
          <p className={styles.text}>
            Already Have Account ? <Link to="/login">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
