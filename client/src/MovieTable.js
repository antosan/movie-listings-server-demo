import React from "react";

function MovieTable({
	movies,
	tableLoading,
	tableError,
	deleteSuccess,
	onEditMovie,
	onDeleteMovie
}) {
	if (tableLoading) {
		return <p className="mvls-table-loading">Loading movies...</p>;
	}

	return (
		<div className="mvls-table">
			{deleteSuccess && (
				<p className="mvls-alert mvls-alert-success">
					Record deleted successfully.
				</p>
			)}
			{tableError && (
				<p className="mvls-alert mvls-alert-error">
					Sorry, a server error occurred. Please retry.
				</p>
			)}
			<table>
				<thead>
					<tr>
						<th>No</th>
						<th>Title</th>
						<th>Release Year</th>
						<th>Duration</th>
						<th>Poster URL</th>
						<th>Description</th>
						<th>Genres</th>
						<th>Action</th>
					</tr>
				</thead>
				{movies.length === 0 && (
					<tbody>
						<tr colSpan="8">
							<td>No data</td>
						</tr>
					</tbody>
				)}
				{movies.length > 0 && (
					<tbody>
						{movies.map((movie, index) => {
							const {
								id,
								title,
								releaseYear,
								duration,
								posterUrl,
								description,
								genres
							} = movie;

							return (
								<tr key={id}>
									<td>{index + 1}</td>
									<td>{title}</td>
									<td>{releaseYear}</td>
									<td>{duration}</td>
									<td>{posterUrl}</td>
									<td>{description}</td>
									<td>{genres}</td>
									<td>
										<span
											className="mvls-table-link"
											onClick={onEditMovie(movie)}
										>
											Edit
										</span>
										&nbsp;&nbsp;|&nbsp;&nbsp;
										<span
											className="mvls-table-link"
											onClick={onDeleteMovie(
												movie,
												movies
											)}
										>
											Delete
										</span>
									</td>
								</tr>
							);
						})}
					</tbody>
				)}
			</table>
		</div>
	);
}

export default MovieTable;
