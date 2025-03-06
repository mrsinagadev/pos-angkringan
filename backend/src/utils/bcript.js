import bcrypt from 'bcrypt';
const saltRounds = 10;

export const encript = (password) => {
    return bcrypt.hashSync(password, saltRounds);
};

export const compare = (password, hashedPassword) => {
    return bcrypt.compareSync(password, hashedPassword);
};