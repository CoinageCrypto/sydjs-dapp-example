export const abi = [
  {
    constant: false,
    inputs: [{ name: "incomingMessage", type: "string" }],
    name: "updateMessage",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "lastAmountPaid",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "message",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  { anonymous: false, inputs: [], name: "MessageUpdated", type: "event" }
];
