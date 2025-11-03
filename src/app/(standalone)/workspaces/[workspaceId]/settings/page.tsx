import { getCurrent } from "@/features/auth/actions";
import { getWorkspace } from "@/features/workspaces/actions";
import { EditWorkspaceForm } from "@/features/workspaces/components/edit-workspace-form";
import { redirect } from "next/navigation";

interface WorkspaceIdSettingProps {
    params: {
        workspaceId: string;
    };
};

const WorkspaceIdSettingPage = async ({
    params,
}: WorkspaceIdSettingProps) => {
    const { workspaceId } = await params;

    const user = await getCurrent();
    if (!user) redirect("/sign-in");

    const initialValue = await getWorkspace({ workspaceId });

    if (!initialValue) {
        redirect(`/workspaces/${params.workspaceId}`);
    }

    return (
        <div className="w-full lg:max-w-xl">
            <EditWorkspaceForm initialValues={initialValue} />
        </div>
    );
};

export default WorkspaceIdSettingPage;