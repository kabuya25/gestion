const bcrypt = require("bcrypt");

const saltRounds = process.env.SALT_ROUND

const hash = (password) => {
    return bcrypt.hashSync(password, parseInt(saltRounds));
}

const compare = (input, password) =>{
    return bcrypt.compareSync(input, password);
}

export {hash, compare}