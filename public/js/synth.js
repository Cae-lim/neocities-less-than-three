class AcidSynth {
  constructor() {
    this.shape = "sawtooth";
    this.reso = 15;
    this.frequency = 5000;
    this.targetFreq = 10000;
    this.filterEnv = "8n";
    this.decay = "4n";

    this.synth = new Tone.Synth({
      oscillator: {
        type: "sawtooth"
      },
      envelope: {
        attack: 0,
        decay: this.decay,
        sustain: 0,
        release: 0
      }
    });

    const delay = new Tone.FeedbackDelay("16n", 0.75);
    this.delay = new Tone.FeedbackDelay({
      delayTime: "16n",
      feedback: 0.2,
      wet: 0.01
    })

    this.filter = new Tone.Filter({
      Q: this.reso,
      frequency: this.frequency,
      gain: 0.75,
      type: "lowpass",
      rolloff: -12
    })

    this.distortion = new Tone.Distortion({
      distortion: 0.3,
    })

    this.synth.connect(this.filter);
    this.filter.connect(this.delay);
    this.delay.connect(this.distortion);
    this.distortion.toDestination();
  }

  play(note, time = "now", slide = false) {
    this.filter.frequency.value = this.frequency;
    this.filter.frequency.linearRampTo(this.targetFreq, this.filterEnv);
    if (slide) {
      this.synth.portamento = 0.75;
      console.log("SLIDE")
    } else {
      this.synth.portamento = 0;
    }
    this.synth.triggerAttackRelease(note, "16n", time);
  }

}

class Sequencer {
  constructor(synth) {
    this.steps = [
      { n: "c2" }, { n: "c1", s: true }, { n: "c2" }, { n: "c2", s: true },
      { n: "d2" }, { n: "d#1" }, { n: "b2" }, { n: "b1" }
    ]

    this.loop = new Tone.Loop((time) => {
      const position = Tone.Transport.position.split(":");
      const quarterNote = parseInt(position[1]);
      const sixteenthNote = parseInt(position[2]);
      const currentStep = this.steps[(quarterNote * 4 + sixteenthNote) % this.steps.length];

      synth.play(currentStep.n, time, currentStep.s);
    }, "16n")
  }
}

const bass = new AcidSynth();
const sequencer = new Sequencer(bass);
sequencer.loop.start(0);

let playing = false;

const playButton = document.getElementById("play-button");
playButton.addEventListener("mousedown", start)


function start() {
  if (!playing) {
    Tone.Transport.start();
  } else {
    Tone.Transport.stop();
  }

  playing = !playing;
}
