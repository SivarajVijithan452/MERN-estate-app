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
            message: "Listing Updated successfully",
            data: updatedListing
        });
    } catch (error) {
        console.log(error);
    }
}

export const getListing = async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({
            success: false,
            message: "Listing ID not provided"
        });
    }

    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return res.status(404).json({
                success: false,
                message: "Listing not found"
            });
        }
        return res.status(200).json({
            success: true,
            data: listing
        });
    } catch (error) {
        console.log("error", error);
        res.status(500).json({
            success: false,
            message: "Error getting listing",
            error: error.message
        });
    }
}

export const getListings = async (req, res) => {
    try {
      res.set('Cache-Control', 'no-store');  // Prevent caching in the browser
  
      // Log incoming request params
      console.log('Request Parameters:', req.query);
  
      const limit = parseInt(req.query.limit) || 9;
      const startIndex = parseInt(req.query.startIndex) || 0;
  
      let offer = req.query.offer;
      if (offer === 'undefined' || offer === 'false') {
        offer = { $in: [false, true] };
      }
  
      let furnished = req.query.furnished;
      if (furnished === 'undefined' || furnished === 'false') {
        furnished = { $in: [false, true] };
      }
  
      let parking = req.query.parking;
      if (parking === 'undefined' || parking === 'false') {
        parking = { $in: [false, true] };
      }
  
      let type = req.query.type;
      if (type === 'undefined' || type === 'all') {
        type = { $in: ['sale', 'rent'] };
      }
  
      const searchTerm = req.query.searchTerm ? String(req.query.searchTerm) : ''; // Ensure searchTerm is a string
      const sort = req.query.sort || 'createdAt';
      const order = req.query.order || 'desc';
  
      // Log query string being used to fetch data
      console.log('Fetching listings with query:', {
        offer,
        furnished,
        parking,
        type,
        searchTerm,
        sort,
        order,
      });
  
      const listings = await Listing.find({
        offer,
        furnished,
        parking,
        type,
        name: {
          $regex: searchTerm,
          $options: 'i', // Case-insensitive search
        },
      })
        .sort({ [sort]: order })
        .limit(limit)
        .skip(startIndex);
  
      // Log fetched data
      console.log('Listings fetched:', listings);
  
      return res.status(200).json({
        success: true,
        listings,
      });
    } catch (error) {
      console.log('Error getting listings:', error);
      return res.status(500).json({
        success: false,
        message: "Error getting listings",
        error: error.message,
      });
    }
  };
  

