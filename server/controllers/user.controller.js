import User from '../models/user.model.js';
import cloudinary from '../utils/cloudinary.js';
import bcrypt from 'bcryptjs';
// import { sendUpdateNotification } from '../utils/emailService.js';


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
        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: rest
        });
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

export const updateUserInfo = async (req, res) => {
    try {
        if (req.user.id !== req.params.id) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized to update this user'
            });
        }

        // Get the user before update to compare changes
        // const currentUser = await User.findById(req.params.id);
        // const changes = [];

        // Track what's being updated
        // if (req.body.username && req.body.username !== currentUser.username) {
        //     changes.push('username');
        // }
        // if (req.body.email && req.body.email !== currentUser.email) {
        //     changes.push('email');
        // }
        // if (req.body.password) {
        //     changes.push('password');
        //     req.body.password = await bcrypt.hash(req.body.password, 10);
        // }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password
                }
            },
            { new: true }
        );

        // Send email notifications for each change
        // for (const changeType of changes) {
        //     try {
        //         await sendUpdateNotification(
        //             req.body.email || currentUser.email, // Use new email if changed, otherwise use existing
        //             changeType
        //         );
        //     } catch (emailError) {
        //         console.error(`Failed to send ${changeType} update notification:`, emailError);
        //         // Continue with other operations even if email fails
        //     }
        // }

        const { password, ...rest } = updatedUser._doc;
        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: rest
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating user',
            error: error.message
        });
    }
}

export const deleteUser = async (req, res) => {
    try {
        if (req.user.id !== req.params.id) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized to delete this user'
            });
        }

        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.clearCookie('access_token');
        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
            data: deletedUser
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting user',
            error: error.message
        });
    }
};
