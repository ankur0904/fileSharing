import  Jwt  from "jsonwebtoken";
export const tokenGeneration = ({payload={},signature=process.env.TOKENGENERATION,expiresIn="1d"}={})=>{
    if(!Object.keys(payload).length){
        return false
    }
    const token = Jwt.sign(payload,signature,{expiresIn})
    return token
}
export const tokenDecode = ({payload="",signature=process.env.TOKENGENERATION}={})=>{
    if(payload === ''){
        return false
    }
    const decode = Jwt.verify(payload,signature)
    return decode
}