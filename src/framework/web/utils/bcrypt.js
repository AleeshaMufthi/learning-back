import bcrypt from 'bcrypt'

const comparePasswords = async(plainTextPassword, hashedPassword) => {
    const isMatch = await bcrypt.compare(plainTextPassword, hashedPassword)
    return isMatch
}

const createHashPassword = async(plainTextPassword) => {
    console.log(plainTextPassword,"jgjgjgg");
    
    const salt = bcrypt.genSaltSync(10)
    console.log(salt)
    const hashedPassword = await bcrypt.hash(plainTextPassword, salt)
    return hashedPassword
}

export {
    comparePasswords,
    createHashPassword
}