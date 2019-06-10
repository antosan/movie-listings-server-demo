import React from "react";
import NavBar from "./NavBar";
import MovieList from "./MovieList";
import "./App.css";

function App() {
	return (
		<div className="mvls-app">
			<header className="mvls-header">
				<NavBar />
			</header>
			<main className="mvls-main">
				<MovieList />
			</main>
		</div>
	);
}

export default App;
