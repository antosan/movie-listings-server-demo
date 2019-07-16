import React from "react";

// We make our form a fully controlled component that does not manage any state.
function CinemaForm({
	name,
	formSubmitting,
	validationErrors,
	formSuccess,
	formError,
	handleNameChange,
	resetFormState,
	handleSubmit
}) {
	const disabled = !name;

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
					<label htmlFor="name">Name</label>
					<div className="mvls-form-input-group">
						<input
							type="text"
							name="name"
							className={validationErrors.name ? "has-error" : ""}
							autoComplete="off"
							value={name}
							onChange={handleNameChange}
							disabled={formSubmitting}
						/>
						{validationErrors.name && (
							<span className="mvls-form-input-error">
								{validationErrors.name}
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

export default CinemaForm;
