import bcrypt from 'bcryptjs'

const comparePasswords = async(plainTextPassword, hashedPassword) => {
    const isMatch = await bcrypt.compare(plainTextPassword, hashedPassword)
    return isMatch
}

const createHashPassword = async(plainTextPassword) => {
    
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = await bcrypt.hash(plainTextPassword, salt)
    return hashedPassword
}

export {
    comparePasswords,
    createHashPassword
}