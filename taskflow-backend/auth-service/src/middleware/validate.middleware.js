/**
 * validate.middleware.js — Runs Zod schema on req.body
 *
 * On success: puts clean data in req.validated
 * On failure: returns 400 with field errors
 */

export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: fieldErrors,
      });
    }

    req.validated = result.data;
    next();
  };
}
