import { TRAINING_DATA } from "https://storage.googleapis.com/jmstore/TensorFlowJS/EdX/TrainingData/real-estate-data.js";

// input feature pairs (house size, number of bedrooms)
const INPUTS = TRAINING_DATA.inputs;

// current listed house prices in dollars given features above
const OUTPUTS = TRAINING_DATA.outputs;

// shuffle arrays in case they were arranged in some order
tf.util.shuffleCombo(INPUTS, OUTPUTS);

// convert both to tensors
const INPUTS_TENSOR = tf.tensor2d(INPUTS);
const OUTPUTS_TENSOR = tf.tensor1d(OUTPUTS);

// normalize tensor function

const normalize = (tensor, min, max) => {
    const result = tf.tidy(() => {
        // find min and max in tensor
        const MIN_VALUES = min || tf.min(tensor, 0);
        const MAX_VALUES = max || tf.max(tensor, 0);

        // subtract min_values from every value in tensor and store results in new tensor
        const TENSOR_SUBTRACT_MIN_VALUE = tf.sub(tensor, MIN_VALUES);

        // calculate range size of possible values
        const RANGE_SIZE = tf.sub(MAX_VALUES, MIN_VALUES);

        // calculate normalized values
        const NORMALIZED_VALUES = tf.div(TENSOR_SUBTRACT_MIN_VALUE, RANGE_SIZE);

        return { NORMALIZED_VALUES, MIN_VALUES, MAX_VALUES };
    });
    return result;
};

// normalize all input feature arrays and dispose non-normalized tensors
const FEATURE_RESULTS = normalize(INPUTS_TENSOR);

console.log("normalized values");
FEATURE_RESULTS.NORMALIZED_VALUES.print();

console.log("min values");
FEATURE_RESULTS.MIN_VALUES.print();

console.log("max values");
FEATURE_RESULTS.MAX_VALUES.print();

INPUTS_TENSOR.dispose();

// create model
const model = tf.sequential();

// use one dense layer with one neuron (units) and 2 inputs (house size and bedroom no.)
model.add(tf.layers.dense({ inputShape: [2], units: 1 }));

model.summary();

// eval function
const evaluate = () => {
    // predict answer for a single piece of data
    tf.tidy(() => {
        let newInput = normalize(
            tf.tensor2d([[750, 1]]),
            FEATURE_RESULTS.MIN_VALUES,
            FEATURE_RESULTS.MAX_VALUES
        );

        let output = model.predict(newInput.NORMALIZED_VALUES);
        output.print();
    });

    // clean up
    FEATURE_RESULTS.MIN_VALUES.dispose();
    FEATURE_RESULTS.MAX_VALUES.dispose();
    model.dispose();

    // just in case we didn't clean up smth
    console.log(tf.memory().numTensors);
};

// train function
const train = async () => {
    const LEARNING_RATE = 0.01;

    // compile model with learning rate func to change weights + bias and a func to calculate loss
    model.compile({
        optimizer: tf.train.sgd(LEARNING_RATE),
        loss: "meanSquaredError",
    });

    // training
    let results = await model.fit(
        FEATURE_RESULTS.NORMALIZED_VALUES,
        OUTPUTS_TENSOR,
        {
            validationSplit: 0.15, // take aside 15% of data for validation testing
            shuffle: true, // shuffle in case they were in order
            batchSize: 64, // the amount of values to go through before calling optimizer function
            epochs: 10, // go over data 10 times
        }
    );

    OUTPUTS_TENSOR.dispose();
    FEATURE_RESULTS.NORMALIZED_VALUES.dispose();

    console.log(
        "average error loss: ",
        Math.sqrt(results.history.loss[results.history.loss.length - 1])
    );
    console.log(
        "validation error loss: ",
        Math.sqrt(results.history.val_loss[results.history.val_loss.length - 1])
    );
    evaluate();
};

// train func
train();
