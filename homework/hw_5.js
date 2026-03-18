function maze_solver(maze, portals) {
  const rows = maze.length;
  const cols = maze[0].length;

  const inBounds = (r, c) => r >= 0 && r < rows && c >= 0 && c < cols;
  const keyOf = (r, c) => `(${r}, ${c})`;

  // Parses: "(r, c)" or "r,c" -> [r,c]
  function parseCoordString(s) {
    if (typeof s !== "string") return null;
    const m = s.match(/-?\d+/g);
    if (!m || m.length < 2) return null;
    return [parseInt(m[0], 10), parseInt(m[1], 10)];
  }

  // Parses: [r,c] -> [r,c]
  function parseCoordArray(a) {
    if (!Array.isArray(a) || a.length !== 2) return null;
    if (typeof a[0] !== "number" || typeof a[1] !== "number") return null;
    return [a[0], a[1]];
  }

  // Convert ANY portal value into an array of destinations [[r,c], ...]
  // Supports:
  // - [r,c]
  // - "(r,c)"
  // - [[r,c],[r2,c2]]
  // - ["(r,c)","(r2,c2)"]
  // - [r1,c1,r2,c2,...]   (flat numeric list)
  function parseDestinations(val) {
    const dests = [];

    // single string "(r,c)"
    if (typeof val === "string") {
      const p = parseCoordString(val);
      if (p) dests.push(p);
      return dests;
    }

    // single coord [r,c]
    const single = parseCoordArray(val);
    if (single) {
      dests.push(single);
      return dests;
    }

    // array of something
    if (Array.isArray(val)) {
      // flat numeric list [r1,c1,r2,c2,...]
      const allNums = val.every(x => typeof x === "number");
      if (allNums && val.length % 2 === 0) {
        for (let i = 0; i < val.length; i += 2) {
          dests.push([val[i], val[i + 1]]);
        }
        return dests;
      }

      // list of coords / strings
      for (const item of val) {
        const p1 = parseCoordArray(item);
        if (p1) { dests.push(p1); continue; }
        const p2 = parseCoordString(item);
        if (p2) { dests.push(p2); continue; }
      }
      return dests;
    }

    // unsupported type
    return dests;
  }

  // Normalize portals into Map "(r,c)" -> [[r,c], ...]
  const portalAdj = new Map();
  if (portals && typeof portals === "object") {
    for (const rawKey of Object.keys(portals)) {
      const from = parseCoordString(rawKey);
      if (!from) continue;
      const fromKey = keyOf(from[0], from[1]);
      portalAdj.set(fromKey, parseDestinations(portals[rawKey]));
    }
  }

  // Find S and E
  let start = null, end = null;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (maze[r][c] === "S") start = [r, c];
      if (maze[r][c] === "E") end = [r, c];
    }
  }
  if (!start || !end) return [-1, []];

  // BFS
  const INF = 1e15;
  const dist = Array.from({ length: rows }, () => Array(cols).fill(INF));
  const parent = Array.from({ length: rows }, () => Array(cols).fill(null));
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));

  const queue = [];
  let qIdx = 0;