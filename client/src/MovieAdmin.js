import React from "react";
import axios from "axios";
import MovieForm from "./MovieForm";
import MovieTable from "./MovieTable";

class MovieAdmin extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			title: "",
			releaseYear: "",
			duration: "",
			posterUrl: "",
			description: "",
			genres: [],
			editing: false,
			formSubmitting: false,
			validationErrors: {},
			formSuccess: false,
			formError: false,
			deleteSuccess: false
		};

		this.resetFormState = this.resetFormState.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleToggleCheckbox = this.handleToggleCheckbox.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleEditMovie = this.handleEditMovie.bind(this);
		this.handleDeleteMovie = this.handleDeleteMovie.bind(this);
	}

	resetFormState() {
		this.setState({
			title: "",
			releaseYear: "",
			duration: "",
			posterUrl: "",
			description: "",
			genres: [],
			editing: false,
			formSubmitting: false,
			validationErrors: {},
			formSuccess: false,
			formError: false,
			deleteSuccess: false
		});
	}

	isValid() {
		const { validationErrors, isValid } = this.validateFormInput(
			this.state
		);

		if (!isValid) {
			this.setState({ validationErrors });
		}

		return isValid;
	}

	validateFormInput(data) {
		const validationErrors = {};
		const {
			title,
			releaseYear,
			duration,
			description,
			posterUrl,
			genres
		} = data;

		if (!title) {
			validationErrors.title = "This field is required";
		}

		if (!releaseYear) {
			validationErrors.releaseYear = "This field is required";
		}

		if (!duration) {
			validationErrors.duration = "This field is required";
		}

		if (!description) {
			validationErrors.description = "This field is required";
		}

		if (!posterUrl) {
			validationErrors.posterUrl = "This field is required";
		}

		if (Array.isArray(genres) && genres.length === 0) {
			validationErrors.genres = "This field is required";
		}

		return {
			validationErrors,
			isValid: Object.keys(validationErrors).length === 0
		};
	}

	handleChange(e) {
		const name = e.target.name;
		const value = e.target.value;

		this.setState({ [name]: value });
	}

	handleToggleCheckbox(e) {
		const checked = e.target.checked;
		const value = e.target.value;

		if (checked) {
			this.setState(prevState => ({
				genres: prevState.genres.concat(value)
			}));
		} else {
			this.setState(prevState => ({
				genres: prevState.genres.filter(genre => genre !== value)
			}));
		}
	}

	handleSubmit(e) {
		e.preventDefault();

		const {
			editing,
			id,
			title,
			releaseYear,
			duration,
			posterUrl,
			description,
			genres
		} = this.state;
		const { movies, updateMovies } = this.props;

		if (this.isValid()) {
			this.setState({
				validationErrors: {},
				formSubmitting: true,
				formSuccess: false,
				formError: false
			});

			if (editing) {
				// Existing record - update
				axios
					.put(`/api/movies/${id}`, {
						title,
						release_year: releaseYear,
						duration,
						poster_url: posterUrl,
						description,
						genres
					})
					.then(response => {
						this.resetFormState();

						const index = movies.findIndex(c => c.id === id);

						this.setState({
							formSuccess: true
						});

						updateMovies([
							...movies.slice(0, index),
							{
								id,
								title,
								releaseYear,
								duration,
								posterUrl,
								description,
								genres: genres.join(",")
							},
							...movies.slice(index + 1)
						]);
					})
					.catch(error => {
						this.setState({
							validationErrors: {},
							formSubmitting: false,
							formSuccess: false,
							formError: true
						});
					});
			} else {
				// New record - Save
				axios
					.post("/api/movies", {
						title,
						release_year: releaseYear,
						duration,
						poster_url: posterUrl,
						description,
						genres
					})
					.then(response => {
						this.resetFormState();
						this.setState({
							formSuccess: true
						});

						updateMovies([
							...movies,
							{
								id: response.data,
								title,
								releaseYear,
								duration,
								posterUrl,
								description,
								genres: genres.join(",")
							}
						]);
					})
					.catch(error => {
						this.setState({
							validationErrors: {},
							formSubmitting: false,
							formSuccess: false,
							formError: true
						});
					});
			}
		}
	}

	handleEditMovie(movie) {
		return () => {
			this.setState({
				...movie,
				genres: movie.genres.split(","),
				editing: true
			});
		};
	}

	handleDeleteMovie(movie, movies) {
		return () => {
			const { id, title } = movie;
			const { updateMovies } = this.props;

			// eslint-disable-next-line no-restricted-globals
			if (confirm(`Are you sure you want to delete '${title}'?`)) {
				axios
					.delete(`/api/movies/${id}`)
					.then(response => {
						const index = movies.findIndex(c => c.id === id);

						this.setState({
							deleteSuccess: true
						});

						updateMovies([
							...movies.slice(0, index),
							...movies.slice(index + 1)
						]);
					})
					.catch(error => {
						this.setState({
							deleteSuccess: false
						});
					});
			}
		};
	}

	render() {
		const {
			title,
			releaseYear,
			duration,
			posterUrl,
			description,
			genres,
			editing,
			formSubmitting,
			validationErrors,
			formSuccess,
			formError,
			deleteSuccess
		} = this.state;
		const { movies, moviesLoading, moviesError } = this.props;

		return (
			<div className="mvls-movie-admin">
				<h1>Movies</h1>
				<h3>{editing ? "Edit Movie" : "Add Movie"}</h3>
				<MovieForm
					title={title}
					releaseYear={releaseYear}
					duration={duration}
					posterUrl={posterUrl}
					description={description}
					genres={genres}
					formSubmitting={formSubmitting}
					validationErrors={validationErrors}
					formSuccess={formSuccess}
					formError={formError}
					handleChange={this.handleChange}
					handleToggleCheckbox={this.handleToggleCheckbox}
					resetFormState={this.resetFormState}
					handleSubmit={this.handleSubmit}
				/>
				<MovieTable
					movies={movies}
					tableLoading={moviesLoading}
					tableError={moviesError}
					deleteSuccess={deleteSuccess}
					onEditMovie={this.handleEditMovie}
					onDeleteMovie={this.handleDeleteMovie}
				/>
			</div>
		);
	}
}

export default MovieAdmin;
