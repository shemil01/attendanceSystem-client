export default function StatusCard({ title, value, bgColor, textColor }) {
  return (
    <div className={`${bgColor} p-4 rounded-lg text-center`}>
      <h3 className={`text-sm font-medium ${textColor}`}>{title}</h3>
      <p className={`text-2xl font-bold mt-2 ${textColor}`}>{value}</p>
    </div>
  );
}