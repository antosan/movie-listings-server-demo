import React from "react";
import CinemaAdmin from "./CinemaAdmin";
import MovieAdmin from "./MovieAdmin";

function Admin() {
	return (
		<div className="mvls-container">
			<CinemaAdmin />
			<MovieAdmin />
		</div>
	);
}

export default Admin;
