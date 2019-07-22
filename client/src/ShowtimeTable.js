import React from "react";

function ShowtimeTable({
	showtimes,
	tableLoading,
	tableError,
	deleteSuccess,
	onEditShowtime,
	onDeleteShowtime
}) {
	if (tableLoading) {
		return <p className="mvls-table-loading">Loading showtimes...</p>;
	}

	const dateTimeFormatter = new Intl.DateTimeFormat("en", {
		weekday: "short",
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "numeric",
		hour12: true
	});

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
						<th>Cinema</th>
						<th>Movie</th>
						<th>Time</th>
						<th>Action</th>
					</tr>
				</thead>
				{showtimes.length === 0 && (
					<tbody>
						<tr>
							<td colSpan="5" className="mvls-no-data">
								No data
							</td>
						</tr>
					</tbody>
				)}
				{showtimes.length > 0 && (
					<tbody>
						{showtimes.map((showtime, index) => {
							const {
								id,
								cinemaName,
								movieTitle,
								date,
								time
							} = showtime;

							return (
								<tr key={id}>
									<td>{index + 1}</td>
									<td>{cinemaName}</td>
									<td>{movieTitle}</td>
									<td>
										{dateTimeFormatter.format(
											new Date(`${date}T${time}`)
										)}
									</td>
									<td>
										<span
											className="mvls-table-link"
											onClick={onEditShowtime(showtime)}
										>
											Edit
										</span>
										&nbsp;&nbsp;|&nbsp;&nbsp;
										<span
											className="mvls-table-link"
											onClick={onDeleteShowtime(
												showtime,
												showtimes
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

export default ShowtimeTable;
