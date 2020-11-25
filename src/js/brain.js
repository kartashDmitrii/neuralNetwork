// const config = {
//     inputSize: 10,
//     inputRange: 10,
//     hiddenLayers: [10, 10],
//     outputSize: 10,
//     learningRate: 0.01,
//     decayRate: 0.01,
// };
//
// // create a simple recurrent neural network
// const net = new brain.recurrent.RNN();
//
// net.train([
//     { input: [3, 27, 12, 2020], output: [28.1] },
//     { input: [3, 28, 12, 2020], output: [28.2] },
//     { input: [3, 29, 12, 2020], output: [28.3] },
//     { input: [3, 30, 12, 2020], output: [28.4] },
// ]);
//
// const output = net.run([3, 31, 12, 2020]); // [0]
// console.log(output);
