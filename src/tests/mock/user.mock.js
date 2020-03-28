import { encode } from 'utils/jwtTokenizer';

export const user = {
  firstName: 'Abdoul',
  lastName: 'Nuru',
  email: 'nuruniyigena@gmail.com',
  password: 'TC866XY9EHEGz!+P'
};
export const email = 'nuruniyigena@gmail.com';
export const role = 'manager';

export const token = encode({ email: 'nuruniyigena@gmail.com' });
