import { useApp } from "@/context/AppContext";

function ReminderMessage() {
  const { reminders } = useApp();

  if (reminders.length === 0) return null;

  return (
    <div className="p-4 bg-yellow-50 rounded-xl shadow">
      <h3 className="font-semibold mb-2">Reminders</h3>
      <ul>
        {reminders.map((r, i) => (
          <li key={i} className="text-sm text-gray-700">
            {r.message}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ReminderMessage;
