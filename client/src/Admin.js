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
			cinemasError: false
		};

		this.updateCinemas = this.updateCinemas.bind(this);
	}

	componentDidMount() {
		this.fetchCinemas();
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

	updateCinemas(cinemas) {
		this.setState({ cinemas });
	}

	render() {
		const { cinemas, cinemasLoading, cinemasError } = this.state;

		return (
			<div className="mvls-container">
				<CinemaAdmin
					cinemas={cinemas}
					cinemasLoading={cinemasLoading}
					cinemasError={cinemasError}
					updateCinemas={this.updateCinemas}
				/>
				<MovieAdmin />
			</div>
		);
	}
}

export default Admin;
