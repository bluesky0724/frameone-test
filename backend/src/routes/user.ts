import express from "express";
import { UserModel, CommunityModel } from "../models/index";

const userRouter = express.Router();

/**
 * @route GET /user/:id
 * @param {string} id - User ID
 * @returns {User} - User object with experiencePoints field
 */
userRouter.get("/:id", async (req, res) => {
    const user = await UserModel.findById(req.params.id).select(
        "+experiencePoints"
    );
    if (!user) {
        return res.status(404).send({ message: "User not found" });
    }
    res.send(user);
});

/**
 * @route GET /user
 * @returns {Array} - Array of User objects
 * @note Adds the virtual field of totalExperience to the user.
 * @hint You might want to use a similar aggregate in your leaderboard code.
 */
userRouter.get("/", async (_, res) => {
    const users = await UserModel.aggregate([
        {
            $unwind: "$experiencePoints",
        },
        {
            $group: {
                _id: "$_id",
                email: { $first: "$email" },
                profilePicture: { $first: "$profilePicture" },
                totalExperience: { $sum: "$experiencePoints.points" },
            },
        },
    ]);
    res.send(users);
});

/**
 * @route POST /user/:userId/join/:communityId
 * @param {string} userId - User ID
 * @param {string} communityId - Community ID
 * @description Joins a community
 */
userRouter.post("/:userId/join/:communityId", async (req, res) => {
    const { userId, communityId } = req.params;
    // TODO: Implement the functionality to join a community
    try {
        const user = await UserModel.findById(userId);
        const community = await CommunityModel.findById(communityId);

        if (!user || !community) {
            return res
                .status(404)
                .send({ message: "User or Community not found" });
        }

        if (user.community && user.community.toString() === communityId) {
            return res.status(400).send({
                message: "User is already a member of this community",
            });
        }

        if (user.community) {
            const previousCommunity = await CommunityModel.findById(
                user.community
            );
            if (previousCommunity) {
                previousCommunity.members = previousCommunity.members?.filter(
                    (member) => member.toString() !== userId
                );
                await previousCommunity.save();
            }
        }

        user.community = community._id;
        community.members?.push(user._id);

        await user.save();
        await community.save();

        res.status(200).send({ message: "Joined community successfully" });
    } catch (error: any) {
        res.status(500).send({ message: error.message });
    }
});

/**
 * @route DELETE /user/:userId/leave/:communityId
 * @param {string} userId - User ID
 * @param {string} communityId - Community ID
 * @description leaves a community
 */
userRouter.delete("/:userId/leave/:communityId", async (req, res) => {
    const { userId, communityId } = req.params;
    // TODO: Implement the functionality to leave a community

    try {
        const user = await UserModel.findById(userId);
        const community = await CommunityModel.findById(communityId);

        if (!user || !community) {
            return res
                .status(404)
                .send({ message: "User or Community not found" });
        }

        if (user.community && user.community.toString() !== communityId) {
            return res
                .status(400)
                .send({ message: "User is not a member of this community" });
        }

        user.community = undefined;
        community.members = community.members?.filter(
            (member) => member.toString() !== userId
        );

        await user.save();
        await community.save();

        res.status(200).send({ message: "Left community successfully" });
    } catch (error: any) {
        res.status(500).send({ message: error.message });
    }
});

export { userRouter };
