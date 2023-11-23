const MODEL_PATH =
    "https://tfhub.dev/google/tfjs-model/movenet/singlepose/lightning/4";
const EXAMPLE_IMG = document.getElementById("exampleImg");

let movenet = undefined;

const loadAndRunModel = async () => {
    movenet = await tf.loadGraphModel(MODEL_PATH, { fromTFHub: true });

    // get image pixels from example image
    let imageTensor = tf.browser.fromPixels(EXAMPLE_IMG);

    // resize image
    let cropStartPoint = [15, 170, 0];
    let cropSize = [345, 345, 3];
    let croppedTensor = tf.slice(imageTensor, cropStartPoint, cropSize);

    let resizedTensor = tf.image
        .resizeBilinear(croppedTensor, [192, 192], true)
        .toInt();
    console.log(resizedTensor.shape);

    // get outputs (actual ml stuff)
    // it has expandDims, as the shape is [1, 192, 192, 3] but we only have [192, 192, 3] which means we have to expand the Dimensions
    let tensorOutput = movenet.predict(tf.expandDims(resizedTensor));
    let arrayOutput = await tensorOutput.array();
    console.log(arrayOutput);

    // dispose everything
    movenet.dispose();
    imageTensor.dispose();
    croppedTensor.dispose();
    resizedTensor.dispose();
    tensorOutput.dispose();
};

loadAndRunModel();
