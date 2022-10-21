const handleErrors = (error, res) => {
  let status = 500;
  let reason = 'Unkown error.';
  if ('code' in error) {
    switch (error.code) {
      case 0:
        reason = 'Not found';
        status = 404;
        break;
      case 1:
        reason = 'Not authorized';
        status = 401;
        break;
      default:
        break;
    }
  } else {
    console.log(error);
  }
  res.status(status).json({ message: { reason } });
};

module.exports = handleErrors;
