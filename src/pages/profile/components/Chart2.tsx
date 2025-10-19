import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  {
    name: "9월 1주",
    최대: 10,
    최소: 2,
  },
  {
    name: "9월 2주",
    최대: 11,
    최소: 4,
  },
  {
    name: "9월 3주",
    최대: 12,
    최소: 6,
  },
  {
    name: "9월 4주",
    최대: 14,
    최소: 8,
  },
];

const Chart2 = () => {
  return (
    <>
      <BarChart
        style={{
          width: "100%",
          aspectRatio: 1.618,
          paddingRight: "16px",
        }}
        margin={{ top: 10, right: 5 }}
        data={data}
      >
        <CartesianGrid stroke="rgba(0, 0, 42, 0.15)" strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="name"
          tickLine={false}
          tickMargin={4}
          interval={"preserveStartEnd"}
          fontWeight={500}
          stroke="#6f737b"
          tick={{ fill: "#000", fontSize: 12, fontWeight: 500 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          stroke="#6f737b"
          tick={{ fill: "#6f737b", fontSize: 12 }}
          tickCount={7}
        />
        <Bar dataKey="최소" barSize={17} fill="#86EC78" activeBar={false} />
        <Bar dataKey="최대" barSize={17} fill="#0E7400" activeBar={false} />
        <Tooltip cursor={false} isAnimationActive={false} />
        <Legend
          wrapperStyle={{ width: "100%" }}
          content={props => {
            const { payload } = props;

            return (
              <ul
                style={{
                  display: "flex",
                  flexDirection: "row-reverse",
                  justifyContent: "center",
                  fontSize: "clamp(0.7rem, 2.20vw, 0.8rem)",
                  listStyleType: "none",
                  gap: "0.5em", // 8px -> 0.5em (relative to font size)
                }}
              >
                {payload?.map((entry, index) => (
                  <li
                    key={`item-${index}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5em", // 8px -> 0.5em
                      padding: "0.28em 0.25em", // 4.5px 4px -> em values
                    }}
                  >
                    <div
                      style={{
                        width: "0.5em", // 8px -> 0.5em
                        height: "0.5em", // 8px -> 0.5em
                        background: index === 0 ? "#0E7400" : "#86EC78",
                      }}
                    ></div>
                    <span style={{ display: "block", fontWeight: "400" }}>{entry.value}</span>
                  </li>
                ))}
              </ul>
            );
          }}
        />
      </BarChart>
    </>
  );
};

export default Chart2;
