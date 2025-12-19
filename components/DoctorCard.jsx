export default function DoctorCard({ doctor, onBook }) {
  const dates = doctor.availableSlots ? Object.keys(doctor.availableSlots) : [];

  return (
    <div className="border p-6 rounded-lg shadow hover:shadow-xl transition bg-white">
      <h3 className="text-2xl font-bold text-blue-700">{doctor.name}</h3>
      <p className="text-gray-600 text-lg">{doctor.specialty}</p>
      <p className="text-sm text-gray-500 mt-2">{doctor.email}</p>
      <div className="mt-4">
        <p className="font-semibold">Available Dates:</p>
        <div className="text-sm text-gray-600">
          {dates.slice(0, 3).map(date => (
            <span key={date} className="mr-3">{date} ({doctor.availableSlots[date].length} slots)</span>
          ))}
          {dates.length > 3 && <span>...</span>}
        </div>
      </div>
      <button onClick={() => onBook(doctor)} className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition">
        View & Book Slots
      </button>
    </div>
  );
}