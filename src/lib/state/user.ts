import { get, writable, derived } from 'svelte/store';
import type { IAsJSON } from '@aicacia/json';
import Cookies from 'js-cookie';
import type { Child, Email, User } from '@prisma/client';
import { base } from '$app/paths';
import { goto } from '$app/navigation';
import { createNotification } from './notifications';
import { browser } from '$app/env';
import type Stripe from 'stripe';

export type IUser = User & {
	emails: Email[];
	children: Child[];
};

export type IUserJSON = IAsJSON<IUser>;
export type IChildJSON = IAsJSON<Child>;
export type IEmailJSON = IAsJSON<Email>;

export function userFromJSON(user: IUserJSON): IUser {
	return {
		...user,
		emails: user.emails.map(emailFromJSON),
		children: user.children.map(childFromJSON),
		updatedAt: new Date(user.updatedAt),
		createdAt: new Date(user.createdAt)
	};
}

export function emailFromJSON(email: IEmailJSON): Email {
	return {
		...email,
		updatedAt: new Date(email.updatedAt),
		createdAt: new Date(email.createdAt)
	};
}

export function childFromJSON(child: IChildJSON): Child {
	return {
		...child,
		birthday: new Date(child.birthday),
		updatedAt: new Date(child.updatedAt),
		createdAt: new Date(child.createdAt)
	};
}

export const redirectPathWritable = writable<string | undefined>();
export const userWritable = writable<IUser | null>(null);
export const user = derived(userWritable, (user) => user);
export const signedIn = derived(user, (user) => user !== null);

export function isSignedIn() {
	return get(signedIn);
}

export async function signIn() {
	const res = await fetch(`${base}/api/user`);
	if (!res.ok) {
		throw new Error('Failed to sign in');
	}
	const user = userFromJSON(await res.json());
	if (!user.confirmed) {
		redirectPathWritable.set('/user');
	}
	const redirectPath = get(redirectPathWritable);

	userWritable.set(user);
	if (redirectPath) {
		redirectPathWritable.set(undefined);
		goto(redirectPath);
	}
}

export function signOut() {
	Cookies.remove('token');
	userWritable.set(null);
}

export async function getCurrentUser(fetchFn: IFetch = fetch) {
	const currentUser = get(user);
	if (currentUser) {
		return currentUser;
	}
	const token = browser ? Cookies.get('token') : true;
	if (token) {
		const res = await fetchFn(`${base}/api/user`);
		if (!res.ok) {
			if (res.status === 403) {
				Cookies.remove('token');
			}
			throw new Error('Failed to sign in');
		}
		const user = userFromJSON(await res.json());
		userWritable.set(user);
		return user;
	} else {
		return null;
	}
}

export async function updateUser(data: Partial<User>) {
	const res = await fetch(`${base}/api/user`, {
		method: 'PATCH',
		body: JSON.stringify(data)
	});
	if (res.ok) {
		const user = userFromJSON(await res.json());
		userWritable.set(user);
		return user;
	} else {
		const message = `Failed to update your account ${await res.json()}`.trim();
		createNotification(message);
		throw new Error(message);
	}
}

export async function validUsername(username: string): Promise<boolean> {
	const res = await fetch(`${base}/api/user/valid/${username}`);
	if (res.ok) {
		return await res.json();
	} else {
		const message = `Failed to check username ${await res.json()}`.trim();
		createNotification(message);
		return false;
	}
}

export async function createSubscription() {
	const res = await fetch(`${base}/api/subscriptions/session`);
	if (res.ok) {
		location.href = await res.json();
	} else {
		const message = `Failed to go to Stripe`;
		createNotification(message);
		throw new Error(message);
	}
}

export async function cancelSubscription(id: string) {
	const res = await fetch(`${base}/api/subscriptions/${id}/cancel`);
	if (res.ok) {
		return (await res.json()) as Stripe.Subscription;
	} else {
		const message = `Failed to cancel to Subscription`;
		createNotification(message);
		throw new Error(message);
	}
}

export async function addChild(data: Partial<Child>) {
	const res = await fetch(`${base}/api/user/children`, {
		method: 'POST',
		body: JSON.stringify(data)
	});
	if (res.ok) {
		const child = childFromJSON(await res.json());
		userWritable.update((state) => {
			if (state) {
				const children = state.children.slice();
				children.push(child);
				return { ...state, children };
			}
			return state;
		});
		return get(userWritable) as User;
	} else {
		const message = `Failed to create Child`;
		createNotification(message);
		throw new Error(message);
	}
}

export async function updateChild(childId: number, data: Partial<Child>) {
	const res = await fetch(`${base}/api/user/children/${childId}`, {
		method: 'PATCH',
		body: JSON.stringify(data)
	});
	if (res.ok) {
		const child = childFromJSON(await res.json());
		userWritable.update((state) => {
			if (state) {
				const children = state.children.slice();
				const index = children.findIndex((child) => child.id === childId);
				if (index === -1) {
					children.push(child);
				} else {
					children[index] = child;
				}
				return { ...state, children };
			}
			return state;
		});
		return get(userWritable) as User;
	} else {
		const message = `Failed to update Child`;
		createNotification(message);
		throw new Error(message);
	}
}

export async function removeChild(childId: number) {
	const res = await fetch(`${base}/api/user/children/${childId}`, {
		method: 'DELETE'
	});
	if (res.ok) {
		userWritable.update((state) => {
			if (state) {
				const children = state.children.slice();
				const index = children.findIndex((child) => child.id === childId);
				if (index !== -1) {
					children.splice(index, 1);
					return { ...state, children };
				}
			}
			return state;
		});
		return get(userWritable) as User;
	} else {
		const message = `Failed to delete Child`;
		createNotification(message);
		throw new Error(message);
	}
}
