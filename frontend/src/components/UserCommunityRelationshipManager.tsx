import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Community, User } from "../interfaces";
import "./UserCommunityRelationshipManager.css";
import { toast } from "react-hot-toast";

interface MutationData {
    userId: string;
    communityId: string;
}

const UserCommunityRelationshipManager = () => {
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [selectedCommunity, setSelectedCommunity] = useState<string | null>(
        null
    );

    const queryClient = useQueryClient();

    const { data: users, isLoading: usersLoading } = useQuery({
        queryKey: ["users"],
        queryFn: () =>
            axios.get("http://localhost:8080/user").then((res) => res.data),
    });

    const { data: communities, isLoading: communitiesLoading } = useQuery({
        queryKey: ["communities"],
        queryFn: () =>
            axios
                .get("http://localhost:8080/community")
                .then((res) => res.data),
    });

    const isJoined = useMemo(() => {
        if (!users || !selectedUser || !selectedCommunity) return undefined;

        const user = users.find((item: User) => item._id === selectedUser);

        return user.community === selectedCommunity;
    }, [users, selectedUser, selectedCommunity]);

    const joinMutation = useMutation({
        mutationFn: (data: MutationData) =>
            axios.post(
                `http://localhost:8080/user/${data.userId}/join/${data.communityId}`
            ),
        onSuccess: () => {
            toast.success("Successfully joined the community");
            queryClient.invalidateQueries({ queryKey: ["users"] });
            queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
        },
        onError: (error: Error) => {
            toast.error(`Error: ${error.message}`);
        },
    });
    const leaveMutation = useMutation({
        mutationFn: (data: MutationData) =>
            axios.delete(
                `http://localhost:8080/user/${data.userId}/leave/${data.communityId}`
            ),
        onSuccess: () => {
            toast.success("Successfully left the community");
            queryClient.invalidateQueries({ queryKey: ["users"] });
            queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
        },
        onError: (error: Error) => {
            toast.error(`Error: ${error.message}`);
        },
    });

    const handleJoinClick = () => {
        if (selectedUser && selectedCommunity) {
            joinMutation.mutate({
                userId: selectedUser,
                communityId: selectedCommunity,
            });
        }
    };

    const handleLeaveClick = () => {
        if (selectedUser && selectedCommunity) {
            leaveMutation.mutate({
                userId: selectedUser,
                communityId: selectedCommunity,
            });
        }
    };

    if (usersLoading || communitiesLoading) return "Loading...";

    return (
        <div>
            <label>
                User: &nbsp;
                <select onChange={(e) => setSelectedUser(e.target.value)}>
                    <option value="">Select User</option>
                    {users.map((user: User) => (
                        <option key={user._id} value={user._id}>
                            {user.email}
                        </option>
                    ))}
                </select>
            </label>

            <label>
                Community: &nbsp;
                <select onChange={(e) => setSelectedCommunity(e.target.value)}>
                    <option value="">Select Community</option>
                    {communities.map((community: Community) => (
                        <option key={community._id} value={community._id}>
                            {community.name}
                        </option>
                    ))}
                </select>
            </label>

            <button
                className="join-button"
                onClick={handleJoinClick}
                disabled={
                    !selectedUser || !selectedCommunity || isJoined === true
                }
            >
                Join
            </button>

            <button
                className="leave-button"
                onClick={handleLeaveClick}
                disabled={
                    !selectedUser || !selectedCommunity || isJoined === false
                }
            >
                Leave
            </button>
        </div>
    );
};

export default UserCommunityRelationshipManager;
