import {Line, makeScene2D, Node, Rect, Txt} from '@motion-canvas/2d';
import {
  all,
  createRef,
  createRefArray,
  createSignal,
  easeOutCubic,
  range,
  sequence,
  waitFor,
} from '@motion-canvas/core';
import {C, MONO, SANS} from '../palette';

// Copy-on-write, read as a disk: each square is a block of a machine's disk.
// A template's blocks are stored once; each branch starts as nothing but
// references to them, and only the blocks it writes cost real disk.
// A caption at the top narrates each step, and a legend says how to read
// the three kinds of square, so the clip explains itself.

const N = 10;
const W = 84;
const GAP = 14;
const X0 = 60; // the row of blocks is shifted right to leave room for labels
const rowX = (i: number) => X0 + (i - (N - 1) / 2) * (W + GAP);
const LEFT = rowX(0) - W / 2;
const RIGHT = rowX(N - 1) + W / 2;
// Labels are left-anchored, so their position doesn't depend on measuring
// the text before the web font has loaded.
const LABEL_X = LEFT - 360;
const TRUNK_X = LEFT - 22;

const TPL_Y = -250;
const branches = [
  {name: 'fix-nasty-bug', y: -90, writes: [1, 5], mb: 50},
  {name: 'review-pr-423', y: 60, writes: [3], mb: 30},
  {name: 'experiment', y: 210, writes: [7, 8], mb: 40},
];

