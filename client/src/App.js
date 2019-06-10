import React from "react";
import { Router } from "@reach/router";
import NavBar from "./NavBar";
import MovieList from "./MovieList";
import MovieDetails from "./MovieDetails";
import CinemaList from "./CinemaList";
import CinemaDetails from "./CinemaDetails";
import Admin from "./Admin";
import NotFound from "./NotFound";
import "./App.css";

function App() {
	return (
		<div className="mvls-app">
			<header className="mvls-header">
				<NavBar />
			</header>
			<main className="mvls-main">
				<Router>
					<MovieList path="/" />
					<MovieDetails path="/movie/:movieId" />
					<CinemaList path="/cinemas" />
					<CinemaDetails path="/cinema/:cinemaId" />
                    <Admin path="/admin" />
                    <NotFound default />
				</Router>
			</main>
		</div>
	);
}

export default App;
