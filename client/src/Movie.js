import React from "react";
import { Link } from "@reach/router";

function Movie({ movieShowing }) {
	const { id, title, poster_url, cinema_count } = movieShowing;
	let cinemaText = "";

	if (cinema_count === 0) {
		cinemaText = "Not showing in any cinema";
	} else if (cinema_count === 1) {
		cinemaText = "Showing in 1 cinema";
	} else {
		cinemaText = `Showing in ${cinema_count} cinemas`;
	}

	return (
		<div className="mvls-movie">
			<img className="mvls-poster" src={poster_url} alt={title} />
			<div className="mvls-movie-body">
				<div className="mvls-title">{title}</div>
				<p className="mvls-cinema-count">{cinemaText}</p>
			</div>
			<div className="mvls-movie-footer">
				<Link to={`movie/${id}`} className="mvls-btn mvls-btn-cinemas">
					See Cinemas
				</Link>
			</div>
		</div>
	);
}

export default Movie;