export default makeScene2D(function* (view) {
  view.fill(C.bg);

  const onDisk = createSignal(0);
  const fullCopies = createSignal(0);

  // What's happening, in words: the first thing to read on every frame.
  const caption = createRef<Txt>();
  view.add(
    <Txt ref={caption} y={-470} fill={C.text} fontFamily={SANS} fontSize={40}
         fontWeight={600} text="" />,
  );

  // How to read a square.
  const legend = createRef<Node>();
  const key = (x: number, sq: any, label: string) => (
    <Node x={x}>
      {sq}
      <Txt x={34} offsetX={-1} fill={C.muted} fontFamily={SANS} fontSize={28} text={label} />
    </Node>
  );
  view.add(
    <Node ref={legend} y={-385} opacity={0}>
      {key(-780, <Rect size={40} radius={6} fill={C.surface2} stroke={C.accent} lineWidth={3} />,
        'a disk block, stored')}
      {key(-230, <Rect size={40} radius={6} stroke={C.accent} lineWidth={2} lineDash={[6, 5]} opacity={0.5} />,
        "shared: read from the template's block")}
      {key(430, <Rect size={40} radius={6} fill={C.accent} />, "written: the branch's own copy")}
    </Node>,
  );

  const tpl = createRefArray<Rect>();
  const tplLabel = createRef<Node>();
  view.add(
    <Node y={TPL_Y}>
      <Node ref={tplLabel} opacity={0}>
        <Txt text="tpl-java" x={LABEL_X} y={-18} offsetX={-1} fill={C.accent}
             fontFamily={MONO} fontSize={40} fontWeight={700} />
        <Txt text="template's disk" x={LABEL_X} y={26} offsetX={-1} fill={C.muted}
             fontFamily={MONO} fontSize={26} />
        <Txt text="~2 GB" x={RIGHT + 28} offsetX={-1} fill={C.muted}
             fontFamily={MONO} fontSize={30} />
      </Node>
      {range(N).map(i => (
        <Rect ref={tpl} x={rowX(i)} size={W} radius={8} fill={C.surface2}
              stroke={C.accent} lineWidth={3} opacity={0} scale={0.6} />
      ))}
    </Node>,
  );

  // Totals along the bottom: real disk used, against what full copies would take.
  view.add(
    <Node y={400}>
      <Txt x={-360} fill={C.accent} fontFamily={SANS} fontSize={44} fontWeight={600}
           text={() => `on disk with isx  ${onDisk().toFixed(2)} GB`} />
      <Txt x={400} fill={C.danger} fontFamily={SANS} fontSize={44} fontWeight={600}
           text={() => `as full copies  ${fullCopies().toFixed(1)} GB`} />
    </Node>,
  );

  // Build the template.
  caption().text('A template\'s disk: its blocks are stored once');
  yield* all(
    tplLabel().opacity(1, 0.5),
    legend().opacity(1, 0.5),
    sequence(0.04, ...tpl.map(b => all(b.opacity(1, 0.3), b.scale(1, 0.3, easeOutCubic)))),
    onDisk(2, 0.8),
    fullCopies(2, 0.8),
  );
  yield* waitFor(1.4);

  const rows: {row: Node; blocks: Rect[]; trunk: Line; delta: Txt; mb: number}[] = [];

  for (const [k, b] of branches.entries()) {
    const row = createRef<Node>();
    const trunk = createRef<Line>();
    const delta = createRef<Txt>();
    const blocks = createRefArray<Rect>();

    view.add(
      <Line ref={trunk} points={[[TRUNK_X, TPL_Y + W / 2], [TRUNK_X, b.y]]}
            stroke={C.line} lineWidth={3} end={0} />,
    );
    view.add(
      <Node ref={row} y={b.y} opacity={0}>
        <Txt text={b.name} x={LABEL_X} offsetX={-1} fill={C.text}
             fontFamily={MONO} fontSize={34} fontWeight={700} />
        {range(N).map(i => (
          <Rect ref={blocks} x={rowX(i)} size={W} radius={8} stroke={C.accent}
                lineWidth={2} lineDash={[7, 6]} opacity={0.35} />
        ))}
        <Txt ref={delta} x={RIGHT + 28} offsetX={-1} fill={C.accent}
             fontFamily={MONO} fontSize={30} opacity={0} text={`+${b.mb} MB`} />
      </Node>,
    );

    // The branch itself: instant, and free — dashed blocks are references.
    if (k === 0) caption().text('Branch it: the new disk only points at those blocks. 0 bytes copied');
    yield* trunk().end(1, 0.35);
    yield* all(row().opacity(1, 0.25), fullCopies(fullCopies() + 2, 0.6));
    yield* waitFor(k === 0 ? 1.6 : 0.3);

    // The agent writes: only these blocks become the branch's own.
    if (k === 0) caption().text('The agent writes: only the blocks it changes get copied');
    for (const w of b.writes) {
      const blk = blocks[w];
      blk.lineDash([]);
      yield* all(blk.fill(C.accent, 0.35), blk.opacity(1, 0.35));
    }
    yield* all(delta().opacity(1, 0.3), onDisk(onDisk() + b.mb / 1000, 0.5));
    yield* waitFor(k === 0 ? 1.4 : 0.4);
    if (k === 0) caption().text('Every branch works the same way');

    rows.push({row: row(), blocks, trunk: trunk(), delta: delta(), mb: b.mb});
  }

  yield* waitFor(1);

  // Destroy the first branch: only its own blocks are freed.
  caption().text('Destroy a branch: only its own blocks are freed');
  const gone = rows[0];
  yield* all(...gone.blocks.map(b => b.stroke(C.danger, 0.3)),
             ...gone.blocks.filter(b => b.lineDash().length === 0).map(b => b.fill(C.danger, 0.3)));
  yield* all(
    gone.row.opacity(0, 0.6),
    gone.row.x(-60, 0.6),
    gone.trunk.opacity(0, 0.6),
    onDisk(onDisk() - gone.mb / 1000, 0.6),
    fullCopies(fullCopies() - 2, 0.6),
  );
  // The template didn't notice.
  yield* sequence(0.03, ...tpl.map(b => b.lineWidth(6, 0.15).to(3, 0.25)));
  caption().text('The template, and every other branch, are untouched');
  yield* waitFor(3);
});
