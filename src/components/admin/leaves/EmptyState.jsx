import { Clock } from "lucide-react";

const EmptyState = () => (
  <div className="text-center py-12">
    <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      No Pending Leave Requests
    </h3>
    <p className="text-gray-500">All leave requests have been processed.</p>
  </div>
);

export default EmptyState;
