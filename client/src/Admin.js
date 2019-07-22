import React from "react";
import axios from "axios";
import CinemaAdmin from "./CinemaAdmin";
import MovieAdmin from "./MovieAdmin";

class Admin extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			cinemas: [],
			cinemasLoading: false,
			cinemasError: false,
			movies: [],
			moviesLoading: false,
			moviesError: false
		};

		this.updateCinemas = this.updateCinemas.bind(this);
		this.updateMovies = this.updateMovies.bind(this);
	}

	componentDidMount() {
		this.fetchCinemas();
		this.fetchMovies();
	}

	fetchCinemas() {
		this.setState({ cinemasLoading: true, cinemasError: false });

		axios
			.get("/api/cinemas")
			.then(response => {
				this.setState({
					cinemas: response.data,
					cinemasLoading: false,
					cinemasError: false
				});
			})
			.catch(error => {
				this.setState({
					cinemas: [],
					cinemasLoading: false,
					cinemasError: true
				});
			});
	}

	fetchMovies() {
		this.setState({ moviesLoading: true, moviesError: false });

		axios
			.get("/api/movies")
			.then(response => {
				this.setState({
					movies: response.data.map(data => ({
						...data,
						releaseYear: data.release_year,
						posterUrl: data.poster_url
					})),
					moviesLoading: false,
					moviesError: false
				});
			})
			.catch(error => {
				this.setState({
					movies: [],
					moviesLoading: false,
					moviesError: true
				});
			});
	}

	updateCinemas(cinemas) {
		this.setState({ cinemas });
	}

	updateMovies(movies) {
		this.setState({ movies });
	}

	render() {
		const {
			cinemas,
			cinemasLoading,
			cinemasError,
			movies,
			moviesLoading,
			moviesError
		} = this.state;

		return (
			<div className="mvls-container">
				<CinemaAdmin
					cinemas={cinemas}
					cinemasLoading={cinemasLoading}
					cinemasError={cinemasError}
					updateCinemas={this.updateCinemas}
				/>
				<MovieAdmin
					movies={movies}
					moviesLoading={moviesLoading}
					moviesError={moviesError}
					updateMovies={this.updateMovies}
				/>
			</div>
		);
	}
}

export default Admin;
