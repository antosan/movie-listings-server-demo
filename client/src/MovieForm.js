import React from "react";

function MovieForm({
	title,
	releaseYear,
	duration,
	description,
	posterUrl,
	genres,
	formSubmitting,
	validationErrors,
	formSuccess,
	formError,
	handleChange,
	handleToggleCheckbox,
	resetFormState,
	handleSubmit
}) {
	const disabled =
		!title ||
		!releaseYear ||
		!duration ||
		!description ||
		!posterUrl ||
		(Array.isArray(genres) && genres.length === 0);

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
					<label htmlFor="title">Title</label>
					<div className="mvls-form-input-group">
						<input
							type="text"
							name="title"
							className={
								validationErrors.title ? "has-error" : ""
							}
							autoComplete="off"
							value={title}
							onChange={handleChange}
							disabled={formSubmitting}
						/>
						{validationErrors.title && (
							<span className="mvls-form-input-error">
								{validationErrors.title}
							</span>
						)}
					</div>
				</div>
				<div className="mvls-form-col">
					<label htmlFor="releaseYear">Release Year</label>
					<div className="mvls-form-input-group">
						<input
							type="number"
							name="releaseYear"
							className={
								validationErrors.releaseYear ? "has-error" : ""
							}
							autoComplete="off"
							value={releaseYear}
							onChange={handleChange}
							disabled={formSubmitting}
						/>
						{validationErrors.releaseYear && (
							<span className="mvls-form-input-error">
								{validationErrors.releaseYear}
							</span>
						)}
					</div>
				</div>
			</div>
			<div className="mvls-form-row">
				<div className="mvls-form-col">
					<label htmlFor="duration">Duration</label>
					<div className="mvls-form-input-group">
						<input
							type="number"
							name="duration"
							className={
								validationErrors.duration ? "has-error" : ""
							}
							autoComplete="off"
							value={duration}
							onChange={handleChange}
							disabled={formSubmitting}
						/>
						{validationErrors.duration && (
							<span className="mvls-form-input-error">
								{validationErrors.duration}
							</span>
						)}
					</div>
				</div>
				<div className="mvls-form-col">
					<label htmlFor="posterUrl">Poster URL</label>
					<div className="mvls-form-input-group">
						<input
							type="text"
							name="posterUrl"
							className={
								validationErrors.posterUrl ? "has-error" : ""
							}
							autoComplete="off"
							value={posterUrl}
							onChange={handleChange}
							disabled={formSubmitting}
						/>
						{validationErrors.posterUrl && (
							<span className="mvls-form-input-error">
								{validationErrors.posterUrl}
							</span>
						)}
					</div>
				</div>
			</div>
			<div className="mvls-form-row">
				<div className="mvls-form-col">
					<label htmlFor="description">Description</label>
					<div className="mvls-form-input-group">
						<textarea
							name="description"
							className={
								validationErrors.description ? "has-error" : ""
							}
							autoComplete="off"
							rows={5}
							value={description}
							onChange={handleChange}
							disabled={formSubmitting}
						/>
						{validationErrors.description && (
							<span className="mvls-form-input-error">
								{validationErrors.description}
							</span>
						)}
					</div>
				</div>
				<div className="mvls-form-col">
					<label>Genres</label>
					<div className="mvls-form-input-group">
						<div className="mvls-checkbox-group">
							<label>
								<input
									type="checkbox"
									name="genres"
									value="Action"
									checked={genres.includes("Action")}
									onChange={handleToggleCheckbox}
								/>
								&nbsp;Action
							</label>
							<label>
								<input
									type="checkbox"
									name="genres"
									value="Drama"
									checked={genres.includes("Drama")}
									onChange={handleToggleCheckbox}
								/>
								&nbsp;Drama
							</label>
							<label>
								<input
									type="checkbox"
									name="genres"
									value="Adventure"
									checked={genres.includes("Adventure")}
									onChange={handleToggleCheckbox}
								/>
								&nbsp;Adventure
							</label>
							<label>
								<input
									type="checkbox"
									name="genres"
									value="Comedy"
									checked={genres.includes("Comedy")}
									onChange={handleToggleCheckbox}
								/>
								&nbsp;Comedy
							</label>
							<label>
								<input
									type="checkbox"
									name="genres"
									value="Sci-Fi"
									checked={genres.includes("Sci-Fi")}
									onChange={handleToggleCheckbox}
								/>
								&nbsp;Sci-Fi
							</label>
							<label>
								<input
									type="checkbox"
									name="genres"
									value="Romance"
									checked={genres.includes("Romance")}
									onChange={handleToggleCheckbox}
								/>
								&nbsp;Romance
							</label>
						</div>
						{validationErrors.genres && (
							<span className="mvls-form-input-error">
								{validationErrors.genres}
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

export default MovieForm;
