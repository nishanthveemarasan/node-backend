exports.get404 = (req, res, next) => {
    console.log('Middleware 2');
    res.status(404).json({ message: 'Not Found' });
}