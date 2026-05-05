const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors()); // allows frontend to call API
app.use(express.json()); // parses JSON input

app.post("/bfhl", (req, res) => {
  const data = req.body.data || [];

  const validEdges = [];
  const invalid_entries = [];
  const duplicate_edges = [];

  const duplicate_seen = new Set();
  const seen = new Set();

  data.forEach((item) => {
    const str = typeof item === 'string' ? item.trim() : "";

    // check format (must be X->Y, X!=Y, both uppercase letters)
    if (!/^[A-Z]->[A-Z]$/.test(str) || str[0] === str[3]) {
      invalid_entries.push(item);
      return;
    }

    // check duplicate
    if (seen.has(str)) {
      if (!duplicate_seen.has(str)) {
        duplicate_edges.push(str);
        duplicate_seen.add(str);
      }
      return;
    }

    seen.add(str);
    validEdges.push(str);
  });

  const graph = {};
  const childrenSet = new Set();

  validEdges.forEach(edge => {
    const [parent, child] = edge.split("->");

    // Diamond / multi-parent case: if a node has more than one parent, 
    // the first-encountered parent edge wins.
    if (childrenSet.has(child)) return;

    if (!graph[parent]) graph[parent] = [];
    graph[parent].push(child);

    childrenSet.add(child);
  });

  const nodes = new Set();

  validEdges.forEach(edge => {
    const [p, c] = edge.split("->");
    nodes.add(p);
    nodes.add(c);
  });

  let roots = [...nodes].filter(n => !childrenSet.has(n));

  const globalVisited = new Set();

  function buildTree(node, visited, stack) {
    if (stack.has(node)) return { cycle: true };
    if (visited.has(node)) return {};

    visited.add(node);
    stack.add(node);
    globalVisited.add(node);

    const children = graph[node] || [];
    const obj = {};

    for (let child of children) {
      const res = buildTree(child, visited, stack);
      if (res.cycle) return { cycle: true };
      obj[child] = res;
    }

    stack.delete(node);
    return obj;
  }

  function getDepth(treeObj) {
    const keys = Object.keys(treeObj);
    if (keys.length === 0) return 0;

    let max = 0;
    for (let key of keys) {
      max = Math.max(max, getDepth(treeObj[key]));
    }
    return max + 1;
  }

  const hierarchies = [];

  let total_trees = 0;
  let total_cycles = 0;
  let maxDepth = 0;
  let largest_tree_root = "";

  roots.forEach(root => {
    const visited = new Set();
    const stack = new Set();

    const result = buildTree(root, visited, stack);

    if (result.cycle) {
      total_cycles++;
      hierarchies.push({
        root,
        tree: {},
        has_cycle: true
      });
    } else {
      const tree = { [root]: result };
      const depth = 1 + getDepth(result);

      total_trees++;

      if (
        depth > maxDepth ||
        (depth === maxDepth && root < largest_tree_root)
      ) {
        maxDepth = depth;
        largest_tree_root = root;
      }

      hierarchies.push({
        root,
        tree,
        depth
      });
    }
  });

  let remainingNodes = [...nodes].filter(n => !globalVisited.has(n));
  while (remainingNodes.length > 0) {
    remainingNodes.sort();
    const cycleRoot = remainingNodes[0];

    const visited = new Set();
    const stack = new Set();
    const result = buildTree(cycleRoot, visited, stack);

    if (result.cycle) {
      total_cycles++;
      hierarchies.push({
        root: cycleRoot,
        tree: {},
        has_cycle: true
      });
    }

    remainingNodes = remainingNodes.filter(n => !globalVisited.has(n));
  }

  res.json({
    user_id: "vamsiprasadpasupuleti_14042006",
    email_id: "vamsiprasad_pasupuleti@srmap.edu.in",
    college_roll_number: "AP23110010166",
    hierarchies,
    invalid_entries,
    duplicate_edges,
    summary: {
      total_trees,
      total_cycles,
      largest_tree_root
    }
  });
});

app.listen(3000, () => console.log("Server running on port 3000"));
