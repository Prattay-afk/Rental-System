import { Card } from "./ui/card";
import { MoreVertical } from "lucide-react";

const MapView = () => {
    return (
        <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Map View</h3>
                <button className="text-muted-foreground hover:text-foreground">
                    <MoreVertical className="w-5 h-5" />
                </button>
            </div>
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=800&h=800&fit=crop"
                    alt="Map"
                    className="w-full h-full object-cover opacity-80"
                />
            </div>
        </Card>
    );
};

export default MapView;
