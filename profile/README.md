<p align="center">
  <img src="https://raw.githubusercontent.com/rig-c/.github/main/profile/banner.svg" alt="rig-c — a toolchain for 2D character rigs an AI agent can author and verify" width="100%" />
</p>

**2D character rigs, authored by an AI agent that cannot see them — and verified before anything is written.**
One painting goes in; a rigged, animated character that plays in the browser comes out. Every stage prints named,
numeric findings and refuses by name what it cannot verify, so a wrong file never reaches the disk.

| | Repository | Install | What it does |
| :-: | --- | --- | --- |
| 1 | [**parts**](https://github.com/rig-c/parts) | `npm i -D @rig-c/parts` | Assembles one character painting's decomposed layers into rig-ready parts, then authors weighted meshes, bone chains, physics and a looping idle over them |
| 2 | [**core**](https://github.com/rig-c/core) | `npm i -D rig-c` | The rig compiler: a rig spec and a motion spec in, skeleton data out — in the Spine 4.3 format, with its own compiled model beside it — gated by named assertions before a byte is written |
| 3 | [**play**](https://github.com/rig-c/play) | `npm i @rig-c/play` | Plays the compiled model in the browser, as plain DOM elements or one canvas: tracks, mixing, additive layers, per-pose bone hooks |

<p align="center">
  <img src="https://raw.githubusercontent.com/rig-c/parts/main/assets/demo-source.png" alt="A full-body character painting" height="300" />
  <img src="https://raw.githubusercontent.com/rig-c/parts/main/assets/demo-idle.png" alt="The same character rigged: breathing, blinking and swaying in a four-second loop" height="300" />
  <img src="https://raw.githubusercontent.com/rig-c/core/main/assets/rigc-demo.gif" alt="Loose part PNGs assembling themselves into a character that breathes, blinks and waves" height="300" />
</p>

<p align="center"><em>Left and centre: one painting, and the rig <code>@rig-c/parts</code> built from it. Right: fourteen parts, one rig spec and one motion spec, compiled and rendered by <code>rig-c</code>.</em></p>

### Built for agents

- **The messages are the interface.** A refusal names the object, the value found and the value required — an agent reads the line and knows which file to change.
- **Nothing is invented.** Where the input is silent the tool says so; it does not guess a value and carry on.
- **Emit only after green.** The compiler writes nothing that fails its gate.

`core` and `parts` each carry a `docs/AUTHORING.md` — the guide an agent authors from — and ship as agent skills; `play`'s README is its guide.

### Names

`rig-c` is also published as `@rig-c/core`. `rig-parts` and `rig-play` are `@rig-c/parts` and `@rig-c/play` under the names they shipped as before the scope; `spine-rigc`, `spine-parts` and `spine-html` are the same packages under their first names. Every alias carries the same files at every version.

MIT licensed.
