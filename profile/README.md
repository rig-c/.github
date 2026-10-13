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

**rig-c makes no images.** The painting and its layer split come from image models you run yourself — on your own GPU, or a free web demo. rig-c starts from those files, ships no model weights, and runs every one of its own steps on the CPU.

<p align="center"><a href="https://github.com/rig-c/getting-started"><b>→ Getting started</b></a> — for people setting it up: try it in about three minutes with no GPU, then make your own character on an NVIDIA GPU, an Apple Silicon Mac, or with no GPU at all.</p>

### Does your model pass?

An agent that has never seen these tools is handed one painting and the installed packages — nothing else — and has to build a rig that passes its check, add a wave, and correct a draft that fails. It writes down what it expects before every step. [**rig-c/exam**](https://github.com/rig-c/exam) is that exam, and these are the models that have sat it:

<!-- exam:start — generated in rig-c/exam by `python3 results.py --profile`; do not edit by hand -->
| model | sittings | lines passed, of lines graded | minutes for the tasks sat |
| --- | --- | --- | --- |
| [Claude Haiku](https://github.com/rig-c/exam/tree/main/results/claude-haiku/) | 1 | 16 / 16 | 21 |
| [Gemini 3.8 Flash](https://github.com/rig-c/exam/tree/main/results/gemini-3.8-flash/) | 1 | 16 / 16 | 20 |
| [`gpt-6-sol` (not established which model)](https://github.com/rig-c/exam/tree/main/results/gpt-6-sol/) | 1 | 16 / 16 | 14.1 |
| [Sol 6.1](https://github.com/rig-c/exam/tree/main/results/sol-6.1/) | 2 | 32 / 32 | 14.2 to 15.3 |
<!-- exam:end -->

Every line passed, and the three models named are each their vendor's lighter tier. **Sit it with yours:** paste [one prompt](https://github.com/rig-c/exam/blob/main/PROMPT.md) into any coding agent, open a pull request, and the run is regraded from the files it hands in and added to [the table](https://github.com/rig-c/exam#results) — with its journal, and whatever it found wrong with the tools.

| | Repository | Install | What it does |
| :-: | --- | --- | --- |
| 1 | [**parts**](https://github.com/rig-c/parts) | `npm i -D @rig-c/parts` | Assembles one character painting's decomposed layers into rig-ready parts, then authors weighted meshes, bone chains, physics and a looping idle over them |
| 2 | [**core**](https://github.com/rig-c/core) | `npm i -D rig-c` | The rig compiler: a rig spec and a motion spec in, skeleton data out — in the Spine 4.3 format, with its own compiled model beside it — gated by named assertions before a byte is written |
| 3 | [**play**](https://github.com/rig-c/play) | `npm i @rig-c/play` | Plays the compiled model in the browser, as plain DOM elements or one canvas: tracks, mixing, additive layers, per-pose bone hooks |
| 4 | [**pose**](https://github.com/rig-c/pose) | `npm i -D @rig-c/pose` | Puts motion from a pose sequence (a video, a dataset or hand-placed points) onto a rig rig-c built, as bone keys, checked before it is written |

### Built for agents

- **The messages are the interface.** A refusal names the object, the value found and the value required — an agent reads the line and knows which file to change.
- **Nothing is invented.** Where the input is silent the tool says so; it does not guess a value and carry on.
- **Emit only after green.** The compiler writes nothing that fails its gate.

`core` and `parts` each carry a `docs/AUTHORING.md` — the guide an agent authors from — and ship as agent skills; `play`'s README is its guide.

### Names

`rig-c` is also published as `@rig-c/core`. `rig-parts` and `rig-play` are `@rig-c/parts` and `@rig-c/play` under the names they shipped as before the scope; `spine-rigc`, `spine-parts` and `spine-html` are the same packages under their first names. Every alias carries the same files at every version.

The tools are MIT licensed; the exam's content is CC BY-NC 4.0.
