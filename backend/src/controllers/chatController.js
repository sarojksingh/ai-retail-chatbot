//import prisma from "../prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
//import { ApiError } from "../utils/ApiError.js";
import { detectIntent } from "../services/chatService.js";

export const chatHandler = asyncHandler( async (req, res) => {


    const { message } = req.body;

    if (!message) {
        return res.status(400).json({
            error: { message: "Message is required!" }
        });
    }

    const intentData = detectIntent(message);

    let response;

    switch (intentData.intent) {
        case "GREETING":
            response: "Hello! How canI help you today?";
            break;
        case "PRODUCT_SEARCH":
            response: `Searching for: ${intentData.query}`;
            break;
        case "ADD_TO_CART":
            response: `Adding item to cart ${intentData.query}`;
            break;
        case "VIEW_CART":
            response: "Here is your cart.";
            break;

        default:
            response: "Sorry! I didn't understand that.";
            break;
    }

    res.json({
        intent: intentData.intent,
        reply: response
    });

});

