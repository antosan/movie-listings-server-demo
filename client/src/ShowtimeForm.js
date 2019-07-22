import React from "react";

function ShowtimeForm({
	cinemas,
	movies,
	cinemaId,
	movieId,
	date,
	time,
	formSubmitting,
	validationErrors,
	formSuccess,
	formError,
	handleChange,
	resetFormState,
	handleSubmit
}) {
	const disabled = !cinemaId || !movieId || !date || !time;

	return (
		<form className="mvls-form" onSubmit={handleSubmit}>
			{formSuccess && (
				<p className="mvls-alert mvls-alert-success">
					Form submitted successfully.
				</p>
			)}
			{formError && (
				<p className="mvls-alert mvls-alert-error">
					Sorry, error submitting form. Please retry.
				</p>
			)}
			<div className="mvls-form-row">
				<div className="mvls-form-col">
					<label htmlFor="cinemaId">Cinema</label>
					<div className="mvls-form-input-group">
						<select
							name="cinemaId"
							className={
								validationErrors.cinemaId ? "has-error" : ""
							}
							value={cinemaId}
							onChange={handleChange}
							disabled={formSubmitting}
						>
							<option value="">Select Cinema</option>
							{cinemas.map(c => (
								<option key={c.id} value={c.id}>
									{c.name}
								</option>
							))}
						</select>
						{validationErrors.cinemaId && (
							<span className="mvls-form-input-error">
								{validationErrors.cinemaId}
							</span>
						)}
					</div>
				</div>
				<div className="mvls-form-col">
					<label htmlFor="movieId">Movie</label>
					<div className="mvls-form-input-group">
						<select
							name="movieId"
							className={
								validationErrors.movieId ? "has-error" : ""
							}
							value={movieId}
							onChange={handleChange}
							disabled={formSubmitting}
						>
							<option value="">Select Movie</option>
							{movies.map(c => (
								<option key={c.id} value={c.id}>
									{c.title}
								</option>
							))}
						</select>
						{validationErrors.movieId && (
							<span className="mvls-form-input-error">
								{validationErrors.movieId}
							</span>
						)}
					</div>
				</div>
			</div>
			<div className="mvls-form-row">
				<div className="mvls-form-col">
					<label htmlFor="date">Date</label>
					<div className="mvls-form-input-group">
						<input
							type="date"
							name="date"
							className={validationErrors.date ? "has-error" : ""}
							autoComplete="off"
							value={date}
							onChange={handleChange}
							disabled={formSubmitting}
						/>
						{validationErrors.date && (
							<span className="mvls-form-input-error">
								{validationErrors.date}
							</span>
						)}
					</div>
				</div>
				<div className="mvls-form-col">
					<label htmlFor="time">Time</label>
					<div className="mvls-form-input-group">
						<input
							type="time"
							name="time"
							className={validationErrors.time ? "has-error" : ""}
							autoComplete="off"
							value={time}
							onChange={handleChange}
							disabled={formSubmitting}
						/>
						{validationErrors.time && (
							<span className="mvls-form-input-error">
								{validationErrors.time}
							</span>
						)}
					</div>
				</div>
			</div>

			<button
				className="mvls-btn mvls-btn-form"
				type="submit"
				disabled={disabled || formSubmitting}
			>
				Submit
			</button>
			<button
				className="mvls-btn mvls-btn-form"
				type="reset"
				onClick={resetFormState}
				disabled={formSubmitting}
			>
				Reset
			</button>
		</form>
	);
}

export default ShowtimeForm;
