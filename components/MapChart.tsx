import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';

// India state-level GeoJSON source
const INDIA_STATE_JSON = "https://raw.githubusercontent.com/geohacker/india/master/state/india_state.geojson";

// Dummy data for state-wise complaints
const stateComplaintData = [
    { id: "Maharashtra", value: 450 },
    { id: "Karnataka", value: 380 },
    { id: "Delhi", value: 520 },
    { id: "Tamil Nadu", value: 310 },
    { id: "Uttar Pradesh", value: 290 },
    { id: "West Bengal", value: 240 },
    { id: "Gujarat", value: 210 },
    { id: "Rajasthan", value: 180 },
    { id: "Kerala", value: 150 },
    { id: "Telangana", value: 270 },
    { id: "Andhra Pradesh", value: 190 },
    { id: "Madhya Pradesh", value: 160 },
    { id: "Bihar", value: 140 },
    { id: "Punjab", value: 120 },
    { id: "Haryana", value: 130 },
    { id: "Odisha", value: 110 },
    { id: "Assam", value: 90 },
    { id: "Chhattisgarh", value: 80 },
    { id: "Jharkhand", value: 70 },
    { id: "Uttarakhand", value: 60 },
    { id: "Himachal Pradesh", value: 50 },
    { id: "Goa", value: 40 },
    { id: "Jammu & Kashmir", value: 100 },
];

const colorScale = scaleLinear<string>()
    .domain([0, 600])
    .range(["#eff6ff", "#1d4ed8"]); // From Light Blue to Dark Blue

const MapChart: React.FC = () => {
    const [tooltipContent, setTooltipContent] = useState("");

    return (
        <div className="relative w-full h-[600px] bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <i className="fas fa-map-marked-alt text-blue-500"></i> Complaint Distribution by State
                    </h3>
                    <p className="text-slate-500 text-sm mt-1">Interactive heatmap showing reported incidents across India</p>
                </div>

                {tooltipContent && (
                    <div className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                        {tooltipContent}
                    </div>
                )}
            </div>

            <div className="w-full h-[600px] flex items-center justify-center bg-slate-50 rounded-3xl relative overflow-hidden border border-slate-100">
                <ComposableMap
                    projection="geoMercator"
                    projectionConfig={{
                        scale: 850,
                        center: [82, 18], // Adjusted to center India better
                    }}
                    width={800}
                    height={600}
                    style={{ width: "100%", height: "100%" }}
                >
                    <Geographies geography={INDIA_STATE_JSON}>
                        {({ geographies }) =>
                            geographies.map((geo) => {
                                const stateName = geo.properties.NAME_1 || geo.properties.st_nm;
                                const d = stateComplaintData.find((s) =>
                                    s.id.toLowerCase() === stateName.toLowerCase() ||
                                    (stateName === "NCT of Delhi" && s.id === "Delhi")
                                );

                                return (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        onMouseEnter={() => {
                                            const val = d ? d.value : "No data";
                                            setTooltipContent(`${stateName}: ${val} complaints`);
                                        }}
                                        onMouseLeave={() => {
                                            setTooltipContent("");
                                        }}
                                        style={{
                                            default: {
                                                fill: d ? colorScale(d.value) : "#f8fafc",
                                                stroke: "#ffffff",
                                                strokeWidth: 1.5,
                                                outline: "none",
                                                transition: "all 250ms",
                                            },
                                            hover: {
                                                fill: "#3b82f6",
                                                stroke: "#ffffff",
                                                strokeWidth: 2,
                                                outline: "none",
                                                cursor: "pointer",
                                            },
                                            pressed: {
                                                fill: "#1e3a8a",
                                                outline: "none",
                                            },
                                        }}
                                    />
                                );
                            })
                        }
                    </Geographies>
                </ComposableMap>
            </div>

            <div className="absolute bottom-8 right-8 bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-3">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Complaint Density</h4>
                <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-md bg-blue-50 border border-slate-200"></div>
                    <span className="text-xs font-semibold text-slate-600">Low (0 - 100)</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-md" style={{ backgroundColor: colorScale(300) }}></div>
                    <span className="text-xs font-semibold text-slate-600">Medium (100 - 400)</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-md bg-blue-700"></div>
                    <span className="text-xs font-semibold text-slate-600">High (400+)</span>
                </div>
            </div>
        </div>
    );
};

export default MapChart;
