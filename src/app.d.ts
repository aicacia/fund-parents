/// <reference types="@sveltejs/kit" />
/// <reference types="vite/client" />

import type { IJwtString } from '$lib/api/jwt';
import type { IUser } from '$lib/state/user';
import type { Stripe } from '@stripe/stripe-js';
import type * as bootstrap from 'bootstrap';

declare global {
	declare type IFetch = (info: RequestInfo, init?: RequestInit) => Promise<Response>;

	declare namespace App {
		interface Locals {
			rawToken?: IJwtString<{ userId: number }>;
			token?: { userId: number };
			user: IUser | null;
		}

		interface Platform {}

		interface PrivateEnv {}

		interface PublicEnv {}

		interface Stuff {}
	}

	interface Window {
		Stripe: Stripe;
	}

	interface ImportMetaEnv {
		readonly VITE_STRIPE_PUBLISHABLE_KEY: string;
	}

	interface ImportMeta {
		readonly env: ImportMetaEnv;
	}

	namespace NodeJS {
		interface ProcessEnv {
			S3_ACCESS_KEY: string;
			S3_SECRET_KEY: string;
			S3_REGION: string;

			JWT_SECRET_KEY: string;

			GOOGLE_OAUTH_CLIENT_ID: string;
			GOOGLE_OAUTH_CLIENT_SECRET: string;

			FACEBOOK_OAUTH_CLIENT_ID: string;
			FACEBOOK_OAUTH_CLIENT_SECRET: string;

			STRIPE_SECRET_KEY: string;
		}
	}
}
