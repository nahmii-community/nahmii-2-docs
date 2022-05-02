# security-model

The Nahmii security model makes use of a reward and punishment system, which is based on the fact that there should be sufficient incentive to foster good behaviour. This model is known as the Nahmii Security Architecture.

The Nahmii Security Architecture is divided into three levels that engage in a constant check and balance mechanism on the protocol. These are the **Operator, Transaction monitoring and Data-availability validation**.

#### Operator

At inception, the operator of the protocol will be Nahmii AS with a roadmap of decentralizing this process to allow more players in this sphere, but with the support of the Nahmii Foundation. Transactions occurring on Nahmii requires the operator to countersign these, which allows only valid state transactions to happen.

In the event of a compromised/rogue operator, the protocol will continue to operate, ensuring that the commercial application faces no operational error. This is due to the foundational model of governance approach by Nahmii.

#### Transaction Monitoring

Transactions on Nahmii generates receipts which are used to prove either an operator or user fraud. These receipts are challenged during when users attempt to commit their states to the base layer, this is equally known as Fraud proof challenge. There are rewards to the challengers of either the user settling fraud or operator fraud in the form of bonds.&#x20;

For transactions to be approved on Nahmii, it must be co-signed by the operator who confirms the validity of these, this process ensures the integrity of the protocol. On withdrawals to the base layer (state settlements), like other layer 2 protocols, this features a challenge period of which consensus must be reached to validate a settlement request. Here, transaction receipts from the operator are checked and used as fraud proofs during a timed window.

If the settlement process goes unchallenged, the user who started the settlement is allowed to exit the protocol.

#### Data-availability Validation

Layer 2 protocols are faced with the possibility of an external manipulator, despite their in-house checks and balance systems, fraud and settlement challenges do rest on the principle of data availability. Remember, the operator must publish accurate receipts at all times; without these accurate data, a number of processes are stalled, users aren't able to perform the fraud challenge and Nahmii can't verify its [off-chain elements](state-pools.md#state-channels).&#x20;

&#x20;To ensure trustlessness and reliable data from operators, the data-availability oracle was designed to be a fully decentralized mechanism which allows Nahmii token holders to be incentivized to monitor the availability.

The Data oracle serves as a function of account settlement on the protocol, working primarily on a boolean principle (TRUE/FALSE). It checks the user's transactions for validity before the user begins the settlement challenge.&#x20;

The Oracle is currently in a testing phase and the foundation members (excluding Nahmii AS) will act as a **data-availability committee**.&#x20;
