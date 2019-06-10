import React from "react";
import { Router } from "@reach/router";
import NavBar from "./NavBar";
import MovieList from "./MovieList";
import "./App.css";

const Cinema = () => <div>Cinema Page</div>;
const Admin = () => <div>Admin Page</div>;

function App() {
	return (
		<div className="mvls-app">
			<header className="mvls-header">
				<NavBar />
			</header>
			<main className="mvls-main">
				<Router>
					<MovieList path="/" />
					<Cinema path="/cinemas" />
					<Admin path="/admin" />
				</Router>
			</main>
		</div>
	);
}

export default App;
