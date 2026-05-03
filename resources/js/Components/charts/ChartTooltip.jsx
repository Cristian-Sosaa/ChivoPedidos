// resources/js/Components/charts/ChartTooltip.jsx
export function ChartTooltip({ active, payload, label, formatter, labelFormatter }) {
    if (!active || !payload?.length) return null;

    return (
        <div className="px-3 py-2 text-xs border shadow-lg rounded-xl border-gray-200/60 bg-white/80 backdrop-blur-md">
            <p className="font-medium text-gray-500 mb-1.5">
                {labelFormatter ? labelFormatter(label) : label}
            </p>
            {payload.map((entry, i) => (
                <div key={i} className="flex items-center gap-2">
                    <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-gray-500">{entry.name}:</span>
                    <span className="font-semibold text-gray-900">
                        {formatter ? formatter(entry.value) : entry.value}
                    </span>
                </div>
            ))}
        </div>
    );
}