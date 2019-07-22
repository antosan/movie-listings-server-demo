import React from "react";
import axios from "axios";
import CinemaForm from "./CinemaForm";
import CinemaTable from "./CinemaTable";

class CinemaAdmin extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: "",
			editing: false,
			formSubmitting: false,
			validationErrors: {},
			formSuccess: false,
			formError: false,
			deleteSuccess: false
		};

		this.resetFormState = this.resetFormState.bind(this);
		this.handleNameChange = this.handleNameChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleEditCinema = this.handleEditCinema.bind(this);
		this.handleDeleteCinema = this.handleDeleteCinema.bind(this);
	}

	resetFormState() {
		this.setState({
			name: "",
			editing: false,
			formSubmitting: false,
			validationErrors: {},
			formSuccess: false,
			formError: false,
			deleteSuccess: false
		});
	}

	isValid() {
		const { validationErrors, isValid } = this.validateFormInput(
			this.state
		);

		if (!isValid) {
			this.setState({ validationErrors });
		}

		return isValid;
	}

	validateFormInput(data) {
		const validationErrors = {};
		const { name } = data;

		if (!name) {
			validationErrors.name = "This field is required";
		}

		return {
			validationErrors,
			isValid: Object.keys(validationErrors).length === 0
		};
	}

	handleNameChange(e) {
		e.preventDefault();
		this.setState({ name: e.target.value });
	}

	handleSubmit(e) {
		e.preventDefault();

		const { editing, id, name } = this.state;
		const { cinemas, updateCinemas } = this.props;

		if (this.isValid()) {
			this.setState({
				validationErrors: {},
				formSubmitting: true,
				formSuccess: false,
				formError: false
			});

			if (editing) {
				// Existing record - update
				axios
					.put(`/api/cinemas/${id}`, { name })
					.then(response => {
						this.resetFormState();

						const index = cinemas.findIndex(c => c.id === id);

						this.setState({
							formSuccess: true
						});

						updateCinemas([
							...cinemas.slice(0, index),
							{ id, name },
							...cinemas.slice(index + 1)
						]);
					})
					.catch(error => {
						this.setState({
							validationErrors: {},
							formSubmitting: false,
							formSuccess: false,
							formError: true
						});
					});
			} else {
				// New record - Save
				axios
					.post("/api/cinemas", { name })
					.then(response => {
						this.resetFormState();
						this.setState({
							formSuccess: true
						});

						updateCinemas([
							...cinemas,
							{ id: response.data, name }
						]);
					})
					.catch(error => {
						this.setState({
							validationErrors: {},
							formSubmitting: false,
							formSuccess: false,
							formError: true
						});
					});
			}
		}
	}

	handleEditCinema(cinema) {
		return () => {
			this.setState({ ...cinema, editing: true });
		};
	}

	handleDeleteCinema(cinema, cinemas) {
		return () => {
			const { id, name } = cinema;
			const { updateCinemas } = this.props;

			// eslint-disable-next-line no-restricted-globals
			if (confirm(`Are you sure you want to delete '${name}'?`)) {
				axios
					.delete(`/api/cinemas/${id}`)
					.then(response => {
						const index = cinemas.findIndex(c => c.id === id);

						this.setState({
							deleteSuccess: true
						});

						updateCinemas([
							...cinemas.slice(0, index),
							...cinemas.slice(index + 1)
						]);
					})
					.catch(error => {
						this.setState({
							deleteSuccess: false
						});
					});
			}
		};
	}

	render() {
		const {
			name,
			editing,
			formSubmitting,
			validationErrors,
			formSuccess,
			formError,
			deleteSuccess
		} = this.state;
		const { cinemas, cinemasLoading, cinemasError } = this.props;

		return (
			<div className="mvls-cinema-admin">
				<h1>Cinemas</h1>
				<h3>{editing ? "Edit Cinema" : "Add Cinema"}</h3>
				<CinemaForm
					name={name}
					formSubmitting={formSubmitting}
					validationErrors={validationErrors}
					formSuccess={formSuccess}
					formError={formError}
					handleNameChange={this.handleNameChange}
					resetFormState={this.resetFormState}
					handleSubmit={this.handleSubmit}
				/>
				<CinemaTable
					cinemas={cinemas}
					tableLoading={cinemasLoading}
					tableError={cinemasError}
					deleteSuccess={deleteSuccess}
					onEditCinema={this.handleEditCinema}
					onDeleteCinema={this.handleDeleteCinema}
				/>
			</div>
		);
	}
}

export default CinemaAdmin;
