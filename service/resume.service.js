import Resume from "../models/resume.model.js";
import User from "../models/user.model.js";

export const createResume = async (req,res) => {
    try{
        const userId = req.user.id;

        const resume = new Resume({
            ...req.body,
            userId,
        });
        console.log(resume);

        await Promise.all([
            resume.save(),
            User.findByIdAndUpdate(userId, { $push: { resumes: resume._id } })
        ]);

        res.status(201).json({
            message: "Resume created successfully",
            resume,
        });
    }catch(error){
        console.error("Error creating resume:", error);
        res.status(500).json({ message: "Server error" });
    }
};


export const getUserResumes = async (req, res) => {
    try {
      const userId = req.user.id;
      const resumes = await Resume.find({ userId })
      .select("title createdAt updatedAt");
      console.log(resumes);
  
      res.status(200).json({ resumes });
    } catch (error) {
      console.error("Error fetching resumes:", error);
      res.status(500).json({ message: "Server error" });
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
            return res.status(404).json({ message: "Resume not found" });
        }

        res.status(200).json(resume);
    } catch (error) {
        console.error("Error fetching resume:", error);
        res.status(500).json({ message: "Server error" });
    }
};


// Update an existing resume
export const updateResume = async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
  
      // Find and update resume
      const updatedResume = await Resume.findOneAndUpdate(
        { _id: id, userId }, // ensure only owner can update
        req.body,            // update with incoming fields
        { new: true, runValidators: true }
      );
  
      if (!updatedResume) {
        return res.status(404).json({ message: "Resume not found" });
      }
  
      res.status(200).json(updatedResume);
    } catch (error) {
      console.error("Error updating resume:", error);
      res.status(500).json({ message: "Server error" });
    }
};


export const deleteResume = async (req, res) => {
    try{
        const userId = req.user.id;
        const { id } = req.params;

        const deleteResume = await Resume.findOneAndDelete({_id: id, userId});

        if(!deleteResume) {
            return res.status(404).json({ message: "Resume not found or not authorized" });
        }

        await User.findByIdAndUpdate(userId, { $pull: { resumes: id } });

        res.status(200).json({ message: "Resume deleted successfully" });

    }catch(error){
        console.error("Error deleting resume:", error);
        res.status(500).json({ message: "Server error" });
    }
};