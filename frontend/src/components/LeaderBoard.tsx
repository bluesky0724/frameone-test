import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import DataTable, { TableColumn } from "react-data-table-component";

interface LeaderBoardItem {
    logo: string;
    name: string;
    totalExperiencePoints: number;
    numberOfUsers: number;
}

const columns: TableColumn<LeaderBoardItem>[] = [
    {
        name: "Rank",
        selector: (row: LeaderBoardItem, rowIndex?: number) =>
            (rowIndex ?? 0) + 1,
        sortable: true,
    },
    {
        name: "Logo",
        sortable: true,
        cell: (row: LeaderBoardItem) => (
            <img src={row.logo} width={30} height={30} />
        ),
    },
    {
        name: "Name",
        selector: (row: LeaderBoardItem) => row.name,
        sortable: true,
    },
    {
        name: "Total Experience Points",
        selector: (row: LeaderBoardItem) => row.totalExperiencePoints,
        sortable: true,
    },
    {
        name: "Number of users",
        selector: (row: LeaderBoardItem) => row.numberOfUsers,
        sortable: true,
    },
];

const CommunityLeaderBoard = () => {
    const { data: leaderboardRows, isLoading: leaderBoardLoading } = useQuery({
        queryKey: ["leaderboard"],
        queryFn: () =>
            axios
                .get("http://localhost:8080/community/leaderboard")
                .then((res) => res.data),
    });
    return (
        <>
            {leaderBoardLoading ? (
                <>Loading...</>
            ) : (
                <DataTable columns={columns} data={leaderboardRows} />
            )}
        </>
    );
};

export default CommunityLeaderBoard;
