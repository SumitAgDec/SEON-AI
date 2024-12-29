import ProjectModel from "../models/project.model.js";

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