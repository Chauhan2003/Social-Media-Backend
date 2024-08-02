import bcrypt from "bcryptjs";

export const hashString = async (data) => {
  const result = await bcrypt.hash(data, 10);
  return result;
};

export const compareHash = async (data, hashedData) => {
  const result = await bcrypt.compare(data, hashedData);
  return result;
};
