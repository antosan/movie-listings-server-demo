import React from "react";
import axios from "axios";
import Movie from "./Movie";

class MovieList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			moviesShowing: [],
			loading: false,
			error: false
		};
	}

	componentDidMount() {
		this.fetchMoviesShowing();
	}

	fetchMoviesShowing() {
		this.setState({ loading: true });

		axios
			.get("/api/moviesshowing")
			.then(response => {
				this.setState({
					moviesShowing: response.data,
					loading: false,
					error: false
				});
			})
			.catch(error => {
				this.setState({
					moviesShowing: [],
					loading: false,
					error: true
				});
			});
	}

	render() {
		const { moviesShowing } = this.state;

		return (
			<div className="mvls-container">
				<div className="mvls-movie-list">
					{moviesShowing.map(m => (
						<Movie key={m.id} movieShowing={m} />
					))}
				</div>
			</div>
		);
	}
}

export default MovieList;
