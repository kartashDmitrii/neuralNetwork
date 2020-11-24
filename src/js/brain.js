/*
// provide optional config object, defaults shown.
const config = {
    inputSize: 10,
    inputRange: 10,
    hiddenLayers: [10, 10],
    outputSize: 10,
    learningRate: 0.01,
    decayRate: 0.01,
};

// create a simple recurrent neural network
const net = new brain.recurrent.RNN();

net.train([
    { input: [24, 7, 10, 2020], output: [28.0] },
]);

const output = net.run([25, 7, 10, 2020]); // [0]
console.log(output)
*/
