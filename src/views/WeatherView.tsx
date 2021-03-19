import { useEffect, useState } from "react";
import styles from "./WeatherView.module.scss";
import { Container } from "@material-ui/core";
import { Color } from "@material-ui/lab/Alert";
import {
	ModalComponent,
	DialogComponent,
	SnackBarComponent,
} from "../components";

interface WeatherModalProps {
	text: string;
	title: string;
}

interface CityPromptProps {
	title: string;
	description: string;
	initialCity: string;
}

interface SnackBarProps {
	text: string;
	severity: Color;
}

export default function WeatherView() {
	const [city, setCity] = useState("");
	const [openWeatherModal, setOpenWeatherModal] = useState(false);
	const [weatherModal, setWeatherModal] = useState<WeatherModalProps>({
		text: "",
		title: "",
	});
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbar, setSnackBar] = useState<SnackBarProps>({
		severity: "error",
		text: "",
	});

	const [cityPromptValues] = useState<CityPromptProps>({
		title: "Enter city",
		description: "Enter city name for a weather forecast of this city.",
		initialCity: localStorage.getItem("CITY") || "",
	});

	const handleGetWeather = (city: string) => {
		setCity(city);
	};

	const showWeatherAsync = async (city: string) => {
		const apiKey = process.env.REACT_APP_WEATHER_API_KEY;

		if (!apiKey) {
			setSnackBar({
				severity: "error",
				text:
					"put API key in .env.local as REACT_APP_WEATHER_API_KEY",
			});
			setOpenSnackbar(true);
			return;
		}

		try {
			const requestUri = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
			const response = await fetch(requestUri);
			const data = await response.json();
			setWeatherModal({
				text: `Today it feels like ${Math.round(
					data.main.feels_like - 273
				)}°C`,
				title: `Weather in ${city}`,
			});
			setOpenWeatherModal(true);
		} catch (err) {
			setSnackBar({
				severity: "error",
				text: err?.message || err,
			});
			setOpenSnackbar(true);
		}
	};

	const handleCloseBackdrop = () => {
		setOpenWeatherModal(false);
	};

	useEffect(() => {
		if (city !== "") {
			showWeatherAsync(city);
		}
	}, [city]);

	return (
		<Container>
			<h1 className={styles.textCenter}>Weather page</h1>
			<DialogComponent
				description={cityPromptValues.description}
				title={cityPromptValues.title}
				inputValueName={"city"}
				confirmButtonText={"Show me the weather!"}
				successCallback={handleGetWeather}
				initialInputValue={cityPromptValues.initialCity}
			/>
			<ModalComponent
				open={openWeatherModal}
				title={weatherModal.title}
				text={weatherModal.text}
				handleClose={handleCloseBackdrop}
			/>
			<SnackBarComponent
				severity={snackbar.severity}
				text={snackbar.text}
				triggerOpen={openSnackbar}
			/>
		</Container>
	);
}
