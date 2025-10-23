import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  {
    name: "9월 1주",
    달성률: 25,
  },
  {
    name: "9월 2주",
    달성률: 64,
  },
  {
    name: "9월 3주",
    달성률: 44,
  },
  {
    name: "9월 4주",
    달성률: 88,
  },
];

const Chart1 = () => {
  return (
    <LineChart
      style={{
        width: "100%",
        aspectRatio: 1.618,
        maxWidth: 600,
        paddingRight: "16px",
      }}
      data={data}
    >
      <CartesianGrid stroke="rgba(0, 0, 42, 0.15)" strokeDasharray="3 3" vertical={false} />
      <defs>
        <filter id="dualShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur1" />
          <feOffset in="blur1" dx="6" dy="0" result="off1" />
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur2" />
          <feOffset in="blur2" dx="-6" dy="0" result="off2" />
          <feFlood floodColor="#3CC3DF" floodOpacity="0.4" result="color1" />
          <feComposite in="color1" in2="off1" operator="in" result="shadow1" />
          <feFlood floodColor="#3CC3DF" floodOpacity="0.4" result="color2" />
          <feComposite in="color2" in2="off2" operator="in" result="shadow2" />
          <feMerge>
            <feMergeNode in="shadow1" />
            <feMergeNode in="shadow2" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <XAxis
        dataKey="name"
        tickLine={false}
        tickMargin={4}
        interval={"preserveStartEnd"}
        padding={{ left: 35, right: 35 }}
        fontWeight={500}
        stroke="#6f737b"
        tick={{ fill: "#000", fontSize: 12, fontWeight: 500 }}
      />
      <YAxis
        axisLine={false}
        stroke="#6f737b"
        tickLine={false}
        ticks={[0, 20, 40, 60, 80, 100]}
        tick={({ x, y, payload }: { x: number; y: number; payload: { value: number } }) => {
          const value: number = payload.value;
          return (
            <text x={x - 28} y={y - 4} textAnchor="start" fill="#6f737b" fontSize={12}>
              {`${value}%`}
            </text>
          );
        }}
      />
      <Line
        dataKey="달성률"
        stroke="#0e7400"
        strokeLinecap="round"
        isAnimationActive={false}
        style={{ filter: "url(#dualShadow)" }}
      />
      <Tooltip isAnimationActive={false} />
    </LineChart>
  );
};

export default Chart1;
