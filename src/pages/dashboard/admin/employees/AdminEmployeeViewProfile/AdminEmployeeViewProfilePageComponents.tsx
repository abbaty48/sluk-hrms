import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

interface InfoItemProps {
    icon: React.ElementType;
    label: string;
    value: string;
}

export function AEVPInfoItem({ icon: Icon, label, value }: InfoItemProps) {
    return (
        <div className="flex items-start gap-3 py-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-medium text-card-foreground">{value}</p>
            </div>
        </div>
    );
}

type TPageProps = {
    handleEdit?: () => void;
    handleBack: () => void;
    staffId?: string;
}
// ========================================
// EMPTY EMPLOYEE
// ========================================
export function AEVPEmptyEmployee({ handleBack }: { handleBack: TPageProps['handleBack'] }) {
    return (
        <div className="p-4">
            <Button variant="ghost" size="icon" onClick={handleBack}>
                <ArrowLeft className="h-5 w-5" />
            </Button>
            <Card className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-card rounded-xl shadow p-6 flex items-center gap-6 justify-center">
                <Avatar className="h-24 w-24">
                    <AvatarImage src={""} alt={"N/A"} />
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                        N/A
                    </AvatarFallback>
                </Avatar>

                <div>
                    <h2 className="text-2xl font-bold">Unknown User</h2>
                    <p className="text-muted-foreground">N/A · N/A</p>
                </div>

                <p className="text-sm text-muted-foreground mt-4">
                    We couldn't load the employee data. possibly due to a network issue or
                    the employee record doesn't exist. Please try again later or contact
                    support if the issue persists.
                </p>
            </Card>
        </div>
    )
}
