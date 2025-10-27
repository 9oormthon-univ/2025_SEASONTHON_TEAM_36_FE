import { useLayoutEffect, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelProps,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

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

interface CustomLabelProps extends LabelProps {
  activeBar: { index: number; dataKey: string } | null;
  dataKey: string;
}

const CustomLabel = ({ x, y, value, activeBar, dataKey, index }: CustomLabelProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(100); // 초기값 설정
  const [height, setHeight] = useState(30); // 초기값 설정

  useLayoutEffect(() => {
    if (ref.current) {
      setWidth(ref.current.offsetWidth);
      setHeight(ref.current.offsetHeight);
    }
  }, [value]);

  // 클릭된 Bar가 아니면 렌더링하지 않음
  if (!activeBar || activeBar.index !== index || activeBar.dataKey !== dataKey) {
    return null;
  }

  return (
    <foreignObject
      x={(x as number) - width / 2 + 6}
      y={(y as number) - 36}
      width={width || 100}
      height={height || 30}
      style={{ overflow: "visible" }}
    >
      <div
        ref={ref}
        style={{
          color: "var(--green-500)",
          fontSize: "var(--fs-md)",
          background: "white",
          border: "1px solid var(--green-500)",
          borderRadius: "7px",
          boxShadow:
            "-0.3px -0.3px 5px 0 var(--natural-color-natural-400, #D6D9E0), 0.3px 0.3px 5px 0 var(--natural-color-natural-400, #D6D9E0)",
          padding: "3px 28px",
          display: "inline-block",
          whiteSpace: "nowrap",
          zIndex: 1111111,
        }}
      >
        {`${value}시간`}
      </div>
    </foreignObject>
  );
};

const Chart2 = () => {
  const [activeBar, setActiveBar] = useState<{ index: number; dataKey: string } | null>(null);

  const handleBarClick = (data: any, index: number, dataKey: string) => {
    // 같은 Bar를 다시 클릭하면 토글
    if (activeBar?.index === index && activeBar?.dataKey === dataKey) {
      setActiveBar(null);
    } else {
      setActiveBar({ index, dataKey });
    }
  };

  return (
    <ResponsiveContainer width={"100%"} aspect={1.618}>
      <BarChart margin={{ top: 10, right: 5 }} data={data} style={{ paddingRight: "16px" }}>
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
        <Bar
          dataKey="최소"
          barSize={17}
          fill="#DEE1E6"
          cursor="pointer"
          activeBar={{ fill: "#86EC78" }}
          onClick={(data, index) => handleBarClick(data, index, "최소")}
          label={props => <CustomLabel {...props} activeBar={activeBar} dataKey="최소" />}
        />
        <Bar
          dataKey="최대"
          barSize={17}
          fill="#ABAFB7"
          cursor="pointer"
          activeBar={{ fill: "#0E7400" }}
          onClick={(data, index) => handleBarClick(data, index, "최대")}
          label={props => <CustomLabel {...props} activeBar={activeBar} dataKey="최대" />}
        />
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
                  gap: "0.5em",
                }}
              >
                {payload?.map((entry, index) => (
                  <li
                    key={`item-${index}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5em",
                      padding: "0.28em 0.25em",
                    }}
                  >
                    <div
                      style={{
                        width: "0.5em",
                        height: "0.5em",
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
    </ResponsiveContainer>
  );
};

export default Chart2;
