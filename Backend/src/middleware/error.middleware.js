function errorHandler(err, req, res, next) {

    return res.status(500).json({
        success: false,
        message: err.message,
    });

}

export default errorHandler;