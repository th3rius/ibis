export const token = () => {
  return Math.floor(Math.random() * (2 ** 32 - 1))
}
