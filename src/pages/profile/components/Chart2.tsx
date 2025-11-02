import { useLayoutEffect, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelProps,
  Legend,
  Rectangle,
  RectangleProps,
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
  x?: string | number;
  y?: string | number;
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

  // x, y가 유효한 숫자가 아니면 렌더링하지 않음
  if (typeof x !== "number" || typeof y !== "number") {
    return null;
  }

  // 클릭된 Bar가 아니면 렌더링하지 않음
  if (!activeBar || activeBar.index !== index || activeBar.dataKey !== dataKey) {
    return null;
  }

  return (
    <foreignObject
      x={x - width / 2 + 6}
      y={-22}
      width={width || 100}
      height={height || 30}
      style={{ overflow: "visible", position: "relative" }}
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
      <div
        style={{
          width: "2px",
          height: `${y - 4}px`,
          background: dataKey === "최대" ? "green" : "lightgreen",
          position: "absolute",
          left: `${width / 2 + 1.5}px`,
        }}
      ></div>
    </foreignObject>
  );
};

interface CustomActiveBarProps extends RectangleProps {
  dataKey?: string;
}

const Chart2 = () => {
  const [activeBar, setActiveBar] = useState<{ index: number; dataKey: string } | null>(null);

  const CustomActiveBar = (props: CustomActiveBarProps) => {
    const { dataKey } = props;
    const originProps = { ...props };
    delete originProps.dataKey;
    return (
      <Rectangle
        {...originProps}
        fill={
          activeBar
            ? dataKey === "최대" && activeBar.dataKey === "최대"
              ? "var(--green-500)"
              : dataKey === "최소" && activeBar.dataKey === "최소"
                ? "var(--green-200)"
                : dataKey === "최대"
                  ? "#ABAFB7"
                  : "#DEE1E6"
            : dataKey === "최대"
              ? "var(--green-500)"
              : "var(--green-200)"
        }
      />
    );
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
          activeBar={<CustomActiveBar />}
          onPointerDown={(_, index) => setActiveBar({ index, dataKey: "최소" })}
          onPointerUp={() => setActiveBar(null)}
          isAnimationActive={false}
          label={props => <CustomLabel {...props} activeBar={activeBar} dataKey="최소" />}
        />
        <Bar
          dataKey="최대"
          barSize={17}
          fill="#ABAFB7"
          cursor="pointer"
          activeBar={<CustomActiveBar />}
          onPointerDown={(_, index) => setActiveBar({ index, dataKey: "최대" })}
          onPointerUp={() => setActiveBar(null)}
          isAnimationActive={false}
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
