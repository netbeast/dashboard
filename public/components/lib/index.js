/* global localStorage */

export class Session {
  static save (key, value) {
    if (typeof value !== 'string') value = JSON.stringify(value)
    localStorage.setItem(key, value)
  }

  static load (key) {
    return JSON.parse(localStorage.getItem(key))
  }
}

export class API {
  static install (app) {
    return app
  }
}

export default { Session, API }
