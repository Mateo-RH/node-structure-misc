import { confirmationUrlPrefix } from '../constants/redisPrefixes';
import { v4 } from 'uuid';
import { redis } from '../../redis';

export const createConfirmationUrl = async (userId: number) => {
  const token = v4();
  await redis.set(confirmationUrlPrefix + token, userId, 'ex', 60 * 60 * 24); // 1 day expiratoin

  return `http://localhost:3000/user/confirm/${token}`;
};
