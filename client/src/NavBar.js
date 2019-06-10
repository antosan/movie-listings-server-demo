import React from "react";
import { Link } from "@reach/router";

function NavBar() {
	return (
		<div className="mvls-container">
			<nav className="mvls-nav">
				<span className="mvls-title">Movie Listings</span>
				<Link to="/">Movies</Link>
				<Link to="/cinemas">Cinemas</Link>
				<Link to="/admin">Admin</Link>
			</nav>
		</div>
	);
}

export default NavBar;
