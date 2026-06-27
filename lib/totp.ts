import speakeasy from "speakeasy"
import QRCode from "qrcode"

export function generateTotpSecret(email: string) {
  return speakeasy.generateSecret({
    name: `AuthentikMe:${email}`,
    issuer: "AuthentikMe",
    length: 20,
  })
}

export async function getTotpQrCode(otpauthUrl: string): Promise<string> {
  return QRCode.toDataURL(otpauthUrl)
}

export function verifyTotpToken(secret: string, token: string): boolean {
  return speakeasy.totp.verify({
    secret,
    encoding: "base32",
    token,
    window: 1,
  })
}
