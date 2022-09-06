import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import "./App.css";

function App() {

	return (
		<div className="container">
			<Routes>
				<Route
					exact
					path="/"
					element={<Login />}
				/>
				<Route
					exact
					path="/bad"
					element={<h1>bad</h1>}
				/>
				<Route
					exact
					path="/good"
					element={<h1>good</h1>}
				/>
			</Routes>
		</div>
	);
}

export default App;
