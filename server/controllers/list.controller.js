import Listing from "../models/listing.model.js"

export const createListing = async (req, res) => {
    try {
        const listing = await Listing.create(req.body);
        return res.status(201).json({
            success: true,
            message: "Listing Created Successfully!",
            data: listing
        });
    } catch (error) {
        console.log("error", error);
        res.status(500).json({
            success: false,
            message: "Error creating listing",
            error: error.message
        });
    }
}

export const deleteListing = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return res.status(404).json({
                success: false,
                message: "Listing not found"
            });
        }
        if(req.user.id !== listing.userRef){
            return res.status(403).json({
                success: false,
                message: "Unauthorized to delete this listing"
            });
        }
        await Listing.findByIdAndDelete(req.params.id);
        return res.status(200).json({
            success: true,
            message: "Listing deleted successfully"
        });
    } catch (error) {
        console.log("error", error);
        res.status(500).json({
            success: false,
            message: "Error deleting listing",
            error: error.message
        });
    }
}

export const updateListing = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return res.status(404).json({
                success: false,
                message: "Listing not found"
            });
        }
        if(req.user.id !== listing.userRef) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to update this listing"
            })
        }
        const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, {new : true});
        return res.status(200).json({
            success: true,
            message: "Listing Updated successfully"
        });
    } catch (error) {
        console.log(error);
    }
}
