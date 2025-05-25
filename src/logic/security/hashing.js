const bcrypt = require("bcrypt");

const saltRounds = 10

const hash = (password) => {
    return bcrypt.hashSync(password, parseInt(saltRounds));
}

const compare = (input, password) =>{
    return bcrypt.compareSync(input, password);
}

export {hash, compare}