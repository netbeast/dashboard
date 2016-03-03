// Accepts number of devices 'n', return coords {x, y}. If array is a truthful value
// returns [x, y]

export function _coords (n, array) {
  const r = 140 + Math.floor(n / 6) * 80
  const N = 6
  const w = Math.floor(n / 6) * 1 / 12

  const result = {
    x: r * Math.cos(2 * Math.PI * (n / N + w)),
    y: r * Math.sin(2 * Math.PI * (n / N + w))
  }

  if (array) return [result.x, result.y]
  else return result
}
