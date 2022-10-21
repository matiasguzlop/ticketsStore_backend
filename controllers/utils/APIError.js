class APIError extends Error {
  constructor(code) {
    super(`API Error, code: ${code}`);
    this.code = code;
  }
}

module.exports = APIError;
