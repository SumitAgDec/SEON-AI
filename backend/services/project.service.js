import ProjectModel from "../models/project.model.js";
import mongoose from 'mongoose';

export const createProject = async ({ name, userId }) => {
    if (!name) {
        throw new Error('Name is required');
    }

    if (!userId) {
        throw new Error('User ID is required');
    }


    let project;

    try {
        project = await ProjectModel.create({ name, users: [userId] });
    } catch (error) {
        if (error.code === 11000) {
            throw new Error('Project name must be unique');
        }
        throw error;

    }


    return project;
}

export const getAllProjectByUserId = async (userId) => {
    if (!userId) {
        throw new Error('User ID is required');
    }

    const allUserProjects = await ProjectModel.find({ users: userId });

    return allUserProjects;
}

export const addUserToProject = async ({ projectId, users, userId }) => {
    if (!projectId) {
        throw new Error('Project ID is required');
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error('Invalid Project ID');
    }

    if (!users || users.length === 0) {
        throw new Error('Users are required');
    }

    if (!Array.isArray(users) || users.some(userId => !mongoose.Types.ObjectId.isValid(userId))) {
        throw new Error('Invalid UserId(s) in users array')
    }

    if (!userId) {
        throw new Error('User ID is required');
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid User ID');
    }

    const project = await ProjectModel.findOne({ _id: projectId, users: userId });

    if (!project) {
        throw new Error('User not belong to this project');
    }

    const updatedProject = await ProjectModel.findOneAndUpdate(
        {
            _id: projectId
        },
        {
            $addToSet: {
                users: {
                    $each: users
                }
            }
        }, {
        new: true
    })

    return updatedProject;


}