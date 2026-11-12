function errorHandler(err, req, res, next) {

    console.error("========== ERROR ==========");
    console.error(err);
    console.error("===========================");

    return res.status(err.status || 500).json({
        success: false,
        message: err.message,
    });
}

export default errorHandler;