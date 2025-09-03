export default function RoutesBox() {
  const suggestions = [
    {
      key: "fastest",
      title: "Fastest",
      desc: "Reach your destination in the shortest time.",
      // iske neeche jo routes calculate hoge vo rakhege and description hata dete hai titles are enough
    },
    {
      key: "cheapest",
      title: "Least Cost",
      desc: "Save money with the cheapest option.",
    },
    {
      key: "minimal",
      title: "Minimal Switches",
      desc: "Avoid hassle with fewer transfers.",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 space-y-4">
        {suggestions.map((s) => (
          <div
            key={s.key}
            className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition"
          >
            <h2 className="text-base font-semibold text-gray-800">{s.title}</h2>
            <p className="mt-1 ml-2 text-gray-600 text-sm">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}