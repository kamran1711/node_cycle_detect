# 📊 BFHL Graph Analyzer

A web-based application that analyzes directed graph data and provides insights such as **tree structures, cycle detection, invalid inputs, and duplicate edges**.

This project combines a **modern frontend UI** with a **Node.js + Express backend API** to process and visualize graph relationships.

---

## 🚀 Features

### 🔍 Graph Analysis
- Accepts input in the format: `A->B, B->C`
- Parses and constructs directed graphs
- Identifies valid tree structures

### 🌳 Hierarchy Visualization
- Displays graph as hierarchical trees
- Clearly shows parent-child relationships
- Handles multiple disconnected components

### 🔁 Cycle Detection
- Detects cycles in the graph
- Flags cyclic structures (cannot form valid trees)

### ⚠️ Error Handling
- Detects **invalid input formats**
- Identifies **duplicate edges**
- Displays errors in a user-friendly way

### 📈 Summary Metrics
- Total number of valid trees
- Total number of cycles detected
- Root node of the largest tree

---

## 🛠️ Tech Stack

### Frontend
- HTML5
- CSS3 (Custom modern UI)
- Vanilla JavaScript

### Backend
- Node.js
- Express.js
- CORS

---

## 📂 Project Structure
