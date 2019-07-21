import React from "react";

function CinemaTable({
	cinemas,
	tableLoading,
	tableError,
	deleteSuccess,
	onEditCinema,
	onDeleteCinema
}) {
	if (tableLoading) {
		return <p className="mvls-table-loading">Loading cinemas...</p>;
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
						<th>Name</th>
						<th>Action</th>
					</tr>
				</thead>
				{cinemas.length === 0 && (
					<tbody>
						<tr>
							<td colSpan="3" className="mvls-no-data">
								No data
							</td>
						</tr>
					</tbody>
				)}
				{cinemas.length > 0 && (
					<tbody>
						{cinemas.map((cinema, index) => {
							const { id, name } = cinema;

							return (
								<tr key={id}>
									<td>{index + 1}</td>
									<td>{name}</td>
									<td>
										<span
											className="mvls-table-link"
											onClick={onEditCinema(cinema)}
										>
											Edit
										</span>
										&nbsp;&nbsp;|&nbsp;&nbsp;
										<span
											className="mvls-table-link"
											onClick={onDeleteCinema(
												cinema,
												cinemas
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

export default CinemaTable;
