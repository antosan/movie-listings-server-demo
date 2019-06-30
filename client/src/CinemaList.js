import React from "react";
import axios from "axios";
import { Link } from "@reach/router";
import Loading from "./Loading";
import Error from "./Error";

class CinemaList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			cinemas: [],
			loading: false,
			error: false
		};
	}

	componentDidMount() {
		this.fetchCinemas();
	}

	fetchCinemas() {
		this.setState({ loading: true, error: false });

		axios
			.get("/api/cinemas")
			.then(response => {
				this.setState({
					cinemas: response.data,
					loading: false,
					error: false
				});
			})
			.catch(error => {
				this.setState({
					cinemas: [],
					loading: false,
					error: true
				});
			});
	}

	render() {
		const { cinemas, loading, error } = this.state;

		if (loading) {
			return <Loading />;
		}

		if (error) {
			return <Error />;
		}

		return (
			<div className="mvls-container">
				<div className="mvls-cinema-list">
					{cinemas.map(c => (
						<div key={c.id} className="mvls-cinema">
							<div className="mvls-cinema-body">
								<div className="mvls-title">{c.name}</div>
							</div>
							<div className="mvls-cinema-footer">
								<Link
									to={`/cinema/${c.id}`}
									className="mvls-btn mvls-btn-movies"
								>
									See Movies
								</Link>
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}
}

export default CinemaList;
