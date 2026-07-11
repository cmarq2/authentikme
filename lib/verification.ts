import crypto from "crypto"

export type VerificationStatus = {
  emailVerified: boolean
  recaptchaDone: boolean
  idUploaded: boolean
  stripePaid: boolean
  totpEnabled: boolean
}

export function allStepsDone(user: VerificationStatus) {
  return (
    user.emailVerified &&
    user.recaptchaDone &&
    user.idUploaded &&
    user.stripePaid &&
    user.totpEnabled
  )
}

export function generateVerificationCode() {
  return (
    "ATK-" +
    crypto.randomBytes(4).toString("hex").toUpperCase() +
    "-" +
    crypto.randomBytes(4).toString("hex").toUpperCase()
  )
}
