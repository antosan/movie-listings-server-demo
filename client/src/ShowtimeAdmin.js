import React from "react";
import axios from "axios";
import ShowtimeForm from "./ShowtimeForm";
import ShowtimeTable from "./ShowtimeTable";

class ShowtimeAdmin extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			id: "",
			cinemaId: "",
			movieId: "",
			date: "",
			time: "",
			editing: false,
			formSubmitting: false,
			validationErrors: {},
			formSuccess: false,
			formError: false,
			showtimes: [],
			tableLoading: false,
			tableError: false,
			deleteSuccess: false
		};

		this.resetFormState = this.resetFormState.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleEditShowtime = this.handleEditShowtime.bind(this);
		this.handleDeleteShowtime = this.handleDeleteShowtime.bind(this);
	}

	componentDidMount() {
		this.fetchShowtimes();
	}

	fetchShowtimes() {
		this.setState({ tableLoading: true, tableError: false });

		axios
			.get("/api/showtimes")
			.then(response => {
				this.setState({
					showtimes: response.data.map(data => ({
						id: data.id,
						cinemaId: data.cinema_id,
						movieId: data.movie_id,
						date: this.extractDateTime(data.time).date,
						time: this.extractDateTime(data.time).time
					})),
					tableLoading: false,
					tableError: false
				});
			})
			.catch(error => {
				this.setState({
					showtimes: [],
					tableLoading: false,
					tableError: true
				});
			});
	}

	resetFormState() {
		this.setState({
			id: "",
			cinemaId: "",
			movieId: "",
			date: "",
			time: "",
			editing: false,
			formSubmitting: false,
			validationErrors: {},
			formSuccess: false,
			formError: false,
			deleteSuccess: false
		});
	}

	extractDateTime(dateTimeString) {
		const dateTime = new Date(dateTimeString);
		const year = dateTime.getFullYear();
		let month = dateTime.getMonth() + 1;
		let day = dateTime.getDate();
		let hours = dateTime.getHours();
		let minutes = dateTime.getMinutes();

		month = month.toString().padStart(2, "0");
		day = day.toString().padStart(2, "0");
		hours = hours.toString().padStart(2, "0");
		minutes = minutes.toString().padStart(2, "0");

		return {
			date: `${year}-${month}-${day}`,
			time: `${hours}:${minutes}`
		};
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
		const { cinemaId, movieId, date, time } = data;

		if (!cinemaId) {
			validationErrors.cinemaId = "This field is required";
		}

		if (!movieId) {
			validationErrors.movieId = "This field is required";
		}

		if (!date) {
			validationErrors.date = "This field is required";
		}

		if (!time) {
			validationErrors.time = "This field is required";
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

	handleSubmit(e) {
		e.preventDefault();

		const {
			editing,
			showtimes,
			id,
			cinemaId,
			movieId,
			date,
			time
		} = this.state;

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
					.put(`/api/showtimes/${id}`, {
						cinema_id: cinemaId,
						movie_id: movieId,
						time: `${date} ${time}`
					})
					.then(response => {
						this.resetFormState();

						const index = showtimes.findIndex(c => c.id === id);

						this.setState({
							formSuccess: true,
							showtimes: [
								...showtimes.slice(0, index),
								{
									id,
									cinemaId,
									movieId,
									date,
									time
								},
								...showtimes.slice(index + 1)
							]
						});
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
					.post("/api/showtimes", {
						cinema_id: cinemaId,
						movie_id: movieId,
						time: `${date} ${time}`
					})
					.then(response => {
						this.resetFormState();
						this.setState({
							formSuccess: true,
							showtimes: [
								...showtimes,
								{
									id: response.data,
									cinemaId,
									movieId,
									date,
									time
								}
							]
						});
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

	handleEditShowtime(showtime) {
		return () => {
			this.setState({ ...showtime, editing: true });
		};
	}

	handleDeleteShowtime(showtime, showtimes) {
		return () => {
			const { id } = showtime;

			// eslint-disable-next-line no-restricted-globals
			if (confirm("Are you sure you want to delete this showtime?")) {
				axios
					.delete(`/api/showtimes/${id}`)
					.then(response => {
						const index = showtimes.findIndex(c => c.id === id);

						this.setState({
							showtimes: [
								...showtimes.slice(0, index),
								...showtimes.slice(index + 1)
							],
							deleteSuccess: true,
							tableError: false
						});
					})
					.catch(error => {
						this.setState({
							deleteSuccess: false,
							tableError: true
						});
					});
			}
		};
	}

	render() {
		const {
			cinemaId,
			movieId,
			date,
			time,
			editing,
			formSubmitting,
			validationErrors,
			formSuccess,
			formError,
			showtimes,
			tableLoading,
			tableError,
			deleteSuccess
		} = this.state;
		const { cinemas, movies } = this.props;
		const detailedShowtimes = showtimes.map(showtime => {
			const cinema = cinemas.find(c => c.id === showtime.cinemaId);
			const movie = movies.find(m => m.id === showtime.movieId);

			return {
				...showtime,
				cinemaName: cinema ? cinema.name : "",
				movieTitle: movie ? movie.title : ""
			};
		});

		return (
			<div className="mvls-showtime-admin">
				<h1>Showtimes</h1>
				<h3>{editing ? "Edit Showtime" : "Add Showtime"}</h3>
				<ShowtimeForm
					cinemas={cinemas}
					movies={movies}
					cinemaId={cinemaId}
					movieId={movieId}
					date={date}
					time={time}
					formSubmitting={formSubmitting}
					validationErrors={validationErrors}
					formSuccess={formSuccess}
					formError={formError}
					handleChange={this.handleChange}
					resetFormState={this.resetFormState}
					handleSubmit={this.handleSubmit}
				/>
				<ShowtimeTable
					showtimes={detailedShowtimes}
					tableLoading={tableLoading}
					tableError={tableError}
					deleteSuccess={deleteSuccess}
					onEditShowtime={this.handleEditShowtime}
					onDeleteShowtime={this.handleDeleteShowtime}
				/>
			</div>
		);
	}
}

export default ShowtimeAdmin;
