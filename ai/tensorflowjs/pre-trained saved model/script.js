// square feet of house to price of house model

const MODEL_PATH = "localstorage://housemodel";
// "https://storage.googleapis.com/jmstore/TensorFlowJS/EdX/SavedModels/sqftToPropertyPrice/model.json";
// store model
let model = undefined;

const loadModel = async () => {
    model = await tf.loadLayersModel(MODEL_PATH);
    model.summary();

    // create a batch of 1 (house size)
    const input = tf.tensor2d([[870]]);
    // batch of 3
    const inputBatch = tf.tensor2d([[500], [1100], [970]]);

    // make predictions
    const result = model.predict(input);
    const resultBatch = model.predict(inputBatch);

    // print them out
    result.print();
    resultBatch.print();

    // dispose variables
    input.dispose();
    inputBatch.dispose();
    result.dispose();
    resultBatch.dispose();
    model.dispose();
};

loadModel();
