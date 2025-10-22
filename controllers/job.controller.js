import {Job} from "../models/job.model.js";

// Admin job posting
export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      position,
      companyId,
      experience,
    } = req.body;
    const userId = req.id;

    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !position ||
      !companyId ||
      !experience
    ) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    const job = await Job.create({
     title,
      description,
      requirements: requirements.split(","),
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: experience,
      position,
      company: companyId,
      created_by: userId,
    });
    return res
      .status(201)
      .json({ message: "Job posted successfully", job, status: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", status: false });
  }
};

// Users
export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };
    const jobs = await Job.find(query).populate({
      path: 'company',
    }).sort({createdAt:-1});
    if (!jobs) {
      return res.status(404).json({ message: "No job found", status: false });
    }
    return res.status(200).json({ jobs, status: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", status: false });
  }
};

// Users
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found", status: false });
    }
    return res.status(200).json({ job, status: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", status: false });
  }
};

// Admin job created

export const getAdminjobs = async (req, res) => {
  try {
    const adminId = req.id;
    const jobs = await Job.find({ created_by: adminId });
    if (!jobs) {
      return res.status(404).json({ message: "No job found", status: false });
    }
    return res.status(200).json({ jobs, status: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", status: false });
  }
};
