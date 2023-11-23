// The minimum prediction confidence.
const threshold = 0.5;

toxicity.load(threshold).then((model) => {
    const sentences = [
        "you suck",
        "i am happy",
        "I am going to kill your family",
        "you are a devious assart!",
    ];

    model.classify(sentences).then((predictions) => {
        const formatted = predictions.map((curr) => {
            return [curr.label, curr.results.map((sentence) => sentence.match)];
        });
        console.log(formatted);
    });
});
