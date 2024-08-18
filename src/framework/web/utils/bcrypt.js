import bcrypt from 'bcrypt'

const comparePasswords = async(plainTextPassword, hashedPassword) => {
    const isMatch = await bcrypt.compare(plainTextPassword, hashedPassword)
    return isMatch
}

const createHashPassword = async(plainTextPassword) => {
    console.log(plainTextPassword,"jgjgjgg");
    
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(plainTextPassword, salt)
    return hashedPassword
}

export {
    comparePasswords,
    createHashPassword
}