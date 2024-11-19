import Listing from "../models/listing.model.js"

export const createListing = async (req, res) => {
    try {
        const listing = await Listing.create(req.body);
        return res.status(201).json({
            success: true,
            message: "Listing Created Successfully!",
            data: listing
        })
    } catch (error) {
        console.log("error", error);
    }
}