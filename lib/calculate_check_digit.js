export function calculateCheckDigit (isbn) {
  let check = 0

  if (isbn.length === 9) {
    for (let n = 0; n < 9; n += 1) {
      check += (10 - n) * isbn.charAt(n)
    }
    check = (11 - (check % 11)) % 11
    return check === 10 ? 'X' : String(check)
  } else if (isbn.length === 12) {
    for (let n = 0; n < 12; n += 2) {
      check += Number(isbn.charAt(n)) + 3 * isbn.charAt(n + 1)
    }
    return String((10 - (check % 10)) % 10)
  }

  return null
}
