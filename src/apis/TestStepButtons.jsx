import React, { useState } from "react";
import { fetchSteps, startStep, stopStep } from "@/apis/step";

/**
 * Step API 테스트용 컴포넌트
 * - goalId 입력 → fetchSteps 호출
 * - stepId 입력 → start/stop 호출
 */
export default function TestStepButtons() {
  const [todoId, setTodoId] = useState("");
  const [stepId, setStepId] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const run = async (fn) => {
    try {
      setLoading(true);
      const res = await fn();
      setResult(res);
      console.log("✅ API 성공:", res);
    } catch (e) {
      console.error("❌ API 실패:", e);
      setResult(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>🛠 Step API Tester</h2>

      <div style={{ marginBottom: 12 }}>
        <label>
          Goal(Todo) ID:{" "}
          <input
            type="number"
            value={todoId}
            onChange={(e) => setTodoId(e.target.value)}
            style={{ width: 100 }}
          />
        </label>
        <button
          onClick={() => run(() => fetchSteps(todoId))}
          disabled={!todoId || loading}
        >
          Fetch Steps
        </button>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>
          Step ID:{" "}
          <input
            type="number"
            value={stepId}
            onChange={(e) => setStepId(e.target.value)}
            style={{ width: 100 }}
          />
        </label>
        <button
          onClick={() => run(() => startStep(stepId))}
          disabled={!stepId || loading}
        >
          ▶ Start Step
        </button>
        <button
          onClick={() => run(() => stopStep(stepId))}
          disabled={!stepId || loading}
        >
          ⏸ Stop Step
        </button>
      </div>

      <pre
        style={{
          background: "#f6f8fa",
          padding: 12,
          borderRadius: 6,
          maxHeight: 300,
          overflow: "auto",
        }}
      >
        {loading
          ? "⏳ 요청 중..."
          : result
          ? JSON.stringify(result, null, 2)
          : "👉 API 호출 결과가 여기에 표시됩니다."}
      </pre>
    </div>
  );
}
