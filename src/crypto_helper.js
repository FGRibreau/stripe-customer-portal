const crypto = require("crypto")
const aes_algorithm = "aes-256-ctr"
const sha_algorithm = "sha256"

const { HMAC_SECRET, AES_SECRET } = process.env

const aes_encrypt = (text) => {
    const cipher = crypto.createCipher(aes_algorithm, AES_SECRET)
    let crypted = cipher.update(text)
    crypted = Buffer.concat([crypted, cipher.final()])
    return crypted.toString("hex")
}

const aes_decrypt = (text) => {
    const decipher = crypto.createDecipher(aes_algorithm, AES_SECRET)
    let dec = decipher.update(text, "hex", "utf8")
    dec = dec + decipher.final("utf8")
    return dec
}

const hmac_encrypt = (text) => crypto.createHmac(sha_algorithm, HMAC_SECRET).update(text).digest("hex")

module.exports = {
    aes_encrypt,
    aes_decrypt,
    hmac_encrypt
}
