import type { PrismaClient } from '@prisma/client';
import { randomString } from '$lib/util';
import { stripeAPI } from '../../stripeAPI';

export interface IFromCallbackParams {
	userId?: number;
	firstName?: string;
	lastName?: string;
	email: string;
	emailVerified?: boolean;
}

export async function userFromCallback(prisma: PrismaClient, params: IFromCallbackParams) {
	if (params.userId) {
		return connectEmail(prisma, params);
	} else {
		return createOrGetAccount(prisma, params);
	}
}

async function connectEmail(prisma: PrismaClient, params: IFromCallbackParams) {
	const newEmail = await prisma.email.create({
		data: {
			user: {
				connect: {
					id: params.userId
				}
			},
			email: params.email,
			confirmed: !!params.emailVerified,
			primary: false
		}
	});

	if (newEmail) {
		return await prisma.user.findFirst({
			where: {
				id: params.userId
			},
			include: {
				children: true,
				emails: true
			}
		});
	} else {
		return null;
	}
}

async function createOrGetAccount(prisma: PrismaClient, params: IFromCallbackParams) {
	const user = await prisma.user.findFirst({
		where: {
			emails: {
				some: {
					email: params.email
				}
			}
		}
	});
	if (user) {
		return user;
	} else {
		const name = `${params.firstName || ''} ${params.lastName || ''}`.trim();

		const customer = await stripeAPI.customers.create({
			name,
			email: params.email
		});

		return prisma.user.create({
			data: {
				username: await getUniqueUsername(prisma, params.email.split('@')[0]),
				name,
				bio: '',
				stripeCustomerId: customer.id,
				emails: {
					create: {
						email: params.email,
						confirmed: !!params.emailVerified,
						primary: true
					}
				}
			}
		});
	}
}

async function getUniqueUsername(prisma: PrismaClient, username: string): Promise<string> {
	const user = await prisma.user.findFirst({
		where: {
			username: username
		},
		select: {
			id: true
		}
	});
	if (user) {
		return getUniqueUsername(prisma, `${username}${randomString(2)}`);
	} else {
		return username;
	}
}
