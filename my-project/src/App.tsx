import rawData from "./data/data.json";
import ChartRenderer from "./components/ChartRenderer";
import type { ChartData } from "./types/globals";

const chartData = rawData as ChartData[];

function App() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Charts</h1>
      <div className="flex justify-around items-center">
        {chartData.map((chart, index) => (
          <ChartRenderer key={index} chart={chart} />
        ))}
      </div>
    </div>
  );
}

export default App;
