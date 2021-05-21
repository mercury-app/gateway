module.exports = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log("Error handler:", err);
    ctx.status = err.status || 500;
    ctx.body = {
      status: "failed",
      message: err.message || "Internal server error"
    };
  }
};
