
import { asyncHandler } from "../utils/asyncHandler.js";
//import { ApiError } from "../utils/ApiError.js";
import { handleChat } from "../services/chatService.js";
import { productProvider } from "../providers/productProvider.js";
import { cartProvider } from "../providers/cartProvider.js";

export const chatHandler = asyncHandler( async (req, res) => {

    const { message } = req.body;

    if (!message) {
        return res.status(400).json({
            error: { message: "Message is required!" }
        });
    }

    const response = await handleChat(
        message,
        req.user.id,
        {
            productProvider,
            cartProvider
        }
    );

    res.json(response);

});

