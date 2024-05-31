import express from "express";
import { CommunityModel } from "../models/index";
import { User } from "../models/index";

const communityRouter = express.Router();

/**
 * @route GET /leaderboard
 * @description Gets the community leaderboard
 */
communityRouter.get("/leaderboard", async (req, res) => {
    try {
        const communities = await CommunityModel.find()
            .populate("members")
            .exec();

        const leaderboard = communities.map((community) => {
            const totalExperiencePoints =
                community.members?.reduce((total, member) => {
                    const user = member as User;
                    const userExperiencePoints =
                        user.experiencePoints?.reduce(
                            (sum, exp) => sum + exp.points,
                            0
                        ) || 0;

                    return total + userExperiencePoints;
                }, 0) || 0;

            return {
                logo: community.logo,
                name: community.name,
                totalExperiencePoints,
                numberOfUsers: community.members?.length || 0,
            };
        });

        leaderboard.sort(
            (a, b) => b.totalExperiencePoints - a.totalExperiencePoints
        );

        res.status(200).send(leaderboard);
    } catch (error: any) {
        res.status(500).send({ message: error.message });
    }
});

/**
 * @route GET /community/:id
 * @param {string} id - Community ID
 * @returns {Community} - Community object
 */
communityRouter.get("/:id", async (req, res) => {
    const community = await CommunityModel.findById(req.params.id).lean();
    if (!community) {
        return res.status(404).send({ message: "Community not found" });
    }
    res.send(community);
});

/**
 * @route GET /community
 * @returns {Array} - Array of Community objects
 */
communityRouter.get("/", async (_, res) => {
    const communities = await CommunityModel.find({}).lean();
    res.send(communities);
});

export { communityRouter };

export default communityRouter;
