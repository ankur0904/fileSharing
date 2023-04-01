import bcrypt from 'bcryptjs'
export const HashingFunction = ({payload="",SaltRounds=parseInt(process.env.SALT_ROUNDS)}={})=>{
    if(payload == ""){
        return false
    }
    const hashedpassword = bcrypt.hashSync(payload,SaltRounds)
    return hashedpassword
}
export const ComparingFunction = ({payload="",ComparingPassword=''}={})=>{
    if(payload == "" && ComparingPassword == ""){
        return false
    }
    const ComparedPassword = bcrypt.compareSync(payload,ComparingPassword)
    return ComparedPassword
}