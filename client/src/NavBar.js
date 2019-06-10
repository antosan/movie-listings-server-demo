import React from "react";

function NavBar() {
	return (
		<div className="mvls-container">
			<nav className="mvls-nav">
				<span className="mvls-title">Movie Listings</span>
				<a href="/">Movies</a>
				<a href="/cinemas">Cinemas</a>
				<a href="/admin">Admin</a>
			</nav>
		</div>
	);
}

export default NavBar;
