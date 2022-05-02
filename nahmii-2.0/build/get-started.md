---
description: This page covers how to connect to Nahmii!
---

# get-started

### Overview

This guide is intended for both wallet providers and users who want to send transactions over the Nahmii network. Nahmii works like any other EVM compatible chain with ETH as its base currency and 'soon with the introduction of other token used as gas fee'.

Nahmii as a scaling solution to Ethereum must publish transaction data to Mainnet Ethereum.



### Where to Start

Here's a detailed guide on connecting the metamask extension [#connecting-metamask](get-started.md#connecting-metamask "mention")to Nahmii, however, in simple terms you can connect your web3 wallet extension using the [connect-nahmii-2 dapp](https://nahmii-community.github.io/connect-nahmii-2/) or use an RPC endpoint aggregator <mark style="color:orange;">rpc.info</mark> [<mark style="color:blue;">https://rpc.info/#nahmii-rpc</mark>](https://rpc.info/#nahmii-rpc)<mark style="color:blue;"></mark>



### Canonical Token Addresses

Like every other scaling solution for Ethereum, ERC-20 smart contract addresses on Nahmii may differ from Ethereum for the same token. However, in the future we will provide a list of token list  Here's an example for the NII token.

| Chain ID | Network          | Address                                    |
| -------- | ---------------- | ------------------------------------------ |
| 1        | Ethereum Mainnet | 0x7c8155909cd385F120A56eF90728dD50F9CcbE52 |
| 5551     | Nahmii mainnet   | 0x595DBA438a1bf109953F945437c1584319515d88 |
| 5553     | Nahmii testnet   |                                            |
|          | Ropsten          | 0x21De2607E90edb1736bc460a4cd58c0FCd74ABcc |
|          |                  |                                            |



### Transaction Fees

Nahmii is Ethereum compatible, and thus transactions are denominated in ETH. However, there are some discrepancies between the chains,  a recognized feature is the fee designs and model.

### Connecting metamask

{% hint style="info" %}
Nahmii testnet network resets periodically. Nonces in Metamask don't update automatically and are cached. If you receive failed transaction warnings in MetaMask, please reset your account in the settings > advanced menu.
{% endhint %}

With the click of a button, navigate to the [connect-nahmii-2](https://nahmii-community.github.io/connect-nahmii-2/) dapp. Press on the `ADD NAHMII TESTNET` and `ADD NAHMII MAINNET` button. Alternatively, use the RPC aggregator, [RPC INFO](https://rpc.info/#nahmii-rpc) and click on the button `Add to Metamask`. Approve the dapp request and the networks should be added to your Ethereum wallet extension.



#### Network Details &#x20;

|                    | Nahmii Mainnet                                            | Nahmii Testnet                                                            |
| ------------------ | --------------------------------------------------------- | ------------------------------------------------------------------------- |
| Network name       | Nahmii Mainnet                                            | Nahmii Testnet                                                            |
| RPC URL            | [https://l2.nahmii.io/](https://l2.nahmii.io)             | [https://l2.testnet.nahmii.io/](https://l2.testnet.nahmii.io)             |
| ChainID            | 5551                                                      | 5553                                                                      |
| Symbol             | ETH                                                       | ETH                                                                       |
| Block Explorer URL | [https://explorer.nahmii.io/](https://explorer.nahmii.io) | [https://explorer.testnet.nahmii.io/](https://explorer.testnet.nahmii.io) |



#### Connect Manually via Metamask

{% tabs %}
{% tab title="With Browser Extension" %}
1. Open the browser extension.
2. Click on the network dropdown.

![](<../../.gitbook/assets/image (7).png>)

3\. When the networks window pops up, click on `Custom RPC`

![](<../../.gitbook/assets/image (5).png>)

4\. A new window will popup, where you can fill in the connection details. See  details provided above for the network you would like to use and click save.![](<../../.gitbook/assets/image (6).png>)

5\. The wallet extension automatically switches to the newly added network.&#x20;
{% endtab %}

{% tab title="With Mobile App" %}
1. Open the Metamask app.
2. Open the app menu and select settings![](<../../.gitbook/assets/image (3).png>)
3. on the settings page, navigate to the networks page![](<../../.gitbook/assets/image (4).png>)
4. A list of available networks are displayed. Click on the `Add Network` button onthe bottom of the page.![](<../../.gitbook/assets/image (2).png>)&#x20;
5. A new windom pops up, prompting you to fill in the connection details. Fill in the details provided above and click add.

![](<../../.gitbook/assets/image (8).png>)

6\. The browser extension will direcct you to the wallet page and automatically switches to the newly added network.
{% endtab %}
{% endtabs %}

### Observing Transactions

Curious about your transactions, check out our [block explorer](https://explorer.nahmii.io)!

There you'll find all transactions happening on Nahmii as they come through and also see how much it costs per transactions in gas fees on Nahmii.
