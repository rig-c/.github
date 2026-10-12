<p align="center">
  <img src="https://raw.githubusercontent.com/rig-c/.github/main/profile/banner.svg" alt="rig-c — a toolchain for 2D character rigs an AI agent can author and verify" width="100%" />
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/rig-c/.github/main/profile/trailer.webp" alt="A character on a swing under a night sky breathes, tilts her head, smiles, kicks her legs, hops and waves, her twin tails following; for one beat her meshes and bones are drawn over her" width="100%" />
</p>

<p align="center"><em>One painting, rigged with <code>@rig-c/parts</code> and compiled and rendered by <code>rig-c</code>. The swing is one more bone of the same skeleton; the hair, the skirt and the legs follow it by physics, and the meshes and bones shown are the render's own geometry. The sky, the lights and the captions are composited around the render. <a href="https://github.com/rig-c/trailer">How it was made, and one command to rebuild it →</a></em></p>

**2D character rigs, authored by an AI agent that cannot see them — and verified before anything is written.**
One painting goes in; a rigged, animated character that plays in the browser comes out. Every stage prints named,
numeric findings and refuses by name what it cannot verify, so a wrong file never reaches the disk.

| | Repository | Install | What it does |
| :-: | --- | --- | --- |
| 1 | [**parts**](https://github.com/rig-c/parts) | `npm i -D @rig-c/parts` | Assembles one character painting's decomposed layers into rig-ready parts, then authors weighted meshes, bone chains, physics and a looping idle over them |
| 2 | [**core**](https://github.com/rig-c/core) | `npm i -D rig-c` | The rig compiler: a rig spec and a motion spec in, skeleton data out — in the Spine 4.3 format, with its own compiled model beside it — gated by named assertions before a byte is written |
| 3 | [**play**](https://github.com/rig-c/play) | `npm i @rig-c/play` | Plays the compiled model in the browser, as plain DOM elements or one canvas: tracks, mixing, additive layers, per-pose bone hooks |

### Built for agents

- **The messages are the interface.** A refusal names the object, the value found and the value required — an agent reads the line and knows which file to change.
- **Nothing is invented.** Where the input is silent the tool says so; it does not guess a value and carry on.
- **Emit only after green.** The compiler writes nothing that fails its gate.

`core` and `parts` each carry a `docs/AUTHORING.md` — the guide an agent authors from — and ship as agent skills; `play`'s README is its guide.

### Examined by agents

[**rig-c/exam**](https://github.com/rig-c/exam) is an open-book exam: a coding agent with nothing but the installed packages builds a rig from one painting, and writes down what it expects before every step. Anyone may sit it with any model. [The results](https://github.com/rig-c/exam#results) and every journal are public, and a line where an examinee was surprised becomes an issue on the tools.

### Names

`rig-c` is also published as `@rig-c/core`. `rig-parts` and `rig-play` are `@rig-c/parts` and `@rig-c/play` under the names they shipped as before the scope; `spine-rigc`, `spine-parts` and `spine-html` are the same packages under their first names. Every alias carries the same files at every version.

The tools are MIT licensed; the exam's content is CC BY-NC 4.0.
