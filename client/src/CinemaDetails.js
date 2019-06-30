import React from "react";
import axios from "axios";
import Loading from "./Loading";
import Error from "./Error";

class CinemaDetails extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			cinemaDetails: [],
			movies: [],
			loading: false,
			error: false
		};
	}

	componentDidMount() {
		this.fetchCinemaDetails();
	}

	fetchCinemaDetails() {
		this.setState({ loading: true, error: false });

		const { cinemaId } = this.props;
		const cinemaDetailsPromise = axios.get(`/api/cinemas/${cinemaId}`);
		const moviesPromise = axios.get(`/api/cinemas/${cinemaId}/movies`);

		axios
			.all([cinemaDetailsPromise, moviesPromise])
			.then(
				axios.spread((cinemaDetailsResponse, moviesResponse) => {
					this.setState({
						cinemaDetails: cinemaDetailsResponse.data,
						movies: moviesResponse.data,
						loading: false,
						error: false
					});
				})
			)
			.catch(error => {
				this.setState({
					cinemaDetails: [],
					movies: [],
					loading: false,
					error: true
				});
			});
	}

	toDateString(dateTime) {
		const date = new Date(dateTime);
		const year = date.getFullYear();
		const month = date.getMonth() + 1;
		const day = date.getDate();

		return `${year}-${month}-${day}`;
	}

	render() {
		const { cinemaDetails, movies, loading, error } = this.state;

		if (loading) {
			return <Loading />;
		}

		if (error) {
			return <Error />;
		}

		if (cinemaDetails.length !== 1) {
			return (
				<Error message="Sorry, the cinema does not exist. Please retry." />
			);
		}

		const { name } = cinemaDetails[0];
		const movieIdDateStrings = movies.map(movie => {
			const dateString = this.toDateString(movie.time);

			return `${movie.id}:${dateString}`;
		});
		const uniqueMovieIdDateStrings = [...new Set(movieIdDateStrings)];
		const moviesPlayingInCinema = uniqueMovieIdDateStrings.map(
			movieIdDate => {
				const movieId = Number(movieIdDate.split(":")[0]);
				const datePlaying = movieIdDate.split(":")[1];
				const times = movies
					.filter(
						movie =>
							movie.id === movieId &&
							this.toDateString(movie.time) === datePlaying
					)
					.map(movie => {
						const timeFormatter = new Intl.DateTimeFormat("en", {
							hour: "numeric",
							minute: "numeric",
							hour12: true
						});

						return timeFormatter.format(new Date(movie.time));
					});

				const dateFormatter = new Intl.DateTimeFormat("en", {
					weekday: "long",
					year: "numeric",
					month: "long",
					day: "numeric"
				});

				return {
					movieId,
					datePlaying: dateFormatter.format(new Date(datePlaying)),
					times
				};
			}
		);

		return (
			<div className="mvls-container">
				<h1>{name}</h1>
				{moviesPlayingInCinema.map(moviePlaying => {
					const { movieId, datePlaying, times } = moviePlaying;
					const {
						title,
						description,
						genres,
						duration,
						release_year,
						poster_url
					} = movies.filter(m => m.id === movieId)[0];

					return (
						<div
							key={`${movieId}:${datePlaying}`}
							className="mvls-movie-details-wrapper"
						>
							<div className="mvls-movie-details">
								<img
									className="mvls-movie-details-poster"
									src={poster_url}
									alt={title}
								/>
								<div className="mvls-movie-details-info">
									<h2>{title}</h2>
									<p>{description}</p>
									<p>
										<span>Genre</span>: {genres}
									</p>
									<p>
										<span>Duration</span>: {duration}{" "}
										minutes
									</p>
									<p>
										<span>Year</span>: {release_year}
									</p>
									<p>
										<span>{datePlaying}</span>
									</p>
									<p>
										{times.map(time => (
											<span key={time} className="time">
												{time}
											</span>
										))}
									</p>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		);
	}
}

export default CinemaDetails;
