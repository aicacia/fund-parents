import { random } from '@aicacia/rand';
import { range } from '@aicacia/range';
import { get } from 'svelte/store';
import { locale } from './state/locale';

export function randomString(length = 6): string {
	return range(0, length)
		.iter()
		.map(() =>
			random() < 0.25
				? Math.floor(1 + random() * 9)
				: String.fromCharCode(65 + Math.floor(random() * 26))
		)
		.join('')
		.toUpperCase();
}

export function createInsecureID() {
	return Math.random().toString(36).substring(2);
}

export function getLocation(): Promise<GeolocationCoordinates> {
	return new Promise((resolve, reject) =>
		navigator.geolocation.getCurrentPosition((location) => resolve(location.coords), reject)
	);
}

export interface ILocationDetails {
	address: {
		'ISO3166-2-lvl4': string;
		city: string;
		country: string;
		country_code: string;
		county: string;
		neighbourhood: string;
		postcode: string;
		road: string;
		state: string;
	};
	addresstype: string;
	boundingbox: [latX: string, latX: string, lonY: string, lonY: string];
	category: string;
	display_name: string;
	importance: number;
	lat: string;
	licence: string;
	lon: string;
	name: string;
	osm_id: number;
	osm_type: string;
	place_id: number;
	place_rank: number;
	type: string;
}

export async function getLocationDetails(
	coords: GeolocationCoordinates
): Promise<ILocationDetails> {
	const res = await fetch(
		`https://nominatim.openstreetmap.org/reverse.php?lat=${coords.latitude}&lon=${coords.longitude}&zoom=18&format=jsonv2`
	);
	if (!res.ok) {
		throw new Error(await res.text());
	}
	return await res.json();
}

export function wait(ms: number) {
	return new Promise<void>((resolve) => setTimeout(() => resolve(), ms));
}

export function formatCurrency(amount: number, currency: string) {
	return new Intl.NumberFormat(get(locale), { style: 'currency', currency: currency }).format(
		amount
	);
}
