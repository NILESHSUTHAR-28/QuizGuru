import React from "react";
import { Search } from 'lucide-react';

export function SearchBar({ value, onChange }) {
  return (
    <div className="position-relative mb-4">
      <div className="input-group" style={{ maxWidth: "800px", margin: "0 auto" }}>
        <input
          type="text"
          className="form-control py-2 px-4 rounded-pill"
          placeholder="Search for any topic"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            backgroundColor: "white",
            border: "none",
            fontSize: "1.1rem",
            paddingLeft: "45px",
          }}
        />
        <div className="position-absolute" style={{ left: "15px", top: "50%", transform: "translateY(-50%)", zIndex: 10 }}>
          <Search size={20} color="#666" />
        </div>
      </div>
    </div>
  );
}