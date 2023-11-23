import { TRAINING_DATA } from "https://storage.googleapis.com/jmstore/TensorFlowJS/EdX/TrainingData/mnist.js";

// inputs and outputs
const INPUTS = TRAINING_DATA.inputs;
const OUTPUTS = TRAINING_DATA.outputs;

// shuffle
tf.util.shuffleCombo(INPUTS, OUTPUTS);

// convert to tensor
const INPUTS_TENSOR = tf.tensor2d(INPUTS);
const OUTPUTS_TENSOR = tf.oneHot(tf.tensor1d(OUTPUTS, "int32"), 32);

// create model
const model = tf.sequential();

model.add(
    tf.layers.dense({ inputShape: [784], units: 32, activation: "relu" })
);
model.add(tf.layers.dense({ units: 16, activation: "relu" }));
model.add(tf.layers.dense({ units: 10, activation: "softmax" }));

model.summary();

const PREDICTION_ELEMENT = document.getElementById("prediction");

const evaluate = () => {
    const OFFSET = Math.floor(Math.random() * INPUTS.length); // random image from data

    let answer = tf.tidy(() => {
        let newInput = tf.tensor1(INPUTS[OFFSET]);
        let output = model.predict(newInput.expandDims()); // expects batch of images so expand dimensions
        output.print();
        return output.squeeze().argMax();
    });

    answer.array().then((index) => {
        PREDICTION_ELEMENT.innerText = index;
        PREDICTION_ELEMENT.setAttribute(
            "class",
            index === OUTPUTS[OFFSET] ? "correct" : "wrong"
        );
        answer.dispose();
        // drawImage(INPUTS[OFFSET]);
    });
};

function logProgress(epoch, logs) {
    console.log("epoch" + epoch, Math.sqrt(logs.loss));
}

const train = async () => {
    model.compile({
        optimizer: "adam",
        loss: "categoricalCrossentropy",
        metrics: ["accuracy"],
    });

    let results = await model.fit(INPUTS_TENSOR, OUTPUTS_TENSOR, {
        shuffle: true,
        validationSplit: 0.2,
        batchSize: 512,
        epochs: 50,
        callbacks: { onEpochEnd: logProgress },
    });

    OUTPUTS_TENSOR.dispose();
    INPUTS_TENSOR.dispose();

    console.log(
        "Average error loss: " +
            Math.sqrt(results.history.loss[results.history.loss.length - 1])
    );

    evaluate();
};

train();
