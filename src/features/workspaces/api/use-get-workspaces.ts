import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";


type Workspace = {
  $id: string;
  name: string;
  imageUrl?: string;
};

type WorkspaceList = {
  total: number;
  documents?: Workspace[];
};

export const useGetWorkspaces = () => {
    const query = useQuery<WorkspaceList>({
        queryKey: ["workspaces"],
        queryFn: async () => {
            const response = await client.api.workspaces.$get();

            if (!response.ok) {
                throw new Error("Failed to fetch workspaces");
            }

            const { data } = await response.json();

            return data as WorkspaceList;
        },
    });

    return query;
};