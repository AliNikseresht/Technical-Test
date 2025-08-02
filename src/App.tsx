import { ChartRenderer } from "./components/ChartRenderer";
import rawData from "./data/data.json";
import type { ChartData } from "./types/globals";

const chartData = rawData as ChartData[];

function App() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Charts</h1>
      {chartData.map((chart, index) => (
        <ChartRenderer key={index} chart={chart} />
      ))}
    </div>
  );
}

export default App;
