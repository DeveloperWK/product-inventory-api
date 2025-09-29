import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

async function hashPassword(password: string) {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw new Error("Error hashing password: " + (error as Error).message);
  }
}

async function verifyPassword(password: string, hashedPassword: string) {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    throw new Error("Error verifying password: " + (error as Error).message);
  }
}

export { hashPassword, verifyPassword };
