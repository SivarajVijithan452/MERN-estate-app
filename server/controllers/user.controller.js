import User from '../models/user.model.js';
import cloudinary from '../utils/cloudinary.js';

export const updateUser = async (req, res, next) => {
    try {
        const { avatar } = req.body;
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'You must be logged in to update your profile'
            });
        }
        
        const userId = req.user.id;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: { avatar } },
            { new: true }
        );

        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
};

export const deleteImage = async (req, res) => {
  try {
    const { publicId } = req.body;
    
    if (!publicId) {
      return res.status(400).json({ message: 'Public ID is required' });
    }

    // console.log('Received publicId for deletion:', publicId);

    const result = await cloudinary.uploader.destroy(publicId);
    
    // console.log('Cloudinary delete result:', result);

    if (result.result === 'ok') {
      res.status(200).json({ 
        success: true,
        message: 'Image deleted successfully',
        result 
      });
    } else {
      res.status(400).json({ 
        success: false,
        message: 'Failed to delete image', 
        result 
      });
    }
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting image',
      error: error.message
    });
  }
};
