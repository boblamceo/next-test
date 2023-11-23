const body = async () => {
    const recognizer = speechCommands.create("BROWSER_FFT");

    await recognizer.ensureModelLoaded();

    recognizer.listen(
        (result) => {
            const scores = Array.from(result.scores);
            const maxScore = Math.max(...scores);
            const wordLabels = recognizer.wordLabels();
            const word = wordLabels[scores.indexOf(maxScore)];
            const position =
                document.documentElement.scrollTop || document.body.scrollTop;
            if (word === "down") {
                window.scrollTo({
                    top: position + 200,
                    left: 0,
                    behavior: "smooth",
                });
            } else if (word === "up") {
                window.scrollTo({
                    top: position - 200,
                    left: 0,
                    behavior: "smooth",
                });
            }
        },
        {
            includeSpectrogram: true,
            probabilityThreshold: 0.75,
        }
    );
};

body();
