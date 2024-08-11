import bcrypt from 'bcrypt';

const salt = parseInt( process.env.BCRYPT_SALT );

export const hash = async (password) => {
    return await bcrypt.hash(password, salt);
}