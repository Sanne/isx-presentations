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

// A template's blocks are stored once; each branch starts as nothing but
// references to them, and only the blocks it writes cost real disk.

const N = 10;
const W = 92;
const GAP = 16;
const rowX = (i: number) => (i - (N - 1) / 2) * (W + GAP);
const LEFT = rowX(0) - W / 2;
const RIGHT = rowX(N - 1) + W / 2;
const LABEL_X = LEFT - 48;
const TRUNK_X = LEFT - 22;

const TPL_Y = -330;
const branches = [
  {name: 'fix-nasty-bug', y: -110, writes: [1, 5], mb: 50},
  {name: 'review-pr-423', y: 80, writes: [3], mb: 30},
  {name: 'experiment', y: 270, writes: [7, 8], mb: 40},
];

export default makeScene2D(function* (view) {
  view.fill(C.bg);

  const onDisk = createSignal(0);
  const fullCopies = createSignal(0);

  const tpl = createRefArray<Rect>();
  const tplLabel = createRef<Node>();
  view.add(
    <Node y={TPL_Y}>
      <Node ref={tplLabel} opacity={0}>
        <Txt text="tpl-java" x={LABEL_X} y={-18} offsetX={1} fill={C.accent}
             fontFamily={MONO} fontSize={44} fontWeight={700} />
        <Txt text="template" x={LABEL_X} y={32} offsetX={1} fill={C.muted}
             fontFamily={MONO} fontSize={30} />
        <Txt text="~2 GB, stored once" x={RIGHT + 32} offsetX={-1} fill={C.muted}
             fontFamily={MONO} fontSize={32} />
      </Node>
      {range(N).map(i => (
        <Rect ref={tpl} x={rowX(i)} size={W} radius={8} fill={C.surface2}
              stroke={C.accent} lineWidth={3} opacity={0} scale={0.6} />
      ))}
    </Node>,
  );

  // Totals along the bottom: what CoW costs vs. what full copies would.
  view.add(
    <Node y={440}>
      <Txt x={-330} fill={C.accent} fontFamily={SANS} fontSize={46} fontWeight={600}
           text={() => `with CoW  ${onDisk().toFixed(2)} GB`} />
      <Txt x={330} fill={C.danger} fontFamily={SANS} fontSize={46} fontWeight={600}
           text={() => `full copies  ${fullCopies().toFixed(1)} GB`} />
    </Node>,
  );

  // Build the template.
  yield* all(
    tplLabel().opacity(1, 0.5),
    sequence(0.04, ...tpl.map(b => all(b.opacity(1, 0.3), b.scale(1, 0.3, easeOutCubic)))),
    onDisk(2, 0.8),
    fullCopies(2, 0.8),
  );
  yield* waitFor(0.6);

  const rows: {row: Node; blocks: Rect[]; trunk: Line; delta: Txt; mb: number}[] = [];

  for (const b of branches) {
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
        <Txt text={b.name} x={LABEL_X} offsetX={1} fill={C.text}
             fontFamily={MONO} fontSize={38} fontWeight={700} />
        {range(N).map(i => (
          <Rect ref={blocks} x={rowX(i)} size={W} radius={8} stroke={C.accent}
                lineWidth={2} lineDash={[7, 6]} opacity={0.35} />
        ))}
        <Txt ref={delta} x={RIGHT + 32} offsetX={-1} fill={C.accent}
             fontFamily={MONO} fontSize={32} opacity={0} text={`+${b.mb} MB`} />
      </Node>,
    );

    // The branch itself: instant, and free — dashed blocks are references.
    yield* trunk().end(1, 0.35);
    yield* all(row().opacity(1, 0.25), fullCopies(fullCopies() + 2, 0.6));
    yield* waitFor(0.3);

    // The agent writes: only these blocks become the branch's own.
    for (const w of b.writes) {
      const blk = blocks[w];
      blk.lineDash([]);
      yield* all(blk.fill(C.accent, 0.35), blk.opacity(1, 0.35));
    }
    yield* all(delta().opacity(1, 0.3), onDisk(onDisk() + b.mb / 1000, 0.5));
    yield* waitFor(0.4);

    rows.push({row: row(), blocks, trunk: trunk(), delta: delta(), mb: b.mb});
  }

  yield* waitFor(1);

  // Destroy the first branch: only its own blocks are freed.
  const gone = rows[0];
  yield* all(...gone.blocks.map(b => b.stroke(C.danger, 0.3)),
             ...gone.blocks.filter(b => b.lineDash().length === 0).map(b => b.fill(C.danger, 0.3)));
  yield* all(
    gone.row.opacity(0, 0.6),
    gone.row.x(-60, 0.6),
    onDisk(onDisk() - gone.mb / 1000, 0.6),
    fullCopies(fullCopies() - 2, 0.6),
  );
  // The template didn't notice.
  yield* sequence(0.03, ...tpl.map(b => b.lineWidth(6, 0.15).to(3, 0.25)));
  yield* waitFor(2.5);
});
