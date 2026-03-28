import { body } from "express-validator";
export const addProductValidator = [
    body("title").notEmpty().withMessage("Title is required"),
    body("price").isFloat({ gt: 0 }).withMessage("Price must be a positive number"),
    body("description").notEmpty().withMessage("Description is required"),
    // body("imageUrl").isURL().withMessage("Image URL must be a valid URL")
];

export const updateProductValidator = [
    body("title").optional().notEmpty().withMessage("Title cannot be empty"),
    body("price").optional().isFloat({ gt: 0 }).withMessage("Price must be a positive number"),
    body("description").optional().notEmpty().withMessage("Description cannot be empty"),
    body("imageUrl").optional().isURL().withMessage("Image URL must be a valid URL")
];