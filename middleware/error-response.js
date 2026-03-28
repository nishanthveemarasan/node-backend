const errorResponseMiddleware = (err, req, res, next) => {
    console.error(err);
    const status = err.httpStatusCode || 500;
    res.status(status).json({ message: err.message || 'Internal Server Error' });
}

export default errorResponseMiddleware;