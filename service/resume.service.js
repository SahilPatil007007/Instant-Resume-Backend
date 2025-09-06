import Resume from "../models/resume.model.js";
import User from "../models/user.model.js";
import cloudinary from "../utils/cloudinary.js";

const isDataUrl = (value) => typeof value === 'string' && value.startsWith('data:');

const uploadPhotoIfNeeded = async (personalInfo) => {
    if (!personalInfo) return personalInfo;
    const result = { ...personalInfo };
    if (result.photoUrl && isDataUrl(result.photoUrl)) {
        const upload = await cloudinary.uploader.upload(result.photoUrl, {
            folder: process.env.CLOUDINARY_FOLDER || 'instant-resume/photos',
            resource_type: 'image',
            transformation: [{ width: 600, height: 600, crop: 'limit' }]
        });
        result.photoUrl = upload.secure_url;
    }
    return result;
};

export const createResume = async (req,res) => {
    try{
        const userId = req.user.id;
        
        const processedPersonalInfo = await uploadPhotoIfNeeded(req.body.personalInfo);
        
        const resume = new Resume({
            ...req.body,
            personalInfo: processedPersonalInfo,
            userId,
        });

        await Promise.all([
            resume.save(),
            User.findByIdAndUpdate(userId, { $push: { resumes: resume._id } })
        ]);

        res.status(201).json({
            message: "Resume created successfully",
            resume,
        });
    }catch(error){
        console.error('Create resume error:', error);
        res.status(500).json({ message: "Failed to create resume. Please try again." });
    }
};


export const getUserResumes = async (req, res) => {
    try {
      const userId = req.user.id;
      const resumes = await Resume.find({ userId })
      .select("title createdAt updatedAt");
  
      res.status(200).json({ resumes });
    } catch (error) {
      console.error('Get resumes error:', error);
      res.status(500).json({ message: "Failed to fetch resumes. Please try again." });
    }
  };
  


// Fetch a single resume
export const getResumeById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Find resume and ensure it belongs to the logged-in user
        const resume = await Resume.findOne({ _id: id, userId });
        if (!resume) {
            return res.status(404).json({ message: "Resume not found or you don't have permission to access it" });
        }

        res.status(200).json(resume);
    } catch (error) {
        console.error('Get resume by ID error:', error);
        res.status(500).json({ message: "Failed to fetch resume. Please try again." });
    }
};


// Update an existing resume
export const updateResume = async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const processedPersonalInfo = await uploadPhotoIfNeeded(req.body.personalInfo);

      // Find and update resume
      const updatedResume = await Resume.findOneAndUpdate(
        { _id: id, userId }, // ensure only owner can update
        { ...req.body, personalInfo: processedPersonalInfo },            // update with incoming fields
        { new: true, runValidators: true }
      );
  
      if (!updatedResume) {
        return res.status(404).json({ message: "Resume not found or you don't have permission to update it" });
      }
  
      res.status(200).json(updatedResume);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
};


export const deleteResume = async (req, res) => {
    try{
        const userId = req.user.id;
        const { id } = req.params;

        const deleteResume = await Resume.findOneAndDelete({_id: id, userId});

        if(!deleteResume) {
            return res.status(404).json({ message: "Resume not found or you don't have permission to delete it" });
        }

        await User.findByIdAndUpdate(userId, { $pull: { resumes: id } });

        res.status(200).json({ message: "Resume deleted successfully" });

    }catch(error){
        res.status(500).json({ message: "Server error" });
    }
};