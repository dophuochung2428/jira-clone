import { Loader } from "lucide-react";

const DashboardLoading = () => {
    return (
        <div className="w-full flex items-center justify-center">
            <Loader className="size-6 animate-spin text-muted-foreground"/>
        </div>
    );
};

export default DashboardLoading;