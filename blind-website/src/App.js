import "@tensorflow/tfjs-backend-webgl";
import "@tensorflow/tfjs-backend-cpu";
import * as cocossd from "@tensorflow-models/coco-ssd";
import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { drawRect } from "./utilities";

const compareArrays = (a, b) => {
    return a.toString() === b.toString();
};

// direction of item
const direction = (x, width) => {
    if (x <= width / 3) {
        return "left";
    } else if (x >= width * (2 / 3)) {
        return "right";
    } else {
        return "middle";
    }
};

export default function App() {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const [detectItems, setDetectItems] = useState([]);

    let synth;
    if (typeof window !== "undefined") {
        synth = window.speechSynthesis;
    }

    const speak = (text) => {
        const u = new SpeechSynthesisUtterance(text);
        u.rate = 3;
        synth.cancel();
        synth.speak(u);
    };

    // Main function
    const runCoco = async () => {
        // 3. TODO - Load network
        // e.g. const net = await cocossd.load();
        const net = await cocossd.load();
        //  Loop and detect hands
        setInterval(() => {
            detect(net);
        }, 10);
    };

    const detect = async (net) => {
        // Check data is available
        if (
            typeof webcamRef.current !== "undefined" &&
            webcamRef.current !== null &&
            webcamRef.current.video.readyState === 4
        ) {
            // Get Video Properties
            const video = webcamRef.current.video;
            const videoWidth = webcamRef.current.video.videoWidth;
            const videoHeight = webcamRef.current.video.videoHeight;

            // Set video width
            webcamRef.current.video.width = videoWidth;
            webcamRef.current.video.height = videoHeight;

            // Set canvas height and width
            canvasRef.current.width = videoWidth;
            canvasRef.current.height = videoHeight;

            // 4. TODO - Make Detections
            // e.g. const obj = await net.detect(video);
            const obj = await net.detect(video);
            // Draw mesh
            const ctx = canvasRef.current.getContext("2d");

            // 5. TODO - Update drawing utility
            drawRect(obj, ctx);
            const currArr = [];
            for (let n = 0; n < obj.length; n++) {
                currArr.push([
                    obj[n].class,
                    obj[n].bbox[0] + obj[n].bbox[2] / 2,
                ]);
            }
            console.log(currArr);
            setDetectItems(currArr);
        }
    };

    useEffect(() => {
        runCoco();
    }, []);

    const inFront = () => {
        if (!detectItems.length) {
            speak("nothing");
        } else {
            const arr = ["start"];
            detectItems.forEach((item) => {
                arr.push(`${direction(item[1], 640)}${item[0]}`);
            });
            speak(`${arr.join(" ")} end`);
        }
    };

    useEffect(() => {
        inFront();
    }, [JSON.stringify(detectItems.map((curr) => curr[0]))]);

    return (
        <div>
            <Webcam
                ref={webcamRef}
                muted={true}
                style={{
                    position: "absolute",
                    marginLeft: "auto",
                    marginRight: "auto",
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    zindex: 9,
                    width: 640,
                    height: 480,
                }}
            />
            <canvas
                ref={canvasRef}
                style={{
                    position: "absolute",
                    marginLeft: "auto",
                    marginRight: "auto",
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    zindex: 8,
                    width: 640,
                    height: 480,
                }}
            />
        </div>
    );
}
