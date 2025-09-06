// Todo API 테스트를 위한 코드입니다. 추후 삭제 예정 !!!

import React from "react";

import { addTodo, deleteTodo,fetchTodos } from "@/apis/todo";

export default function TestTodoButtons() {
  const handleAdd = async () => {
    try {
      const created = await addTodo({
        title: "test5",
        content: "test, 5555",
        startDate: "2025-09-03",
        endDate: "2025-09-07",
        expectedDays: ["MONDAY", "TUESDAY"],
        todoSteps: [
          {
            stepDate: "2025-09-03",
            stepOrder: 1,
            description: "ToDo ERD 설계",
          },
        ],
      });
      console.log("✅ 생성된 ToDo:", created);
      alert("ToDo 생성 완료! 콘솔을 확인하세요.");
    } catch (err) {
      console.error("❌ ToDo 생성 실패:", err);
      alert("ToDo 생성 실패: 콘솔 확인!");
    }
  };

  const handleFetch = async () => {
    try {
      const list = await fetchTodos();
      console.log("📦 현재 ToDo 목록:", list);
      alert("ToDo 목록 조회 완료! 콘솔을 확인하세요.");
    } catch (err) {
      console.error("❌ ToDo 조회 실패:", err);
      alert("ToDo 조회 실패: 콘솔 확인!");
    }
  };

  const handleDelete = async () => {
    const todoId = prompt("삭제할 ToDo ID를 입력하세요:");
    if (!todoId) return;
    if (!window.confirm(`정말 ToDo #${todoId}를 삭제하시겠습니까?`)) return;

    try {
      const res = await deleteTodo(todoId);
      console.log("✅ 삭제 성공:", res);
      alert(`ToDo #${todoId} 삭제 완료!`);
    } catch (err) {
      console.error("❌ 삭제 실패:", err);
      alert("삭제 실패! 콘솔을 확인하세요.");
    }
  };

  return (
    <div style={{ display: "flex", gap: "12px" }}>
      <button
        onClick={handleAdd}
        style={{
          padding: "8px 16px",
          borderRadius: "6px",
          background: "#0E7400",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        ➕ ToDo 추가
      </button>

      <button
        onClick={handleFetch}
        style={{
          padding: "8px 16px",
          borderRadius: "6px",
          background: "#1976d2",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        📦 ToDo 조회
      </button>

      <button
        onClick={handleDelete}
        style={{
          padding: "8px 16px",
          borderRadius: "6px",
          background: "#d32f2f",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        🗑️ ToDo 삭제
      </button>
    </div>
  );
}

// 버튼 html 코드 예시
/**
      <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
        <h1>ToDo API 테스트</h1>
        <p>아래 버튼을 눌러 ToDo API를 직접 호출해보세요.</p>
        <TestTodoButtons />
      </div>
 */
